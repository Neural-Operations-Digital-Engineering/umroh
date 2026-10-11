import React from "react";
import HeroSection from "@/components/HeroSection";
import PackageFinderWidget from "@/components/PackageFinderWidget";
import TrustBar from "@/components/TrustBar";
import FeaturedPackagesSection from "@/components/FeaturedPackagesSection";
import DestinationShowcaseSection from "@/components/DestinationShowcaseSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import CtaBannerSection from "@/components/CtaBannerSection";
import { HowItWorksSection, LegalityTeaser } from "@/components/SiteContentPages";
import { getSiteData } from "@/lib/cms/store";

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

      {/* 4. Featured Packages Section with Tabs & Horizontal Snap Rail on Mobile */}
      <FeaturedPackagesSection packages={packages} />

      {/* 5. Destination Showcase (Halal Tour & Ziarah) */}
      <DestinationShowcaseSection company={company} />

      {/* 6. Kenapa Memilih Kami (Editorial Service Standard) */}
      <WhyUsSection />

      {/* 7. Alur Keberangkatan (Praktis & Jelas) */}
      <HowItWorksSection company={company} />

      {/* 8. Teaser Bukti Legalitas PPIU & PIHK Resmi */}
      <LegalityTeaser company={company} />

      {/* 9. Dokumentasi Tim & Jemaah Nyata */}
      <TestimonialsSection company={company} />

      {/* 10. FAQ Tanya Jawab Jemaah */}
      <FaqSection company={company} compact />

      {/* 11. CTA Penutup */}
      <CtaBannerSection company={company} />
    </main>
  );
}
