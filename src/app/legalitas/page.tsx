import type { Metadata } from "next";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import { LegalityPageContent } from "@/components/SiteContentPages";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/legalitas");
  return {
    title: `Legalitas Resmi & Rekening Perusahaan | ${company.brandName}`,
    description: `Izin resmi SK PPIU No. ${company.legal.ppiu}, NIB, NPWP, sertifikasi akreditasi KAN, dan nomor rekening resmi bank atas nama ${company.legalName}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Legalitas Resmi & Rekening Perusahaan | ${company.brandName}`,
      description: `Izin resmi SK PPIU No. ${company.legal.ppiu}, NIB, NPWP, sertifikasi akreditasi KAN, dan nomor rekening resmi bank atas nama ${company.legalName}.`,
    },
  };
}

export default async function LegalitasPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Legalitas & Rekening", url: "/legalitas" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <LegalityPageContent company={company} />
    </>
  );
}

