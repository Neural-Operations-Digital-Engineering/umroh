import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authorizeSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getBearerToken(request: NextRequest) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : "";
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ stored: false, error: "Inquiry belum dapat disimpan karena Supabase belum dikonfigurasi." }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await client.from("cms_inquiries").insert({
    package_id: text(body.packageId, 120) || null,
    package_name: text(body.packageName, 240) || null,
    contact_name: text(body.contactName, 120) || null,
    contact_phone: text(body.contactPhone, 40) || null,
    message: text(body.message, 1000) || null,
    source_path: text(body.sourcePath, 240) || "/",
    referrer: text(body.referrer, 500) || null,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) || null,
  });

  if (error) {
    const missingTable = /cms_inquiries|schema cache|relation/i.test(error.message);
    return NextResponse.json(
      { error: missingTable ? "Tabel inquiry belum aktif. Jalankan migration Supabase 003/005 terlebih dahulu." : "Inquiry belum dapat disimpan." },
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
    .select("id, package_id, package_name, contact_name, contact_phone, message, source_path, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    const missingTable = /cms_inquiries|schema cache|relation/i.test(error.message);
    return NextResponse.json(
      { error: missingTable ? "Tabel inquiry belum aktif. Jalankan migration Supabase 003/005 terlebih dahulu." : "Inquiry belum dapat dimuat." },
      { status: 503 }
    );
  }
  return NextResponse.json({ inquiries: data || [] });
}
