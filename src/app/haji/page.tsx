import React from "react";
import type { Metadata } from "next";
import PackageCatalogView from "@/components/PackageCatalogView";
import { HajiOverviewSection } from "@/components/HomepageStaticSections";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/haji");
  return {
    title: `Paket Haji Khusus & Furoda Resmi Kemenag | ${company.brandName}`,
    description: `Pilihan program Haji Khusus kuota resmi Kemenag RI dan Haji Furoda dengan pendampingan muthowwif serta akomodasi hotel bintang di Makkah & Madinah.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Paket Haji Khusus & Furoda Resmi Kemenag | ${company.brandName}`,
      description: `Pilihan program Haji Khusus kuota resmi Kemenag RI dan Haji Furoda dengan pendampingan muthowwif serta akomodasi hotel bintang di Makkah & Madinah.`,
    },
  };
}

export default async function HajiCatalogPage() {
  const { company, packages } = await getSiteData();
  const hajiPackages = packages.filter((p) => p.isHaji);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Program Haji Khusus", url: "/haji" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <HajiOverviewSection company={company} />
      <PackageCatalogView
        initialPackages={hajiPackages}
        badgeLabel="Informasi Haji Khusus"
        title="Program Haji Khusus & Kuota Resmi"
        subtitle="Bandingkan jadwal, akomodasi, itinerary, dan komponen biaya haji khusus. Konsultasikan antrean nomor porsi dan kuota melalui kanal resmi."
        defaultPackageType="khusus"
        catalogScope="haji"
      />
    </main>
  );
}

