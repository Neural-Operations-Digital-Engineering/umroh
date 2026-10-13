import type { Metadata } from "next";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import { AboutPageContent } from "@/components/SiteContentPages";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/tentang");
  return {
    title: `Profil & Legalitas Risalah Madina Tour | Biro Umroh Berizin Resmi`,
    description: `Mengenal ${company.legalName} (${company.brandName}), biro perjalanan ibadah Umroh dan Haji Khusus berizin Kemenag RI di Cirebon.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Profil & Legalitas Risalah Madina Tour | Biro Umroh Berizin Resmi`,
      description: `Mengenal ${company.legalName} (${company.brandName}), biro perjalanan ibadah Umroh dan Haji Khusus berizin Kemenag RI di Cirebon.`,
    },
  };
}

export default async function TentangPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Tentang Kami", url: "/tentang" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <AboutPageContent company={company} />
    </>
  );
}

