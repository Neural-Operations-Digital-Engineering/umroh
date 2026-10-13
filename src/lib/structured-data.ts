import type { CompanyProfile } from "@/data/company";
import type { Package } from "@/types/package";
import { getAbsoluteUrl, getSiteUrl } from "./site-url";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function getOrganizationSchema(company: CompanyProfile) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    name: company.brandName,
    legalName: company.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/kaaba-courtyard.png`,
    image: `${siteUrl}${company.media?.heroUrl || "/images/minaret-hero.jpg"}`,
    description: "Penyelenggara Perjalanan Ibadah Umroh dan Haji Khusus Berizin Resmi Kemenag RI.",
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: "Kota Cirebon",
      addressRegion: "Jawa Barat",
      postalCode: "45131",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-6.7320",
      longitude: "108.5523",
    },
    sameAs: [
      company.instagramHandle ? `https://instagram.com/${company.instagramHandle.replace("@", "")}` : undefined,
    ].filter(Boolean),
    priceRange: "$$",
    paymentAccepted: "Cash, Bank Transfer",
    currenciesAccepted: "IDR, USD",
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getProductSchema(pkg: Package, company: CompanyProfile) {
  const packageUrl = getAbsoluteUrl(`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`);
  const siteUrl = getSiteUrl();

  const lowestPrice = pkg.roomPricing?.length
    ? pkg.roomPricing.reduce((lowest, room) => (room.numeric > 0 && room.numeric < lowest ? room.numeric : lowest), Number.MAX_SAFE_INTEGER)
    : pkg.priceNumeric;

  const validPrice = lowestPrice && lowestPrice !== Number.MAX_SAFE_INTEGER ? lowestPrice : pkg.priceNumeric;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: `Paket ${pkg.name} durasi ${pkg.duration} keberangkatan ${pkg.departureDate} bersama maskapai ${pkg.airline}, hotel Makkah ${pkg.hotelMakkah}, hotel Madinah ${pkg.hotelMadinah}.`,
    image: pkg.imageUrl ? (pkg.imageUrl.startsWith("http") ? pkg.imageUrl : `${siteUrl}${pkg.imageUrl}`) : `${siteUrl}/images/destinations/mekkah.jpg`,
    url: packageUrl,
    sku: pkg.id,
    brand: {
      "@type": "Brand",
      name: company.brandName,
    },
    offers: {
      "@type": "Offer",
      url: packageUrl,
      priceCurrency: "IDR",
      price: validPrice || 33500000,
      priceValidUntil: "2026-12-31",
      availability: pkg.statusType === "soldout" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: company.legalName,
      },
    },
  };
}
