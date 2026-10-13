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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary">Beranda</Link>
          <span>/</span>
          <span className="text-teal-primary font-semibold">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="space-y-3 border-b border-warm-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-teal-primary/8 text-teal-primary text-xs font-bold uppercase tracking-wider">
            Perlindungan Data Jemaah
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-primary">
            Kebijakan Privasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted">
            Terakhir diperbarui: Maret 2026 • {company.legalName} ({company.brandName})
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-warm-surface border border-warm-border rounded-card p-6 sm:p-10 shadow-card space-y-6 text-xs sm:text-sm text-slate-body leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
              1. Komitmen Perlindungan Privasi
            </h2>
            <p>
              {company.brandName} (dikelola secara legal oleh {company.legalName} dengan Izin PPIU Kemenag RI No. {company.legal.ppiu}) menghormati dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi setiap calon jemaah dan jemaah aktif sesuai peraturan perundang-undangan Republik Indonesia (UU Perlindungan Data Pribadi).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
              2. Data Pribadi yang Kami Kumpulkan
            </h2>
            <p>
              Untuk memproses pendaftaran ibadah Umroh dan Haji, kami mengumpulkan data yang diperlukan untuk penerbitan visa resmi, tiket pesawat, dan akomodasi hotel di Arab Saudi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-muted">
              <li>Identitas diri: Nama lengkap, NIK/KTP, Tempat &amp; Tanggal Lahir, Nama Ayah Kandung.</li>
              <li>Dokumen perjalanan: Nomor Paspor, masa berlaku, tempat penerbitan, dan pindaian paspor.</li>
              <li>Kontak: Nomor telepon/WhatsApp aktif, alamat domisili, dan alamat email.</li>
              <li>Informasi medis &amp; kontak darurat: Riwayat kesehatan penting dan kontak keluarga darurat.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
              3. Penggunaan Data Jemaah
            </h2>
            <p>
              Data jemaah hanya digunakan untuk keperluan resmi pelaksanaan ibadah:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-muted">
              <li>Penerbitan Visa Umroh / Haji melalui sistem Kementerian Haji &amp; Umrah Kerajaan Arab Saudi (Nusuk / Muassasah).</li>
              <li>Penerbitan tiket pesawat maskapai penerbangan internasional dan manifest bandara.</li>
              <li>Pemesanan kamar hotel dan layanan katering di Makkah &amp; Madinah.</li>
              <li>Pendaftaran asuransi perjalanan ibadah resmi.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
              4. Inquiry Konsultasi Website
            </h2>
            <p>
              Saat calon jemaah meminta konsultasi melalui website, kami dapat menyimpan nama, nomor WhatsApp, pertanyaan, paket yang dilihat, dan sumber halaman untuk membantu tindak lanjut admin. Data ini disimpan pada sistem CMS terproteksi dan tidak dimasukkan ke URL WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
              5. Keamanan &amp; Larangan Penjualan Data
            </h2>
            <p>
              Kami tidak pernah menjual, menyewakan, atau membagikan data pribadi jemaah kepada pihak ketiga untuk kepentingan komersial/iklan di luar ekosistem perjalanan ibadah Anda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
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

      </div>
    </main>
  );
}
