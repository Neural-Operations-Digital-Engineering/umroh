import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
    // Serve AVIF first (smaller), fall back to WebP — both are auto-negotiated by Next.js Image.
    formats: ["image/avif", "image/webp"],
    // Minimum TTL for optimized images served via /_next/image (in seconds).
    minimumCacheTTL: 86400, // 1 day
  },
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
    "localhost:3000",
  ],
  async headers() {
    return [
      // ── Security headers (unchanged) ────────────────────────────────────────
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },

      // ── Long-lived immutable cache for hashed static assets ─────────────────
      // Next.js appends a content hash to every file under /_next/static/,
      // so a 1-year immutable cache is safe — a new deploy produces new hashes.
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ── Medium-lived cache for public static images (not content-hashed) ────
      // These files don't have a hash in their URL, so we use a 1-day TTL
      // with stale-while-revalidate so repeat visits are instant but updates
      // propagate within a day without needing a hard purge.
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },

      // ── Favicon & manifest (rarely change) ──────────────────────────────────
      {
        source: "/(favicon\\.ico|manifest\\.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/manifest.json",
        destination: "/manifest.webmanifest",
      },
    ];
  },
};

export default nextConfig;

