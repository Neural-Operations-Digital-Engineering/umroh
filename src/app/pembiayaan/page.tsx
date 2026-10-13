import type { Metadata } from "next";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import FinancingSection from "@/components/FinancingSection";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/pembiayaan");
  return {
    title: `Program Tabungan & Pembiayaan Umroh Syariah | ${company.brandName}`,
    description:
      "Informasi skema tabungan Umroh, estimasi angsuran, DP Haji Khusus USD 5.000, serta simulasi jangka waktu menabung yang transparan dan aman.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Program Tabungan & Pembiayaan Umroh Syariah | ${company.brandName}`,
      description:
        "Informasi skema tabungan Umroh, estimasi angsuran, DP Haji Khusus USD 5.000, serta simulasi jangka waktu menabung yang transparan dan aman.",
    },
  };
}

export default async function PembiayaanPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Pembiayaan & Tabungan", url: "/pembiayaan" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <FinancingSection company={company} isHeadingH1={true} />
    </main>
  );
}

