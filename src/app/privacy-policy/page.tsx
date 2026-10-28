import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/privacy-policy");
  return {
    title: `Kebijakan Privasi | ${company.brandName}`,
    description: `Kebijakan privasi dan perlindungan data pribadi jemaah Umroh dan Haji pada ${company.brandName}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Kebijakan Privasi | ${company.brandName}`,
      description: `Kebijakan privasi dan perlindungan data pribadi jemaah Umroh dan Haji pada ${company.brandName}.`,
    },
  };
}

const tocItems = [
  { id: "komitmen-privasi", label: "Komitmen Perlindungan Privasi" },
  { id: "data-dikumpulkan", label: "Data yang Dikumpulkan" },
  { id: "penggunaan-data", label: "Penggunaan Data" },
  { id: "inquiry-konsultasi", label: "Inquiry Konsultasi Website" },
  { id: "keamanan-data", label: "Keamanan & Larangan Jual Data" },
  { id: "hak-jemaah", label: "Hak Jemaah & Kontak" },
];

export default async function PrivacyPolicyPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Kebijakan Privasi", url: "/privacy-policy" },
  ]);

  return (
    <main className="min-h-screen bg-warm-bg py-10 sm:py-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-caption flex items-center gap-2 mb-8">
          <Link href="/" className="hover:text-teal-primary">Beranda</Link>
          <span>/</span>
          <span className="text-teal-primary font-semibold">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="space-y-3 border-b border-warm-border pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-teal-primary/8 text-teal-primary text-xs font-bold uppercase tracking-wider">
            Perlindungan Data Jemaah
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-primary">
            Kebijakan Privasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted">
            Terakhir diperbarui: Maret 2026 &bull; {company.legalName} ({company.brandName})
          </p>
        </div>

        {/* 2-col: Content + sticky ToC sidebar */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Content Body */}
          <div className="flex-1 min-w-0 bg-warm-surface border border-warm-border rounded-card p-6 sm:p-10 shadow-card space-y-8 text-xs sm:text-sm text-slate-body leading-relaxed">
            <section id="komitmen-privasi" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                1. Komitmen Perlindungan Privasi
              </h2>
              <p>
                {company.brandName} (dikelola secara legal oleh {company.legalName} dengan Izin PPIU Kemenag RI No. {company.legal.ppiu}) menghormati dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi setiap calon jemaah dan jemaah aktif sesuai peraturan perundang-undangan Republik Indonesia (UU Perlindungan Data Pribadi).
              </p>
            </section>

            <section id="data-dikumpulkan" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                2. Data Pribadi yang Kami Kumpulkan
              </h2>
              <p>
                Untuk memproses pendaftaran ibadah Umroh dan Haji, kami mengumpulkan data yang diperlukan untuk penerbitan visa resmi, tiket pesawat, dan akomodasi hotel di Arab Saudi:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-muted">
                <li>Identitas diri: Nama lengkap, NIK/KTP, Tempat &amp; Tanggal Lahir, Nama Ayah Kandung.</li>
                <li>Dokumen perjalanan: Nomor Paspor, masa berlaku, tempat penerbitan, dan pindaian paspor.</li>
                <li>Kontak: Nomor telepon/WhatsApp aktif, alamat domisili, dan alamat email.</li>
                <li>Informasi medis &amp; kontak darurat: Riwayat kesehatan penting dan kontak keluarga darurat.</li>
              </ul>
            </section>

            <section id="penggunaan-data" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                3. Penggunaan Data Jemaah
              </h2>
              <p>
                Data jemaah hanya digunakan untuk keperluan resmi pelaksanaan ibadah:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-muted">
                <li>Penerbitan Visa Umroh / Haji melalui sistem Kementerian Haji &amp; Umrah Kerajaan Arab Saudi (Nusuk / Muassasah).</li>
                <li>Penerbitan tiket pesawat maskapai penerbangan internasional dan manifest bandara.</li>
                <li>Pemesanan kamar hotel dan layanan katering di Makkah &amp; Madinah.</li>
                <li>Pendaftaran asuransi perjalanan ibadah resmi.</li>
              </ul>
            </section>

            <section id="inquiry-konsultasi" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                4. Inquiry Konsultasi Website
              </h2>
              <p>
                Saat calon jemaah meminta konsultasi melalui website, kami dapat menyimpan nama, nomor WhatsApp, pertanyaan, paket yang dilihat, dan sumber halaman untuk membantu tindak lanjut admin. Data ini disimpan pada sistem CMS terproteksi dan tidak dimasukkan ke URL WhatsApp.
              </p>
            </section>

            <section id="keamanan-data" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                5. Keamanan &amp; Larangan Penjualan Data
              </h2>
              <p>
                Kami tidak pernah menjual, menyewakan, atau membagikan data pribadi jemaah kepada pihak ketiga untuk kepentingan komersial/iklan di luar ekosistem perjalanan ibadah Anda.
              </p>
            </section>

            <section id="hak-jemaah" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                6. Hak Jemaah &amp; Kontak Pengelola Data
              </h2>
              <p>
                Jemaah berhak untuk meminta pembaharuan, koreksi, atau penghapusan data setelah seluruh kewajiban administrasi keberangkatan selesai. Hubungi kami melalui:
              </p>
              <div className="bg-warm-bg p-4 rounded-button border border-warm-border text-xs space-y-1">
                <p><strong>{company.brandName}</strong> ({company.legalName})</p>
                <p>Alamat: {company.address}</p>
                <p>Email: {company.email}</p>
                <p>Telepon: {company.phone}</p>
              </div>
            </section>
          </div>

          {/* Sticky Daftar Isi Sidebar — desktop only */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
            <div className="rounded-card border border-warm-border bg-warm-surface p-4 shadow-card space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-muted">
                Daftar Isi
              </p>
              <nav aria-label="Daftar Isi" className="space-y-1">
                {tocItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-start gap-2.5 py-1.5 text-xs text-slate-body hover:text-teal-primary transition-colors group"
                  >
                    <span className="font-mono text-[10px] text-slate-caption group-hover:text-teal-primary shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{item.label}</span>
                  </a>
                ))}
              </nav>
              <div className="pt-2 border-t border-warm-border">
                <Link
                  href="/terms"
                  className="text-[11px] text-teal-primary hover:text-gold-hover font-semibold transition-colors"
                >
                  Syarat &amp; Ketentuan &rarr;
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
