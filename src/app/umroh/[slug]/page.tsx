import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/cms/store";
import { getPackageWhatsAppUrl } from "@/lib/contact";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, getProductSchema, serializeJsonLd } from "@/lib/structured-data";
import SharePackageButton from "@/components/SharePackageButton";
import InquiryDialog from "@/components/InquiryDialog";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { packages } = await getSiteData();
  return packages
    .filter((item) => item.isUmroh && item.lifecycle !== "draft" && item.lifecycle !== "archived")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { company, packages } = await getSiteData();
  const pkg = packages.find((item) => item.slug.toLowerCase() === slug.toLowerCase() && item.isUmroh);

  if (!pkg) {
    return {
      title: `Paket Tidak Ditemukan | ${company.brandName}`,
    };
  }

  const canonicalUrl = getAbsoluteUrl(`/umroh/${pkg.slug}`);

  return {
    title: `${pkg.name} | Jadwal & Biaya | ${company.brandName}`,
    description: `Paket ${pkg.name} keberangkatan ${pkg.departureDate} (${pkg.duration}). Maskapai ${pkg.airline}, hotel ${pkg.hotelMakkah}, bimbingan muthowwif resmi.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${pkg.name} | ${company.brandName}`,
      description: `Paket ${pkg.name} keberangkatan ${pkg.departureDate} (${pkg.duration}). Maskapai ${pkg.airline}, hotel ${pkg.hotelMakkah}, bimbingan muthowwif resmi.`,
      images: [{ url: pkg.imageUrl || company.media?.heroUrl || "/images/kaaba-courtyard.png", alt: pkg.name }],
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { company, packages } = await getSiteData();
  const pkg = packages.find((item) => item.slug.toLowerCase() === slug.toLowerCase() && item.isUmroh);

  if (!pkg) {
    notFound();
  }

  const productSchema = getProductSchema(pkg, company);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Paket Umroh", url: "/umroh" },
    { name: pkg.name, url: `/umroh/${pkg.slug}` },
  ]);

  const roomPrices = pkg.roomPricing || [];
  const galleryItems = pkg.gallery || [];
  const itineraryDays = pkg.itinerary || [];
  const facilitiesIncluded = pkg.facilitiesIncluded || [];
  const facilitiesExcluded = pkg.facilitiesExcluded || [];
  const whatsappUrl = getPackageWhatsAppUrl(company.phone, pkg);

  const lifecycleLabel =
    pkg.lifecycle === "sold_out" || pkg.statusType === "soldout"
      ? "Kuota terisi penuh"
      : pkg.lifecycle === "departed"
      ? "Telah berangkat"
      : pkg.statusType === "pending"
      ? "Perlu dikonfirmasi"
      : pkg.statusType === "warning"
      ? "Kuota terbatas"
      : "Jadwal tersedia";

  return (
    <div className="bg-warm-bg min-h-screen py-6 sm:py-10 pb-28 lg:pb-16 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── 1. BREADCRUMBS ── */}
        <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/umroh" className="hover:text-teal-primary transition-colors">
            Paket Umroh
          </Link>
          <span>/</span>
          <span className="text-teal-primary font-semibold truncate max-w-[200px] sm:max-w-md">
            {pkg.name}
          </span>
        </nav>

        {/* ── MAIN 2-COLUMN SPLIT LAYOUT (Desktop: 8 cols content + 4 cols sticky sidebar) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ════════════════════════════════════════════════════════════════════════════════
              LEFT COLUMN (8 COLS): Rich Content, Specifications, Itinerary, Rooms, Facilities
             ════════════════════════════════════════════════════════════════════════════════ */}
          <div className="min-w-0 lg:col-span-8 space-y-8">
            
            {/* Header Title & Meta Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider rounded-badge shadow-xs ${pkg.categoryColor}`}>
                  {pkg.category}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-badge text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {lifecycleLabel}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-badge text-[11px] sm:text-xs font-semibold bg-teal-primary/8 text-teal-primary border border-teal-primary/15 font-sans">
                  {pkg.flightType || "Penerbangan terkonfirmasi"}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-teal-primary leading-tight">
                {pkg.name}
              </h1>

              <p className="font-sans text-sm sm:text-base text-slate-body leading-relaxed">
                Perjalanan ibadah {pkg.duration} dari {pkg.departureCity} bersama <strong className="text-teal-primary">{pkg.airline}</strong>. Akomodasi hotel terkonfirmasi di Makkah dan Madinah dengan bimbingan muthowwif berkompeten.
              </p>
            </div>

            {/* Galeri Foto Dokumentasi Paket */}
            {galleryItems.length > 0 && (
              <section aria-labelledby="gallery-heading" className="space-y-3">
                <h2 id="gallery-heading" className="sr-only">Galeri Dokumentasi Paket</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                  {/* Slot Utama (Besar) */}
                  <div className="sm:col-span-7 relative rounded-card overflow-hidden border border-warm-border bg-warm-surface shadow-card">
                    <div className="aspect-4/3 w-full bg-teal-900 flex flex-col items-center justify-center p-6 text-center relative group">
                      {galleryItems[0].imageUrl && (
                        <Image
                          src={galleryItems[0].imageUrl}
                          alt={galleryItems[0].alt || galleryItems[0].label}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10 text-white p-4">
                        <p className="font-serif font-bold text-lg leading-snug">
                          {galleryItems[0].label}
                        </p>
                        <p className="text-gold-accent text-xs font-semibold mt-1">
                          {galleryItems[0].tag}
                        </p>
                      </div>
                      <span className="absolute bottom-3 inset-x-3 text-[11px] text-white/80 font-sans text-center truncate">
                        {galleryItems[0].caption}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Samping */}
                  <div className="sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-3">
                    {galleryItems.slice(1, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative rounded-card overflow-hidden border border-warm-border bg-warm-surface shadow-card h-36 sm:h-auto sm:aspect-16/9"
                      >
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.alt || item.label}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <p className="font-serif font-bold text-xs sm:text-sm truncate">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-gold-accent font-semibold truncate">
                            {item.tag}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Key Specifications Grid Strip */}
            <section aria-labelledby="specs-heading" className="bg-warm-surface rounded-card border border-warm-border p-5 sm:p-6 shadow-card">
              <h2 id="specs-heading" className="text-xs font-bold uppercase tracking-wider text-slate-caption font-sans mb-4">
                Spesifikasi Keberangkatan &amp; Fasilitas
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Tanggal Berangkat</span>
                  <span className="font-sans font-bold text-sm text-teal-primary mt-1 block">
                    {pkg.departureDate}
                  </span>
                  <span className="text-[10px] text-slate-muted block font-mono">Jadwal pasti</span>
                </div>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Durasi Paket</span>
                  <span className="font-sans font-bold text-sm text-teal-primary mt-1 block">
                    {pkg.duration}
                  </span>
                  <span className="text-[10px] text-slate-muted block font-mono">Makkah &amp; Madinah</span>
                </div>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Penerbangan</span>
                  <span className="font-sans font-bold text-sm text-teal-primary mt-1 block truncate" title={pkg.airline}>
                    {pkg.airline}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">{pkg.flightType}</span>
                </div>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Kota Embarkasi</span>
                  <span className="font-sans font-bold text-sm text-teal-primary mt-1 block">
                    {pkg.departureCity}
                  </span>
                  <span className="text-[10px] text-slate-muted block">Bandara Soetta</span>
                </div>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Hotel Makkah</span>
                  <span className="font-sans font-bold text-xs text-teal-primary mt-1 block truncate" title={pkg.hotelMakkah}>
                    {pkg.hotelMakkah}
                  </span>
                  <span className="text-[10px] text-slate-muted font-semibold block">Dekat Masjidil Haram</span>
                </div>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border/60">
                  <span className="text-[11px] text-slate-muted block font-sans">Hotel Madinah</span>
                  <span className="font-sans font-bold text-xs text-teal-primary mt-1 block truncate" title={pkg.hotelMadinah}>
                    {pkg.hotelMadinah}
                  </span>
                  <span className="text-[10px] text-slate-muted font-semibold block">Dekat Masjid Nabawi</span>
                </div>
              </div>
            </section>

            {/* Rincian Harga per Tipe Kamar */}
            {roomPrices.length > 0 && (
              <section aria-labelledby="pricing-heading" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-warm-border pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover mb-1">Pilihan Kamar</p>
                    <h2 id="pricing-heading" className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                      Rincian Biaya per Tipe Kamar
                    </h2>
                  </div>
                  <p className="text-xs text-slate-muted font-sans">
                    Biaya per orang (Quad, Triple, Double)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {roomPrices.map((room) => (
                    <div
                      key={room.type}
                      className={`rounded-card border p-5 flex flex-col justify-between transition-all bg-warm-surface shadow-card ${
                        room.isPopular
                          ? "border-teal-primary ring-2 ring-teal-primary/20"
                          : "border-warm-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="font-serif text-lg font-bold text-teal-primary">
                            {room.label}
                          </h3>
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-badge bg-teal-primary/8 text-teal-primary">
                            {room.capacity}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-slate-body leading-relaxed mb-4">
                          {room.description}
                        </p>

                        <div className="p-3 rounded-button bg-warm-bg border border-warm-border mb-3">
                          <span className="text-[10px] text-slate-caption uppercase font-bold block">
                            Biaya Paket / Orang
                          </span>
                          <span className="font-sans text-xl sm:text-2xl font-bold text-teal-primary block mt-0.5">
                            {room.price}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-muted">
                        Kapasitas &amp; ketersediaan kamar dikonfirmasi saat pendaftaran.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Fasilitas Termasuk & Belum Termasuk */}
            <section aria-labelledby="facilities-heading" className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              
              {/* Termasuk */}
              <div className="bg-warm-surface rounded-card border border-warm-border p-6 shadow-card space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Fasilitas Lengkap
                  </span>
                  <h3 id="facilities-heading" className="font-serif text-xl font-bold text-teal-primary">
                    Biaya Sudah Termasuk
                  </h3>
                </div>

                <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-body border-t border-warm-border pt-4">
                  {facilitiesIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Belum Termasuk */}
              <div className="bg-warm-surface rounded-card border border-warm-border p-6 shadow-card space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-status-soldout block mb-1">
                    Biaya Tambahan
                  </span>
                  <h3 className="font-serif text-xl font-bold text-teal-primary">
                    Biaya Belum Termasuk
                  </h3>
                </div>

                <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-body border-t border-warm-border pt-4">
                  {facilitiesExcluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-status-soldout flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✕
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3 bg-warm-muted/70 rounded-button border border-warm-border text-xs text-slate-muted">
                  Konfirmasi rincian tertulis sebelum pembayaran pendaftaran.
                </div>
              </div>

            </section>

            {/* Itinerary Perjalanan Harian */}
            {itineraryDays.length > 0 && (
              <section aria-labelledby="itinerary-heading" className="bg-warm-surface rounded-card border border-warm-border p-6 sm:p-8 shadow-card space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover mb-1">Rencana Perjalanan</p>
                  <h2 id="itinerary-heading" className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                    Itinerary Perjalanan {pkg.duration}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-slate-muted mt-1 leading-relaxed">
                    Alur bimbingan ibadah dan city tour tersusun rapi untuk kenyamanan fisik seluruh jemaah keluarga.
                  </p>
                </div>

                <div className="space-y-4 border-l-2 border-teal-primary/20 ml-3 sm:ml-4 pl-4 sm:pl-6">
                  {itineraryDays.map((item) => (
                    <div key={item.day} className="relative group">
                      <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-teal-primary border-2 border-white shadow-xs" />

                      <div className="p-4 rounded-card border border-warm-border bg-warm-bg hover:border-teal-primary/30 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-sans font-bold text-sm sm:text-base text-teal-primary">
                            Hari {item.day}: {item.title}
                          </h3>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-badge bg-gold-light text-teal-primary border border-gold-border">
                            {item.location}
                          </span>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-slate-body leading-relaxed">
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-caption font-sans italic pt-2">
                  *Jadwal itinerary dapat disesuaikan di lapangan mengikuti kondisi lalu lintas, tasreh Raudhah (Nusuk), dan kebijakan otoritas Arab Saudi tanpa mengurangi hak ibadah jemaah.
                </p>
              </section>
            )}

          </div>

          {/* ════════════════════════════════════════════════════════════════════════════════
              RIGHT COLUMN (4 COLS): Sticky Booking & Consultation Widget (Desktop Only)
             ════════════════════════════════════════════════════════════════════════════════ */}
          <aside className="hidden min-w-0 lg:block lg:col-span-4 sticky top-24 space-y-5">
            
            {/* Primary Sticky Booking Card */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-6 shadow-elevated space-y-5">
              
              <div>
                <span className="text-xs uppercase font-bold text-slate-caption block font-sans">
                  Mulai Dari / Orang (Quad)
                </span>
                <span className="font-serif text-3xl font-bold text-teal-primary block mt-1">
                  {pkg.discountedPrice}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {lifecycleLabel}
                </span>
              </div>

              {/* Quick Specs Micro-List */}
              <div className="border-y border-warm-border py-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Keberangkatan:</span>
                  <span className="font-bold text-teal-primary">{pkg.departureDate}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Durasi:</span>
                  <span className="font-bold text-teal-primary">{pkg.duration}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Penerbangan:</span>
                  <span className="font-bold text-teal-primary truncate max-w-[170px]" title={pkg.airline}>{pkg.airline}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Hotel Makkah:</span>
                  <span className="font-medium text-slate-dark truncate max-w-[170px]" title={pkg.hotelMakkah}>{pkg.hotelMakkah}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <InquiryDialog
                  href={whatsappUrl}
                  packageId={pkg.id}
                  packageName={pkg.name}
                  label="Konsultasi Paket Ini"
                  className="w-full min-h-12 px-5 py-3 rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark font-sans font-bold text-sm shadow-card flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Konsultasi Paket Ini</span>
                </InquiryDialog>

                <InquiryDialog
                  href={whatsappUrl}
                  packageId={pkg.id}
                  packageName={pkg.name}
                  label="Tanyakan Ketersediaan Kuota"
                  className="w-full min-h-11 px-4 py-2.5 rounded-button border border-teal-primary text-teal-primary hover:bg-teal-primary hover:text-white font-sans font-bold text-xs flex items-center justify-center transition-all"
                />

                <div className="pt-2 flex justify-center">
                  <SharePackageButton title={pkg.name} />
                </div>
              </div>

              {/* Trust Signal Note */}
              <div className="p-3 bg-warm-muted rounded-button border border-warm-border text-[11px] text-slate-muted leading-relaxed">
                Pembayaran pendaftaran resmi hanya ditransfer ke rekening an. <strong className="text-teal-primary">{company.legalName}</strong>.
              </div>

            </div>

            {/* Assistance Card */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-5 shadow-card text-center space-y-2">
              <p className="font-serif font-bold text-base text-teal-primary">
                Butuh Informasi Tambahan?
              </p>
              <p className="text-xs text-slate-muted leading-relaxed">
                Tim Risalah Madina Tour siap menjelaskan rincian berkas visa, paspor, dan manasik.
              </p>
              <a
                href={`tel:${company.phone.replace(/\D/g, "")}`}
                className="inline-block pt-1 text-xs font-bold text-teal-primary hover:underline"
              >
                Telepon: {company.phone}
              </a>
            </div>

          </aside>

        </div>

      </div>

      {/* ── STICKY BOTTOM BAR FOR MOBILE (Thumb-friendly high conversion) ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-warm-surface border-t border-warm-border p-3.5 px-4 shadow-elevated flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-caption block uppercase font-bold font-sans">
            Mulai Dari (Quad)
          </span>
          <span className="font-sans font-bold text-base text-teal-primary block truncate">
            {pkg.discountedPrice}
          </span>
        </div>

        <InquiryDialog
          href={whatsappUrl}
          packageId={pkg.id}
          packageName={pkg.name}
          label="WhatsApp Konsultasi"
          id="mobile-sticky-cta"
          className="min-h-11 px-5 py-2.5 rounded-button bg-teal-primary text-white font-sans text-xs font-bold shadow-card flex items-center gap-2 shrink-0 active:scale-[0.98]"
        >
          <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>WhatsApp Konsultasi</span>
        </InquiryDialog>
      </div>

    </div>
  );
}
