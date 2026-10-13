import type { Metadata } from "next";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, getFaqSchema, serializeJsonLd } from "@/lib/structured-data";
import FaqSection from "@/components/FaqSection";
import { getFaqItems } from "@/data/faq";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/faq");
  return {
    title: `Tanya Jawab & Panduan Umroh Haji | ${company.brandName}`,
    description:
      "Pertanyaan umum seputar pendaftaran, dokumen paspor/visa, biaya DP, tipe kamar, serta transparansi fasilitas perjalanan ibadah Umroh dan Haji.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Tanya Jawab & Panduan Umroh Haji | ${company.brandName}`,
      description:
        "Pertanyaan umum seputar pendaftaran, dokumen paspor/visa, biaya DP, tipe kamar, serta transparansi fasilitas perjalanan ibadah Umroh dan Haji.",
    },
  };
}

export default async function FaqPage() {
  const { company } = await getSiteData();
  const faqs = getFaqItems(company);
  const faqSchema = getFaqSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Tanya Jawab (FAQ)", url: "/faq" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <FaqSection company={company} isHeadingH1={true} />
    </main>
  );
}

