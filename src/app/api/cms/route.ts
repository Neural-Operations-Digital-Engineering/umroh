import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDefaultSiteData } from "@/lib/cms/default-data";
import { getSiteData, SITE_DATA_CACHE_TAG } from "@/lib/cms/store";
import type { SiteData } from "@/lib/cms/types";
import { authorizeSupabase, isSupabaseConfigured, writeSupabaseSiteData } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function getBearerToken(request: NextRequest) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice(7) : "";
}

function isSiteData(value: unknown): value is SiteData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteData>;
  return Boolean(candidate.company && Array.isArray(candidate.packages));
}

function invalidateSiteData() {
  revalidateTag(SITE_DATA_CACHE_TAG, "max");
  revalidatePath("/", "layout");
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "CMS tidak tersedia: Supabase belum dikonfigurasi." }, { status: 503 });
  }
  try {
    return NextResponse.json(await getSiteData());
  } catch (error) {
    console.error("[cms] Gagal membaca data Supabase", error);
    return NextResponse.json({ error: "Data CMS sedang tidak tersedia." }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = getBearerToken(request);
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "CMS tidak tersedia: Supabase wajib dikonfigurasi." }, { status: 503 });
  }
  let authContext: Awaited<ReturnType<typeof authorizeSupabase>> = null;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Login Supabase dengan role editor/admin diperlukan." },
      { status: 401 }
    );
  }
  authContext = await authorizeSupabase(accessToken);
  if (!authContext) {
    return NextResponse.json(
      { error: "Sesi Supabase tidak valid atau akun Anda tidak memiliki hak akses editor/admin." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format body JSON tidak valid." }, { status: 400 });
  }

  // Handle Reset Action — Strictly restricted to admin role
  if (body && typeof body === "object" && "reset" in body && (body as { reset?: boolean }).reset === true) {
    if (authContext.role !== "admin") {
      return NextResponse.json(
        { error: "Hanya akun dengan role admin yang diizinkan mereset data ke seed awal." },
        { status: 403 }
      );
    }
    const seed = getDefaultSiteData();
    const expectedUpdatedAt = (body as { updated_at?: string }).updated_at;
    if (!expectedUpdatedAt) {
      return NextResponse.json({ error: "Versi data wajib dikirim sebelum reset." }, { status: 400 });
    }
    const result = await writeSupabaseSiteData(seed, authContext, expectedUpdatedAt);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          conflict: result.conflict,
          currentUpdatedAt: result.conflict ? result.currentUpdatedAt : undefined,
        },
        { status: result.conflict ? 409 : 500 }
      );
    }
    invalidateSiteData();
    return NextResponse.json(result.data);
  }

  if (!isSiteData(body)) {
    return NextResponse.json({ error: "Format data CMS tidak valid." }, { status: 400 });
  }

  const expectedUpdatedAt = (body as { updated_at?: string }).updated_at;

  if (!expectedUpdatedAt) {
    return NextResponse.json({ error: "Versi data wajib dikirim sebelum menyimpan." }, { status: 400 });
  }

  const result = await writeSupabaseSiteData(body, authContext, expectedUpdatedAt);
  if (!result.success) {
    if (result.conflict) {
      return NextResponse.json(
        {
          error: result.message,
          conflict: true,
          currentUpdatedAt: result.currentUpdatedAt,
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: result.message }, { status: 500 });
  }
  invalidateSiteData();
  return NextResponse.json(result.data);
}

