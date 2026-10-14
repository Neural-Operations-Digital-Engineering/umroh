export type InquirySource = "general" | "package" | "service" | "page";

export interface InquiryPackageContext {
  id: string;
  name: string;
  category?: string;
  price?: string;
  href?: string;
}

export interface InquiryContext {
  source: InquirySource;
  label: string;
  pagePath: string;
  package?: InquiryPackageContext;
}

export interface InquiryFormValues {
  name: string;
  phone: string;
  message: string;
}

export interface InquiryMessageInput {
  form: InquiryFormValues;
  context: InquiryContext;
}

function nonEmpty(value: string | undefined) {
  return value?.trim() || "";
}

export function buildInquiryMessage({ form, context }: InquiryMessageInput) {
  const lines = [
    context.package ? "INQUIRY JAMAAH | KONSULTASI PAKET" : "INQUIRY JAMAAH | KONSULTASI",
    "",
    ...(form.name ? [`Nama: ${form.name}`] : []),
    ...(form.phone ? [`Nomor WhatsApp: ${form.phone}`] : []),
    `Jenis Inquiry: ${context.label}`,
  ];

  if (context.package) {
    lines.push(
      "",
      "Informasi Paket",
      `- Nama Paket: ${context.package.name}`,
      ...(nonEmpty(context.package.category) ? [`- Kategori: ${context.package.category}`] : []),
      ...(nonEmpty(context.package.price) ? [`- Harga: ${context.package.price}`] : []),
      ...(nonEmpty(context.package.href) ? [`- Referensi: ${context.package.href}`] : []),
    );
  }

  if (form.message) {
    lines.push("", "Detail Pertanyaan", form.message);
  }

  lines.push("", `Halaman sumber: ${context.pagePath}`, "", "Mohon ditindaklanjuti sesuai kebutuhan jamaah.");
  return lines.join("\n");
}

export function getWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
