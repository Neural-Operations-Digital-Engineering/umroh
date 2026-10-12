import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import PackageFinderWidget from "@/components/PackageFinderWidget";
import TrustBar from "@/components/TrustBar";
import { getSiteData } from "@/lib/cms/store";

// ── Above-the-fold components are imported directly (no dynamic) ──────────────
// HeroSection, PackageFinderWidget, TrustBar render synchronously so the
// browser can paint the initial viewport without waiting for JS chunks.

// ── Below-the-fold: lazy-loaded with next/dynamic ────────────────────────────
// SSR is kept ON (default) for all sections that contain meaningful text content
// so search engines can index them. Only the JS bundle is deferred to a later
// chunk; the HTML is still server-rendered.
//
// Placeholder min-heights match each section's approximate rendered height to
// prevent layout shifts (CLS) as the JS hydrates.

const FeaturedPackagesSection = dynamic(
  () => import("@/components/FeaturedPackagesSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[520px] bg-warm-bg" aria-hidden="true" />,
  }
);

const DestinationShowcaseSection = dynamic(
  () => import("@/components/DestinationShowcaseSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[540px] bg-[#0b1015]" aria-hidden="true" />,
  }
);

const WhyUsSection = dynamic(
  () => import("@/components/WhyUsSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[320px] bg-warm-surface" aria-hidden="true" />,
  }
);

// SiteContentPages exports two named components — dynamic handles named exports
// via a .then() re-export pattern.
const HowItWorksSection = dynamic(
  () => import("@/components/SiteContentPages").then((m) => m.HowItWorksSection),
  {
    ssr: true,
    loading: () => <div className="min-h-[320px] bg-warm-bg" aria-hidden="true" />,
  }
);

const LegalityTeaser = dynamic(
  () => import("@/components/SiteContentPages").then((m) => m.LegalityTeaser),
  {
    ssr: true,
    loading: () => <div className="min-h-[260px] bg-warm-bg" aria-hidden="true" />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[400px] bg-warm-surface" aria-hidden="true" />,
  }
);

const FaqSection = dynamic(
  () => import("@/components/FaqSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[320px] bg-warm-bg" aria-hidden="true" />,
  }
);

const CtaBannerSection = dynamic(
  () => import("@/components/CtaBannerSection"),
  {
    ssr: true,
    loading: () => <div className="min-h-[240px] bg-teal-primary" aria-hidden="true" />,
  }
);

export default async function BerandaPage() {
  const { company, packages } = await getSiteData();

  // Extract actual available months and cities from packages data
  const availableMonths = Array.from(
    new Set(packages.map((p) => p.departureMonth).filter(Boolean))
  );
  const availableCities = Array.from(
    new Set(packages.map((p) => p.departureCity).filter(Boolean))
  );

  return (
    <main className="bg-warm-bg">
      {/* 1. Atmospheric Hero Section with Video/Photo & Service Signals */}
      <HeroSection company={company} />

      {/* 2. Interactive Package Finder Widget (Search Engine) */}
      <PackageFinderWidget
        availableMonths={availableMonths.length > 0 ? availableMonths : undefined}
        cities={availableCities.length > 0 ? availableCities : undefined}
      />

      {/* 3. Official Trust & Legality Credibility Strip */}
      <div className="pt-8 sm:pt-10">
        <TrustBar company={company} />
      </div>

      {/* 4. Featured Packages Section — lazy, SSR */}
      <FeaturedPackagesSection packages={packages} />

      {/* 5. Destination Showcase — lazy, SSR */}
      <DestinationShowcaseSection company={company} />

      {/* 6. Kenapa Memilih Kami — lazy, SSR */}
      <WhyUsSection />

      {/* 7. Alur Keberangkatan — lazy, SSR */}
      <HowItWorksSection company={company} />

      {/* 8. Teaser Bukti Legalitas — lazy, SSR */}
      <LegalityTeaser company={company} />

      {/* 9. Dokumentasi Tim & Jemaah — lazy, SSR */}
      <TestimonialsSection company={company} />

      {/* 10. FAQ — lazy, SSR */}
      <FaqSection company={company} compact />

      {/* 11. CTA Penutup — lazy, SSR */}
      <CtaBannerSection company={company} />
    </main>
  );
}
