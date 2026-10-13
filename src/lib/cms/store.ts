import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getDefaultSiteData } from "@/lib/cms/default-data";
import type { SiteData } from "@/lib/cms/types";
import { getSupabaseSiteData, isSupabaseConfigured } from "@/lib/supabase/server";

const contentPath = path.join(process.cwd(), "content", "site-data.json");
export const SITE_DATA_CACHE_TAG = "cms-site-data";

// unstable_cache: persists across requests with a 5-minute TTL (CDN/ISR layer).
const getCachedSupabaseSiteData = unstable_cache(
  async () => {
    const data = await getSupabaseSiteData();
    if (!data) throw new Error("CMS data Supabase tidak tersedia.");
    return data;
  },
  ["cms-site-data"],
  { tags: [SITE_DATA_CACHE_TAG], revalidate: 300 },
);

function isSiteData(value: unknown): value is SiteData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteData>;
  return Boolean(candidate.company && Array.isArray(candidate.packages));
}

// React.cache deduplicates calls within the same request/render pass.
// layout.tsx and page.tsx both call getSiteData() — without this they would
// issue two independent fetches to Supabase (or two fs reads) per page load.
export const getSiteData: () => Promise<SiteData> = cache(async () => {
  if (isSupabaseConfigured) {
    try {
      return await getCachedSupabaseSiteData();
    } catch (error) {
      if (process.env.NODE_ENV === "production") throw error;
    }
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase wajib dikonfigurasi di production untuk membaca data CMS.");
  }

  try {
    const raw = await readFile(contentPath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (isSiteData(parsed)) return parsed;
  } catch {
    // Local development can use the in-memory seed, but a request never writes to disk.
  }

  return getDefaultSiteData();
});
