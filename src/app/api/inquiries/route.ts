import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authorizeSupabase, isSupabaseConfigured } from "@/lib/supabase/server";
import type { InquiryContext, InquirySource } from "@/lib/inquiry";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const inquiryRateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function getBearerToken(request: NextRequest) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : "";
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function path(value: unknown) {
  const candidate = text(value, 240);
  return candidate.startsWith("/") && !candidate.startsWith("//") ? candidate : "/";
}

function getClientKey(request: NextRequest) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function consumeRateLimit(key: string) {
  const now = Date.now();
  const current = inquiryRateLimit.get(key);
  if (!current || current.resetAt <= now) {
    inquiryRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

const inquirySources = new Set<InquirySource>(["general", "package", "service", "page"]);

function normalizeContext(value: unknown, sourcePath: string, packageId: string, packageName: string): InquiryContext {
  const raw = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const source = inquirySources.has(raw.source as InquirySource) ? raw.source as InquirySource : packageId || packageName ? "package" : "general";
  const label = text(raw.label, 120) || (source === "package" ? "Konsultasi paket" : "Konsultasi umum");
  const pagePath = path(raw.pagePath) === "/" ? sourcePath : path(raw.pagePath);
  const rawPackage = raw.package && typeof raw.package === "object" && !Array.isArray(raw.package) ? raw.package as Record<string, unknown> : null;
  const context: InquiryContext = { source, label, pagePath };

  if (source === "package" || rawPackage) {
    const id = text(rawPackage?.id, 120) || packageId;
    const name = text(rawPackage?.name, 240) || packageName;
    if (id || name) {
      context.package = {
        id,
        name,
        category: text(rawPackage?.category, 120) || undefined,
        price: text(rawPackage?.price, 160) || undefined,
        href: text(rawPackage?.href, 240) || undefined,
      };
    }
  }

  return context;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ stored: false, error: "Inquiry belum dapat disimpan karena Supabase belum dikonfigurasi." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ stored: false, error: "Format body inquiry tidak valid." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ stored: false, error: "Format body JSON tidak valid." }, { status: 400 });
  }

  // Honeypot: automated submissions are acknowledged without storing PII.
  if (text(body.website, 120)) return NextResponse.json({ stored: true }, { status: 201 });

  const contactName = text(body.contactName, 120);
  const contactPhone = text(body.contactPhone, 40);
  const packageId = text(body.packageId, 120);
  const packageName = text(body.packageName, 240);
  const sourcePath = path(body.sourcePath);
  if (!contactName || !contactPhone || contactPhone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ stored: false, error: "Nama dan nomor WhatsApp wajib diisi." }, { status: 400 });
  }

  const context = normalizeContext(body.context, sourcePath, packageId, packageName);

  const limit = consumeRateLimit(getClientKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { stored: false, error: "Terlalu banyak permintaan. Silakan coba lagi beberapa menit lagi." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await client.from("cms_inquiries").insert({
    package_id: packageId || null,
    package_name: packageName || null,
    contact_name: contactName,
    contact_phone: contactPhone,
    message: text(body.message, 1000) || null,
    source_path: sourcePath,
    referrer: text(body.referrer, 500) || null,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
    context,
  });

  if (error) {
    const missingTable = /cms_inquiries|schema cache|relation|context/i.test(error.message);
    return NextResponse.json(
      { stored: false, error: missingTable ? "Tabel inquiry atau kolom konteks belum aktif. Jalankan migration Supabase 003/005/006 terlebih dahulu." : "Inquiry belum dapat disimpan." },
      { status: 503 }
    );
  }
  return NextResponse.json({ stored: true }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const accessToken = getBearerToken(request);
  const authorization = accessToken && isSupabaseConfigured ? await authorizeSupabase(accessToken) : null;
  if (!authorization) return NextResponse.json({ error: "Login admin atau editor diperlukan." }, { status: 401 });

  const { data, error } = await authorization.client
    .from("cms_inquiries")
    .select("id, package_id, package_name, contact_name, contact_phone, message, source_path, context, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    const missingTable = /cms_inquiries|schema cache|relation|context/i.test(error.message);
    return NextResponse.json(
      { error: missingTable ? "Tabel inquiry atau kolom konteks belum aktif. Jalankan migration Supabase 003/005/006 terlebih dahulu." : "Inquiry belum dapat dimuat." },
      { status: 503 }
    );
  }
  return NextResponse.json({ inquiries: data || [] });
}
