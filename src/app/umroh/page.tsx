import React from "react";
import type { Metadata } from "next";
import PackageCatalogView from "@/components/PackageCatalogView";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/umroh");
  return {
    title: `Paket Umroh 2026 Resmi & Terpercaya | ${company.brandName}`,
    description: `Bandingkan jadwal keberangkatan paket Umroh 2026, maskapai Saudia Airlines, hotel Makkah & Madinah dekat masjid, serta transparansi biaya all-in.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Paket Umroh 2026 Resmi & Terpercaya | ${company.brandName}`,
      description: `Bandingkan jadwal keberangkatan paket Umroh 2026, maskapai Saudia Airlines, hotel Makkah & Madinah dekat masjid, serta transparansi biaya all-in.`,
    },
  };
}

export default async function UmrohCatalogPage() {
  const { packages } = await getSiteData();
  const umrohPackages = packages.filter((p) => p.isUmroh);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Katalog Paket Umroh", url: "/umroh" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <PackageCatalogView
        initialPackages={umrohPackages}
        badgeLabel="Jadwal Keberangkatan Umroh"
        title="Katalog Paket Umroh 1448H / 2026M"
        subtitle="Bandingkan tanggal, kota embarkasi, durasi, hotel, fasilitas, dan harga sebelum menghubungi admin. Detail kuota dan komponen biaya perlu dikonfirmasi sebelum mendaftar."
        defaultPackageType="all"
        catalogScope="umroh"
      />
    </main>
  );
}

