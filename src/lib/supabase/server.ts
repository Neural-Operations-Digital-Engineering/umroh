import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import type { SiteData } from "@/lib/cms/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export interface SupabaseAuthContext {
  client: SupabaseClient;
  user: User;
  role: "admin" | "editor";
}

export type SupabaseWriteResult =
  | { success: true; data: SiteData }
  | { success: false; conflict: true; currentUpdatedAt?: string; message: string }
  | { success: false; conflict: false; message: string };

function getClient(accessToken?: string) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      ...(accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
      fetch: async (input, init) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          return await fetch(input, { ...init, signal: controller.signal });
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  });
}

export async function getSupabaseSiteData(): Promise<SiteData | null> {
  const client = getClient();
  if (!client) return null;
  const { data, error } = await client
    .from("cms_site_data")
    .select("company, packages, updated_at")
    .eq("id", true)
    .maybeSingle();
  if (error) throw new Error(`CMS data Supabase gagal dimuat: ${error.message}`);
  if (!data || !data.company || !Array.isArray(data.packages)) {
    throw new Error("Row cms_site_data belum tersedia atau formatnya tidak valid.");
  }
  return {
    company: data.company as SiteData["company"],
    packages: data.packages as SiteData["packages"],
    updated_at: (data.updated_at as string) || undefined,
  };
}

export async function authorizeSupabase(accessToken: string): Promise<SupabaseAuthContext | null> {
  const client = getClient(accessToken);
  if (!client) return null;
  const { data: userData, error: userError } = await client.auth.getUser(accessToken);
  if (userError || !userData.user) return null;
  const { data: member, error: memberError } = await client
    .from("cms_members")
    .select("role")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (memberError || !member || !["admin", "editor"].includes(member.role)) return null;
  return { client, user: userData.user, role: member.role as "admin" | "editor" };
}

export async function writeSupabaseSiteData(
  data: SiteData,
  auth: SupabaseAuthContext,
  expectedUpdatedAt: string
): Promise<SupabaseWriteResult> {
  const { client, user } = auth;

  if (!expectedUpdatedAt || Number.isNaN(new Date(expectedUpdatedAt).getTime())) {
    return {
      success: false,
      conflict: true,
      message: "Versi data wajib dikirim untuk mencegah perubahan editor tertimpa.",
    };
  }

  const newUpdatedAt = new Date().toISOString();
  const { data: updatedRows, error } = await client
    .from("cms_site_data")
    .update({
      company: data.company,
      packages: data.packages,
      updated_at: newUpdatedAt,
      updated_by: user.id,
    })
    .eq("id", true)
    .eq("updated_at", expectedUpdatedAt)
    .select("updated_at");

  if (error) {
    return { success: false, conflict: false, message: error.message };
  }

  if (!updatedRows?.length) {
    const { data: current } = await client
      .from("cms_site_data")
      .select("updated_at")
      .eq("id", true)
      .maybeSingle();
    return {
      success: false,
      conflict: true,
      currentUpdatedAt: current?.updated_at as string | undefined,
      message: "Data telah diperbarui oleh pengguna lain. Silakan muat ulang halaman untuk memperbarui sebelum menyimpan.",
    };
  }

  return {
    success: true,
    data: {
      ...data,
      updated_at: newUpdatedAt,
    },
  };
}

