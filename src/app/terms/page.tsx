import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/cms/store";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSiteData();
  const canonicalUrl = getAbsoluteUrl("/terms");
  return {
    title: `Syarat & Ketentuan Pendaftaran | ${company.brandName}`,
    description: `Syarat, ketentuan pembayaran, prosedur pembatalan, dan hak kewajiban jemaah pada ${company.brandName}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Syarat & Ketentuan Pendaftaran | ${company.brandName}`,
      description: `Syarat, ketentuan pembayaran, prosedur pembatalan, dan hak kewajiban jemaah pada ${company.brandName}.`,
    },
  };
}

const tocItems = [
  { id: "persyaratan-pendaftaran", label: "Persyaratan Pendaftaran" },
  { id: "prosedur-pembayaran", label: "Prosedur Pembayaran" },
  { id: "kebijakan-pembatalan", label: "Kebijakan Pembatalan" },
  { id: "force-majeure", label: "Force Majeure" },
  { id: "layanan-pengaduan", label: "Layanan Pengaduan" },
];

export default async function TermsPage() {
  const { company } = await getSiteData();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Syarat & Ketentuan", url: "/terms" },
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
          <span className="text-teal-primary font-semibold">Syarat &amp; Ketentuan</span>
        </nav>

        {/* Header */}
        <div className="space-y-3 border-b border-warm-border pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-gold-light text-teal-primary text-xs font-bold uppercase tracking-wider border border-gold-border">
            Ketentuan Perjalanan Ibadah
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-primary">
            Syarat &amp; Ketentuan Pendaftaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted">
            Panduan resmi pendaftaran, pembayaran, dan kebijakan pembatalan &bull; {company.brandName}
          </p>
        </div>

        {/* 2-col: Content + sticky ToC sidebar */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Content Body */}
          <div className="flex-1 min-w-0 bg-warm-surface border border-warm-border rounded-card p-6 sm:p-10 shadow-card space-y-8 text-xs sm:text-sm text-slate-body leading-relaxed">
            <section id="persyaratan-pendaftaran" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                1. Persyaratan Pendaftaran Jemaah
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-muted">
                <li>Paspor asli dengan masa berlaku minimal 7 (tujuh) bulan dari tanggal rencana kepulangan ke Indonesia.</li>
                <li>Nama di paspor minimal terdiri dari 2 (dua) kata (contoh: Muhammad Nizar).</li>
                <li>Fotokopi KTP, Kartu Keluarga, dan Buku Nikah (bagi suami-istri) atau Akta Kelahiran (bagi anak).</li>
                <li>Sertifikat vaksinasi resmi yang disyaratkan oleh otoritas Indonesia dan Arab Saudi.</li>
                <li>Membayar Uang Muka (DP) sesuai paket yang dipilih untuk mengunci kuota tiket dan hotel.</li>
              </ul>
            </section>

            <section id="prosedur-pembayaran" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                2. Prosedur Pembayaran &amp; Keamanan Rekening
              </h2>
              <p>
                Seluruh transaksi pembayaran DP maupun pelunasan hanya sah jika ditransfer ke rekening bank resmi atas nama:
              </p>
              <div className="bg-warm-bg p-4 rounded-button border border-warm-border space-y-1 font-mono text-xs">
                {company.bankAccounts.map((b) => (
                  <p key={b.bank}><strong className="text-teal-primary">{b.bank}:</strong> {b.account} (a.n. {company.legalName})</p>
                ))}
              </div>
              <div className="text-amber-900 bg-amber-50 p-3.5 rounded-button border border-amber-200 text-xs flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                  i
                </span>
                <p>
                  <strong>Pemberitahuan Keamanan:</strong> Kami tidak bertanggung jawab atas pembayaran yang dilakukan ke nomor rekening pribadi di luar rekening resmi terdaftar di atas.
                </p>
              </div>
            </section>

            <section id="kebijakan-pembatalan" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                3. Kebijakan Pembatalan &amp; Pengembalian Dana (Refund)
              </h2>
              <p>
                Bila jemaah membatalkan keberangkatan karena alasan pribadi, ketentuan pengembalian dana mengikuti tahapan proses tiket &amp; visa yang telah diterbitkan:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-muted">
                <li>Pembatalan sebelum tiket pesawat diterbitkan (<em>issued</em>): DP dikembalikan setelah dipotong biaya administrasi pendaftaran.</li>
                <li>Pembatalan setelah tiket pesawat diterbitkan: Dikenakan biaya potongan sesuai kebijakan <em>cancellation fee</em> maskapai terkait.</li>
                <li>Pembatalan setelah visa dan hotel terbit/terkunci: Biaya visa dan kamar hotel yang tidak dapat di-<em>refund</em> oleh pihak hotel/muassasah Saudi menjadi tanggungan jemaah.</li>
              </ul>
            </section>

            <section id="force-majeure" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                4. Keadaan Kahar (Force Majeure)
              </h2>
              <p>
                Apabila terjadi perubahan jadwal atau pembatalan akibat bencana alam, perang, penutupan bandara oleh otoritas pemerintah, atau kebijakan darurat Kerajaan Arab Saudi (Force Majeure), {company.brandName} akan berkoordinasi secara terbuka untuk penjadwalan ulang (<em>reschedule</em>) atau solusi terbaik sesuai hak jemaah.
              </p>
            </section>

            <section id="layanan-pengaduan" className="space-y-3 scroll-mt-24">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-teal-primary border-b border-warm-border pb-2">
                5. Layanan Pengaduan &amp; Bantuan Jemaah
              </h2>
              <p>
                Untuk pertanyaan lebih lanjut mengenai ketentuan paket dan pendaftaran, silakan hubungi tim customer relation kami di WhatsApp <strong className="text-teal-primary">{company.phone}</strong> atau email <strong className="text-teal-primary">{company.email}</strong>.
              </p>
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
                    className="flex items-center gap-2.5 py-1.5 text-xs text-slate-body hover:text-teal-primary transition-colors group"
                  >
                    <span className="font-mono text-[10px] text-slate-caption group-hover:text-teal-primary shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{item.label}</span>
                  </a>
                ))}
              </nav>
              <div className="pt-2 border-t border-warm-border">
                <Link
                  href="/legalitas"
                  className="text-[11px] text-teal-primary hover:text-gold-hover font-semibold transition-colors"
                >
                  Lihat Legalitas Resmi &rarr;
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
