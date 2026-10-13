import type { Metadata } from "next";
import { DocumentationPageContent } from "@/components/SiteContentPages";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/dokumentasi");
  return {
    title: `Dokumentasi & Galeri Jamaah | ${company.brandName}`,
    description: `Galeri dokumentasi perjalanan ibadah jemaah ${company.brandName} di Makkah, Madinah, Turki, Dubai, Al Ula, Thaif, dan Mesir.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Dokumentasi & Galeri Jamaah | ${company.brandName}`,
      description: `Galeri dokumentasi perjalanan ibadah jemaah ${company.brandName} di Makkah, Madinah, Turki, Dubai, Al Ula, Thaif, dan Mesir.`,
    },
  };
}

export default async function DokumentasiPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Dokumentasi", url: "/dokumentasi" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <DocumentationPageContent company={company} />
    </>
  );
}

