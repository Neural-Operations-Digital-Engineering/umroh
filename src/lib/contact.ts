import type { Package } from "@/types/package";
import { buildInquiryMessage, getWhatsAppUrl, type InquiryContext } from "@/lib/inquiry";

export function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

export function getPackageWhatsAppUrl(phone: string, pkg: Package) {
  const context: InquiryContext = {
    source: "package",
    label: "Konsultasi paket",
    pagePath: `/paket/${pkg.slug}`,
    package: {
      id: pkg.id,
      name: pkg.name,
      category: pkg.category,
      price: pkg.discountedPrice,
      href: `/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`,
    },
  };
  return getWhatsAppUrl(phone, buildInquiryMessage({ form: { name: "", phone: "", message: "" }, context }));
}

export function getGeneralWhatsAppUrl(phone: string) {
  return getWhatsAppUrl(phone, "Assalamu'alaikum, saya ingin berkonsultasi mengenai paket Umroh/Haji.");
}
