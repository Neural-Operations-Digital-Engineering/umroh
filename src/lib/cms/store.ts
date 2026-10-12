import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getDefaultSiteData } from "@/lib/cms/default-data";
import type { SiteData } from "@/lib/cms/types";
import { getSupabaseSiteData, isSupabaseConfigured } from "@/lib/supabase/server";

const contentDirectory = path.join(process.cwd(), "content");
const contentPath = path.join(contentDirectory, "site-data.json");
export const SITE_DATA_CACHE_TAG = "cms-site-data";

// unstable_cache: persists across requests with a 5-minute TTL (CDN/ISR layer).
const getCachedSupabaseSiteData = unstable_cache(
  async () => getSupabaseSiteData(),
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
    const remoteData = await getCachedSupabaseSiteData();
    if (remoteData) return remoteData;
  }

  try {
    const raw = await readFile(contentPath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (isSiteData(parsed)) return parsed;
  } catch {
    // First request seeds from the checked-in default and writes the local store.
  }

  const seed = getDefaultSiteData();
  await writeSiteData(seed);
  return seed;
});

export async function writeSiteData(data: SiteData): Promise<SiteData> {
  await mkdir(contentDirectory, { recursive: true });
  await writeFile(contentPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return data;
}

export function getContentPath() {
  return contentPath;
}
