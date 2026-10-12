"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CompanyProfile } from "@/data/company";
import { getGeneralWhatsAppUrl } from "@/lib/contact";

/* ════════════════════════════════════════════════════════════════════════════════
   1. ABOUT PAGE CONTENT (/tentang)
   ════════════════════════════════════════════════════════════════════════════════ */
export function AboutPageContent({ company }: { company: CompanyProfile }) {
  return (
    <main className="site-shell min-h-screen pb-20 pt-8 font-sans sm:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal-primary font-semibold">Tentang Kami</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-badge bg-gold-light px-3 py-1 text-xs font-bold text-teal-primary border border-gold-border">
              Izin PPIU &amp; PIHK Resmi Kemenag
            </span>
            <span className="rounded-badge bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              Terakreditasi A KAN
            </span>
          </div>

          <h1 className="editorial-title">
            Melayani Tamu Allah dengan Amanah &amp; Kepastian Ibadah
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-body">
            {company.brandName} didirikan di bawah naungan {company.legalName} sebagai wujud pengabdian dalam membimbing jemaah Indonesia menunaikan ibadah Umroh dan Haji Khusus sesuai tuntunan Sunnah Rasulullah SAW.
          </p>
        </div>

        {/* 2-Column Split: Visual & Values on Left, Leadership on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column (6 cols): Profile Card, 5 Pasti Umrah */}
          <div className="min-w-0 lg:col-span-6 space-y-6">
            
            <div className="content-panel overflow-hidden">
              <div className="relative aspect-4/3 w-full bg-teal-900">
                <Image
                  src={company.media?.aboutUrl && company.media.aboutUrl !== "/images/travel-team.jpg" ? company.media.aboutUrl : "/images/kaaba-courtyard.png"}
                  alt="Pelataran Ka'bah di Masjidil Haram"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2">
                <p className="font-serif text-lg font-bold text-teal-primary">{company.legalName}</p>
                <p className="text-xs sm:text-sm text-slate-body leading-relaxed">{company.address}</p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-muted">
                  <span className="rounded-badge bg-warm-bg px-2.5 py-1 border border-warm-border">Telepon: {company.phone}</span>
                  <span className="rounded-badge bg-warm-bg px-2.5 py-1 border border-warm-border">Email: {company.email}</span>
                </div>
              </div>
            </div>

            {/* 5 Pasti Umrah Framework */}
            <div className="content-panel space-y-4 p-6">
              <div className="border-b border-warm-border pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block mb-1">
                  Standar Kementerian Agama RI
                </span>
                <h2 className="font-serif text-xl font-bold text-teal-primary">
                  Komitmen 5 Pasti Umrah
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { title: "1. Pasti Travelnya Berizin", desc: `SK PPIU No. ${company.legal.ppiu} dan SK PIHK No. ${company.legal.pihk}.` },
                  { title: "2. Pasti Jadwal & Tiketnya", desc: "Tiket penerbangan PP telah terkonfirmasi sebelum jemaah berangkat." },
                  { title: "3. Pasti Harganya", desc: "Transparansi penuh komponen biaya tanpa biaya terselubung di tanah suci." },
                  { title: "4. Pasti Hotel & Akomodasinya", desc: "Hotel di ring 1 Makkah dan Madinah dengan fasilitas sesuai kontrak." },
                  { title: "5. Pasti Visanya", desc: "Proses visa resmi Arab Saudi diproses tepat waktu sebelum jadwal manasik." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-teal-primary">{item.title}</p>
                      <p className="text-xs text-slate-body leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (6 cols): Leadership Team & Medical Assistance */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block">
                Tim Pembimbing &amp; Manajemen
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                Dewan Pembimbing Ibadah &amp; Kepemimpinan
              </h2>
              <p className="text-xs sm:text-sm text-slate-body leading-relaxed">
                Dipimpin oleh para asatidz dan profesional yang berpengalaman puluhan tahun dalam melayani perjalanan ibadah jemaah ke Tanah Suci.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {company.leaders.map((leader) => (
                <article
                  key={leader.name}
                  className="rounded-card border border-warm-border bg-warm-surface p-5 shadow-card space-y-3 flex flex-col justify-between hover:border-teal-primary/30 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-primary/10 border border-teal-primary/20 flex items-center justify-center text-teal-primary font-serif font-bold text-base shrink-0">
                        {leader.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-teal-primary leading-snug">
                          {leader.name}
                        </h3>
                        <p className="text-xs font-semibold text-gold-hover">{leader.role}</p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-body pt-2 border-t border-warm-border/60">
                      {leader.description}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-caption font-sans">
                    Pendampingan Ibadah Resmi
                  </div>
                </article>
              ))}
            </div>

            {/* Hubungi Kantor Kami */}
            <div className="rounded-card bg-teal-primary p-6 text-white shadow-card space-y-4">
              <h3 className="font-serif text-xl font-bold">Kunjungi Kantor Risalah Madina</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Kami menyambut silaturahmi calon jemaah dan keluarga di kantor kami untuk konsultasi manasik, pengecekan nomor porsi haji, atau pendaftaran program.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={getGeneralWhatsAppUrl(company.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-button bg-gold-accent hover:bg-gold-hover px-4 py-2.5 text-xs font-bold text-slate-dark transition-colors"
                >
                  WhatsApp Konsultasi
                </a>
                <Link
                  href="/umroh"
                  className="inline-flex min-h-11 items-center rounded-button border border-white/30 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  Lihat Jadwal Umroh
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   2. LEGALITY & BANK ACCOUNTS PAGE CONTENT (/legalitas)
   ════════════════════════════════════════════════════════════════════════════════ */
export function LegalityPageContent({ company }: { company: CompanyProfile }) {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const copyToClipboard = (account: string, bank: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(account.replace(/\s+/g, ""));
      setCopiedBank(bank);
      setTimeout(() => setCopiedBank(null), 2500);
    }
  };

  const legalRows = [
    ["Nama Badan Usaha", company.legalName],
    ["Izin Penyelenggara Umroh (SK PPIU)", company.legal.ppiu],
    ["Izin Penyelenggara Haji Khusus (SK PIHK)", company.legal.pihk],
    ["Akta Notaris Pendirian", company.legal.deed],
    ["SK Kemenkumham RI", company.legal.kemenkumham],
    ["Nomor Induk Berusaha (NIB)", company.legal.nib],
    ["NPWP Perusahaan", company.legal.npwp],
    ["Sertifikasi Akreditasi KAN", `${company.certification.number} (Peringkat Akreditasi: ${company.certification.accreditation})`],
    ["Masa Berlaku Akreditasi", company.certification.validUntil],
  ];

  return (
    <main className="site-shell min-h-screen pb-20 pt-8 font-sans sm:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal-primary font-semibold">Legalitas &amp; Rekening Resmi</span>
        </nav>

        {/* Page Title */}
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-badge bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              Terdaftar Resmi di SISKOPATUH Kemenag RI
            </span>
            <span className="rounded-badge bg-gold-light px-3 py-1 text-xs font-bold text-teal-primary border border-gold-border">
              Akreditasi A
            </span>
          </div>

          <h1 className="editorial-title">
            Legalitas Resmi &amp; Rekening Perusahaan
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-body">
            Seluruh transaksi pendaftaran jemaah terlindungi oleh izin perizinan sah Kementerian Agama RI. Pastikan Anda hanya bertransaksi melalui kanal dan nomor rekening resmi yang tertera di bawah ini.
          </p>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Formal Government Credentials */}
          <div className="min-w-0 lg:col-span-7 space-y-6">
            <div className="content-panel space-y-5 p-6">
              <div className="border-b border-warm-border pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block mb-1">
                  Dokumen Legalitas Terverifikasi
                </span>
                <h2 className="font-serif text-xl font-bold text-teal-primary">
                  Perizinan Pemerintah Republik Indonesia
                </h2>
              </div>

              <dl className="divide-y divide-warm-border">
                {legalRows.map(([label, value]) => (
                  <div key={label} className="py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline">
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-muted sm:col-span-5">
                      {label}
                    </dt>
                    <dd className="text-xs sm:text-sm font-semibold text-teal-primary sm:col-span-7 break-words">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Verification Link Note */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-5 shadow-xs flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                i
              </span>
              <p className="text-xs text-slate-body leading-relaxed font-sans">
                Kebenaran izin operasional PPIU dan PIHK dapat dicek langsung secara publik melalui situs resmi Kementerian Agama RI di SISKOPATUH atau aplikasi Umrah Cerdas.
              </p>
            </div>
          </div>

          {/* Right Column (5 cols): Rekening Resmi Anti-Penipuan */}
          <div className="min-w-0 lg:col-span-5 space-y-6">
            
            {/* Anti-Fraud Warning Box */}
            <div className="rounded-card border-2 border-red-200 bg-red-50/70 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">!</span>
                Waspada Penipuan Pembayaran
              </div>
              <p className="text-xs text-red-900 leading-relaxed font-sans">
                PT Risalah Madina Tour <strong>TIDAK PERNAH</strong> meminta transfer pembayaran ke rekening pribadi atau rekening atas nama perseorangan/karyawan.
              </p>
            </div>

            {/* Bank Accounts List */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-6 shadow-card space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block mb-1">
                  Kanal Pembayaran Resmi
                </span>
                <h3 className="font-serif text-xl font-bold text-teal-primary">
                  Daftar Rekening Bank Perusahaan
                </h3>
                <p className="text-xs text-slate-muted mt-1 font-sans">
                  Seluruh rekening resmi terdaftar atas nama: <strong className="text-teal-primary">{company.legalName}</strong>
                </p>
              </div>

              <div className="space-y-3.5">
                {company.bankAccounts.map((account) => (
                  <div
                    key={account.bank}
                    className="p-4 rounded-button bg-warm-bg border border-warm-border space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-teal-primary">{account.bank}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-badge bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Rekening Resmi
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-base font-bold text-slate-dark tracking-wider">
                        {account.account}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(account.account, account.bank)}
                        className="px-2.5 py-1 text-xs font-bold rounded-button bg-teal-primary/10 hover:bg-teal-primary/20 text-teal-primary transition-colors shrink-0"
                      >
                        {copiedBank === account.bank ? "Tersalin!" : "Salin No. Rekening"}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-muted font-sans pt-1">
                      Atas Nama: <strong className="text-teal-primary">{company.legalName}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Confirmation Assistance */}
            <div className="rounded-card bg-teal-primary p-6 text-white shadow-card space-y-3">
              <h4 className="font-serif text-lg font-bold">Verifikasi Sebelum Transfer</h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Butuh verifikasi invoice resmi sebelum melakukan pembayaran? Hubungi tim keuangan kami via WhatsApp.
              </p>
              <a
                href={getGeneralWhatsAppUrl(company.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-button bg-gold-accent hover:bg-gold-hover px-4 py-2.5 text-xs font-bold text-slate-dark transition-colors"
              >
                Konfirmasi Pembayaran via WhatsApp
              </a>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   3. DOCUMENTATION GALLERY PAGE CONTENT (/dokumentasi)
   ════════════════════════════════════════════════════════════════════════════════ */
export function DocumentationPageContent({ company }: { company: CompanyProfile }) {
  const [filter, setFilter] = useState<string>("all");

  const documentationItems = [
    { src: "/images/destinations/mekkah.jpg", alt: "Jemaah Umroh di Pelataran Ka'bah Makkah", title: "Thawaf di Masjidil Haram", category: "makkah", caption: "Dokumentasi pelaksanaan ibadah thawaf jemaah di pelataran Ka'bah Makkah Al Mukarramah." },
    { src: "/images/destinations/turki.jpg", alt: "Wisata Halal Sejarah Islam Istanbul Turki", title: "Wisata Halal Turki", category: "ziarah", caption: "Napak tilas kejayaan Kesultanan Utsmaniyah di Blue Mosque dan Hagia Sophia Istanbul." },
    { src: "/images/destinations/dubai.jpg", alt: "City Tour Dubai City", title: "City Tour Dubai & Desert Safari", category: "ziarah", caption: "Program transit dan city tour modern dengan fasilitas akomodasi eksklusif." },
    { src: "/images/destinations/al-ula.jpg", alt: "Situs Sejarah Peradaban Al Ula Arab Saudi", title: "Situs Bersejarah Al Ula", category: "ziarah", caption: "Eksplorasi jejak sejarah peradaban masa lalu di Madain Saleh dan bebatuan Al Ula." },
    { src: "/images/destinations/thaif.jpg", alt: "Ziarah Perbukitan Sejuk Kota Thaif", title: "Ziarah Sejarah Kota Thaif", category: "ziarah", caption: "Menikmati kesejukan pegunungan Thaif, naik kereta gantung, dan ziarah Masjid Abdullah bin Abbas." },
    { src: "/images/destinations/mesir.jpg", alt: "Jejak Sejarah Para Nabi di Mesir & Piramida", title: "Jejak Sejarah Mesir Kuno", category: "ziarah", caption: "Menelusuri sejarah Nabi Musa AS, Sungai Nil, dan keajaiban Piramida Giza Mesir." },
  ];

  const filteredItems = filter === "all" ? documentationItems : documentationItems.filter(item => item.category === filter);

  return (
    <main id="dokumentasi" className="site-shell min-h-screen pb-20 pt-8 font-sans sm:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal-primary font-semibold">Dokumentasi Perjalanan</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="rounded-badge bg-gold-light px-3 py-1 text-xs font-bold text-teal-primary border border-gold-border inline-block">
            Galeri Keberangkatan Asli
          </span>

          <h1 className="editorial-title">
            Dokumentasi Perjalanan Ibadah &amp; Wisata Halal
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-slate-body">
            Dokumentasi visual nyata perjalanan jemaah {company.brandName} saat beribadah di Baitullah dan menelusuri jejak peradaban Islam di berbagai destinasi dunia.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter Dokumentasi">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`min-h-11 px-4 py-2 rounded-button text-xs font-bold transition-colors shrink-0 ${
              filter === "all"
                ? "bg-teal-primary text-white"
                : "bg-warm-surface border border-warm-border text-slate-body hover:border-teal-primary"
            }`}
          >
            Semua Dokumentasi
          </button>
          <button
            type="button"
            onClick={() => setFilter("makkah")}
            className={`min-h-11 px-4 py-2 rounded-button text-xs font-bold transition-colors shrink-0 ${
              filter === "makkah"
                ? "bg-teal-primary text-white"
                : "bg-warm-surface border border-warm-border text-slate-body hover:border-teal-primary"
            }`}
          >
            Makkah &amp; Ka&apos;bah
          </button>
          <button
            type="button"
            onClick={() => setFilter("ziarah")}
            className={`min-h-11 px-4 py-2 rounded-button text-xs font-bold transition-colors shrink-0 ${
              filter === "ziarah"
                ? "bg-teal-primary text-white"
                : "bg-warm-surface border border-warm-border text-slate-body hover:border-teal-primary"
            }`}
          >
            Ziarah &amp; Wisata Halal
          </button>
        </div>

        {/* Responsive Photo Grid (Masonry feel) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <figure
              key={idx}
              className="overflow-hidden rounded-card border border-warm-border bg-warm-surface shadow-card flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-teal-900 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-5 space-y-1.5">
                <h2 className="font-serif text-lg font-bold text-teal-primary">{item.title}</h2>
                <p className="text-xs text-slate-body leading-relaxed">{item.caption}</p>
                <div className="pt-2 text-[10px] uppercase font-bold tracking-wider text-gold-hover">
                  Dokumentasi Resmi Jemaah
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Micro note */}
        <p className="text-xs italic text-slate-muted pt-4 border-t border-warm-border">
          *Seluruh foto dan rekaman visual merupakan dokumentasi asli jemaah Risalah Madina Tour tanpa modifikasi buatan.
        </p>

      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   4. HAJI OVERVIEW SECTION
   ════════════════════════════════════════════════════════════════════════════════ */
export function HajiOverviewSection({ company }: { company: CompanyProfile }) {
  return (
    <section className="border-b border-warm-border bg-[#ebe6dc] font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.56fr)] lg:gap-12">
          
          <div className="min-w-0 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover block">
              Program Haji Khusus Berizin Kemenag
            </span>
            <h1 className="editorial-title max-w-4xl !text-3xl sm:!text-5xl">
              Program Haji Khusus &amp; Kuota Resmi
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-body max-w-3xl">
              Ibadah haji adalah rukun Islam kelima yang membutuhkan kepastian legalitas dan bimbingan terpercaya. Risalah Madina Tour mengelola program Haji Khusus dengan nomor porsi resmi Kementerian Agama RI dan pendampingan intensif.
            </p>
          </div>

          <div className="content-panel w-full min-w-0 space-y-4 p-5 sm:p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block">
              Ringkasan Data Haji
            </span>
            <div className="grid gap-3 text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">Izin PIHK:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">{company.legal.pihk}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">DP Porsi:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">{company.financing.hajjDp}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">Masa Tunggu Acuan:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">6-7 Tahun</span>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={getGeneralWhatsAppUrl(company.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center whitespace-normal rounded-button bg-teal-primary px-3 text-center text-xs font-bold leading-4 text-white transition-colors hover:bg-teal-900"
              >
                Konsultasi Porsi Haji Khusus
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   5. HOW IT WORKS SECTION
   ════════════════════════════════════════════════════════════════════════════════ */
export function HowItWorksSection({ company }: { company: CompanyProfile }) {
  const steps = [
    { num: "01", title: "Pilih Jadwal & Paket", desc: "Tentukan bulan keberangkatan, tipe kamar, serta durasi perjalanan yang sesuai kebutuhan keluarga." },
    { num: "02", title: "Konsultasi & Verifikasi", desc: "Hubungi konsultan kami untuk memastikan ketersediaan seat tiket dan kelengkapan berkas paspor." },
    { num: "03", title: "Akad & Bimbingan Manasik", desc: "Tanda tangani akad resmi, transfer pembayaran ke rekening perusahaan, dan ikuti bimbingan manasik intensif." },
    { num: "04", title: "Berangkat dengan Tenang", desc: "Pelepasan resmi di bandara, pendampingan muthowwif di tanah suci, dan kepulangan selamat berkah." },
  ];

  return (
    <section className="border-t border-warm-border bg-[#fffdf8] py-12 font-sans sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover block mb-1">
              Alur Perjalanan
            </span>
            <h2 className="editorial-title !text-2xl sm:!text-4xl">
              Langkah Menuju Baitullah Bersama Kami
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-muted">
              Prosedur yang jelas, aman, dan transparan dari pendaftaran awal hingga kepulangan ke tanah air.
            </p>
          </div>
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-bold text-teal-primary hover:text-gold-hover transition-colors shrink-0"
          >
            Pelajari Detail Syarat &amp; Dokumen
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="content-panel space-y-2 p-5 transition-colors hover:border-teal-primary/30"
            >
              <span className="font-mono text-xs font-bold text-gold-hover bg-gold-light w-7 h-7 rounded-full flex items-center justify-center">
                {step.num}
              </span>
              <h3 className="font-serif text-base font-bold text-teal-primary pt-1">{step.title}</h3>
              <p className="text-xs text-slate-body leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   6. LEGALITY TEASER (HOMEPAGE COMPONENT)
   ════════════════════════════════════════════════════════════════════════════════ */
export function LegalityTeaser({ company }: { company: CompanyProfile }) {
  return (
    <section className="border-t border-warm-border bg-warm-bg py-12 sm:py-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover block mb-1">
              Kepastian Hukum
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-teal-primary">
              Izin Resmi &amp; Akreditasi Pemerintah
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-muted">
              Data legalitas utama kami terbuka untuk publik guna menjamin kenyamanan dan ketenangan ibadah Anda.
            </p>
          </div>
          <Link
            href="/legalitas"
            className="text-xs sm:text-sm font-bold text-teal-primary hover:text-gold-hover transition-colors shrink-0"
          >
            Lihat Rincian Legalitas Lengkap
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "SK PPIU Kemenag RI", val: company.legal.ppiu, sub: "Izin Resmi Penyelenggara Umroh" },
            { label: "SK PIHK Kemenag RI", val: company.legal.pihk, sub: "Izin Penyelenggara Haji Khusus" },
            { label: "Akreditasi KAN", val: `Nomor ${company.certification.number}`, sub: `Peringkat Akreditasi ${company.certification.accreditation}` },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-card border border-warm-border bg-warm-surface space-y-1.5 shadow-card"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block">
                {item.label}
              </span>
              <p className="font-mono text-sm font-bold text-teal-primary">{item.val}</p>
              <p className="text-xs text-slate-body">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
