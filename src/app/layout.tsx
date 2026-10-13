import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnalyticsScript from "@/components/AnalyticsScript";
import { getSiteData } from "@/lib/cms/store";
import { getSiteUrl } from "@/lib/site-url";
import { getOrganizationSchema, serializeJsonLd } from "@/lib/structured-data";
import "./globals.css";

export const revalidate = 300;

// Variable font covers every weight (100–800) with a single file request instead
// of one file per weight. This removes the 500-weight file that was previously
// loaded but is now redundant, and adds coverage for font-extrabold (800) used
// in HeroSection and DestinationShowcaseSection.
// Not specifying `weight` loads the variable font file (all weights in one file).
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B3B2E",
};

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${company.brandName} | Paket Umroh & Haji Khusus Resmi Kemenag Cirebon`,
      template: `%s | ${company.brandName}`,
    },
    description:
      "Biro perjalanan ibadah Umroh dan Haji Khusus berizin resmi Kemenag RI (PPIU No. 91204028510220002). Transparansi biaya, kepastian jadwal, akomodasi hotel dekat masjid, dan bimbingan ibadah terpercaya.",
    keywords: [
      "Umroh 2026",
      "Paket Umroh Murah Cirebon",
      "Haji Khusus Resmi",
      "Biro Umroh Resmi Kemenag",
      "Umroh Plus Turki",
      "Umroh Plus Thaif",
      company.brandName,
      company.legalName,
    ],
    authors: [{ name: company.brandName }],
    creator: company.brandName,
    publisher: company.legalName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteUrl,
      title: `${company.brandName} | Paket Umroh & Haji Khusus Resmi Kemenag`,
      description:
        "Biro perjalanan ibadah Umroh dan Haji Khusus berizin resmi Kemenag RI (PPIU No. 91204028510220002). Transparansi biaya, kepastian jadwal, akomodasi hotel dekat masjid, dan bimbingan ibadah terpercaya.",
      siteName: company.brandName,
      images: [
        {
          url: company.media?.heroUrl || "/images/kaaba-courtyard.png",
          width: 1200,
          height: 630,
          alt: `Suasana Ibadah ${company.brandName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.brandName} | Paket Umroh & Haji Khusus`,
      description:
        "Penyelenggara perjalanan ibadah Umroh dan Haji Khusus berizin resmi Kemenag RI.",
      images: [company.media?.heroUrl || "/images/kaaba-courtyard.png"],
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { company } = await getSiteData();
  const organizationSchema = getOrganizationSchema(company);

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-warm-bg text-slate-dark flex flex-col selection:bg-gold-accent/20 selection:text-teal-primary"
      >
        {/* Global Analytics Script (GA4/GTM) */}
        <AnalyticsScript />

        {/* Global Header */}
        <Header company={company} />

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>

        {/* Global Footer */}
        <Footer company={company} />

        {/* Floating WhatsApp Action Button */}
        <FloatingWhatsApp company={company} />

        {/* Unobtrusive Cookie Consent Toast */}
        <CookieNotice />
      </body>
    </html>
  );
}

