"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, StatusType } from "@/types/package";
import { getPackageLifecycle } from "@/lib/package";
import { companyProfile } from "@/data/company";


// Status configuration
const statusConfig: Record<StatusType, { bg: string; text: string; border: string; dot: string; label: string }> = {
  available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Jadwal Tersedia",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: "Kuota Terbatas",
  },
  pending: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    label: "Perlu Konfirmasi",
  },
  soldout: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Kuota Penuh",
  },
};

interface PackageCardProps {
  pkg: Package;
  compareSelected?: boolean;
  onToggleCompare?: (pkg: Package) => void;
  layoutMode?: "grid" | "list";
}

export default function PackageCard({
  pkg,
  compareSelected = false,
  onToggleCompare,
  layoutMode = "grid",
}: PackageCardProps) {
  const status = statusConfig[pkg.statusType] || statusConfig.available;
  const lifecycle = getPackageLifecycle(pkg);
  const isSoldOut = lifecycle === "sold_out" || pkg.statusType === "soldout";
  
  const statusLabel = lifecycle === "departed"
    ? "Telah Berangkat"
    : isSoldOut
      ? "Kuota Penuh"
      : status.label;

  const packageImage = pkg.imageUrl || pkg.gallery?.[0]?.imageUrl || (pkg.isHaji
    ? "/images/destinations/mekkah.jpg"
    : pkg.slug.includes("dubai")
      ? "/images/destinations/dubai.jpg"
      : pkg.slug.includes("turki")
        ? "/images/destinations/turki.jpg"
        : pkg.slug.includes("mesir")
          ? "/images/destinations/mesir.jpg"
          : "/images/destinations/mekkah.jpg");

  // Get lowest price numeric formatted
  const lowestRoomPrice = pkg.roomPricing?.length
    ? pkg.roomPricing.reduce((lowest, room) => (room.numeric > 0 && room.numeric < lowest ? room.numeric : lowest), Number.MAX_SAFE_INTEGER)
    : pkg.priceNumeric;

  const displayPrice = lowestRoomPrice && lowestRoomPrice !== Number.MAX_SAFE_INTEGER
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(lowestRoomPrice)
    : pkg.discountedPrice;

  // WhatsApp link generator using verified official company phone
  const waNumber = companyProfile.phone.replace(/\D/g, "").replace(/^0/, "62");
  const waText = encodeURIComponent(
    `Assalamu'alaikum Admin Risalah Madina Tour, saya ingin menanyakan informasi & ketersediaan paket: *${pkg.name}* (Keberangkatan: ${pkg.departureDate}, Durasi: ${pkg.duration}).`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waText}`;



  /* ─────────────────────────────────────────────────────────────
     1. LIST MODE (Dense horizontal card for desktop/tablet)
     ───────────────────────────────────────────────────────────── */
  if (layoutMode === "list") {
    return (
      <article
        className={`bg-warm-surface rounded-card border ${
          compareSelected ? "border-gold-accent ring-2 ring-gold-accent/20" : "border-warm-border"
        } shadow-card overflow-hidden hover:shadow-elevated transition-all duration-200 flex flex-col md:flex-row items-stretch group relative`}
        aria-label={`Paket: ${pkg.name}`}
      >
        {/* Left thumbnail */}
        <div className="relative w-full md:w-64 h-44 md:h-auto shrink-0 overflow-hidden bg-teal-primary">
          <Image
            src={packageImage}
            alt={`Dokumentasi ${pkg.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 256px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/70 via-black/20 to-transparent" />
          
          {/* Top badges on image */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${status.bg} ${status.text} ${status.border} shadow-xs`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
              {statusLabel}
            </span>
            <span className="px-2 py-0.5 rounded-badge bg-black/70 text-white text-[10px] font-mono font-semibold">
              {pkg.duration}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-badge bg-black/70 text-white text-[11px] font-medium border border-white/15">
              <svg className="w-3 h-3 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="truncate max-w-[140px]">{pkg.airline}</span>
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-badge bg-gold-light text-teal-primary text-[10px] font-bold uppercase tracking-wider border border-gold-border">
                {pkg.category}
              </span>
              <span className="text-[11px] font-medium text-slate-muted font-sans">
                Embarkasi: <strong className="text-slate-dark">{pkg.departureCity}</strong>
              </span>
            </div>

            <Link href={`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`} className="block group-hover:text-teal-700 transition-colors">
              <h3 className="font-serif text-lg font-bold text-teal-primary leading-snug">
                {pkg.name}
              </h3>
            </Link>

            {/* Spec grid in list view */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-warm-border/60 text-xs font-sans">
              <div className="bg-warm-bg rounded-button p-2 border border-warm-border/50">
                <span className="text-[10px] text-slate-caption block">Keberangkatan</span>
                <span className="font-bold text-teal-primary truncate block">{pkg.departureDate}</span>
              </div>
              <div className="bg-warm-bg rounded-button p-2 border border-warm-border/50">
                <span className="text-[10px] text-slate-caption block">Penerbangan</span>
                <span className="font-semibold text-slate-dark truncate block">{pkg.flightType || "Tipe penerbangan belum dicantumkan"}</span>
              </div>
              <div className="bg-warm-bg rounded-button p-2 border border-warm-border/50">
                <span className="text-[10px] text-slate-caption block">Hotel Makkah</span>
                <span className="font-semibold text-slate-dark truncate block" title={pkg.hotelMakkah}>{pkg.hotelMakkah}</span>
              </div>
              <div className="bg-warm-bg rounded-button p-2 border border-warm-border/50">
                <span className="text-[10px] text-slate-caption block">Hotel Madinah</span>
                <span className="font-semibold text-slate-dark truncate block" title={pkg.hotelMadinah}>{pkg.hotelMadinah}</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Pricing and Actions */}
          <div className="mt-4 pt-3 border-t border-warm-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-caption block">Mulai dari / orang (Quad)</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold font-sans ${isSoldOut ? "text-slate-muted" : "text-teal-primary"}`}>
                  {displayPrice}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-slate-caption line-through font-mono">
                    {pkg.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onToggleCompare && (
                <button
                  type="button"
                  onClick={() => onToggleCompare(pkg)}
                  className={`min-h-10 px-3 py-2 rounded-button text-xs font-bold font-sans transition-all flex items-center gap-1.5 ${
                    compareSelected
                      ? "bg-teal-primary text-white shadow-xs"
                      : "bg-warm-bg border border-warm-border text-slate-body hover:border-teal-primary"
                  }`}
                  aria-pressed={compareSelected}
                >
                  <span className="text-sm">{compareSelected ? "✓" : "+"}</span>
                  <span>Bandingkan</span>
                </button>
              )}

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-10 p-2.5 rounded-button border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                title="Tanya WhatsApp untuk paket ini"
                aria-label={`Tanya WhatsApp tentang ${pkg.name}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </a>

              <Link
                href={`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`}
                id={`detail-list-${pkg.id}`}
                className="min-h-10 px-4 py-2 rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark text-xs font-bold transition-all shadow-card flex items-center justify-center"
              >
                <span>Lihat Detail</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     2. GRID MODE (Vertical rich responsive card for mobile & desktop)
     ───────────────────────────────────────────────────────────── */
  return (
    <article
      className={`bg-warm-surface rounded-card border ${
        compareSelected ? "border-gold-accent ring-2 ring-gold-accent/20" : "border-warm-border"
      } shadow-card overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200 group relative`}
      aria-label={`Paket: ${pkg.name}`}
    >
      {/* ── Card Header: Thumbnail + Status + Badges ── */}
      <div className="relative h-44 overflow-hidden bg-teal-primary p-3.5 flex flex-col justify-between">
        <Image
          src={packageImage}
          alt={`Dokumentasi ${pkg.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/30" />

        {/* Top row: status badge + duration badge */}
        <div className="flex justify-between items-start gap-2 relative z-10">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-badge text-xs font-bold border ${status.bg} ${status.text} ${status.border} shadow-xs`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
            {statusLabel}
          </span>

          <span className="px-2.5 py-1 rounded-badge bg-black/70 text-white text-[11px] font-semibold font-mono border border-white/10">
            {pkg.duration}
          </span>
        </div>

        {/* Bottom row on image: Airline pill + Flight type */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 bg-black/70 border border-white/15 px-2.5 py-1 rounded-badge text-white">
            <svg className="w-3.5 h-3.5 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-sans font-semibold text-[11px] truncate max-w-[130px]">{pkg.airline}</span>
          </div>

          <span className="text-[10px] text-white/90 bg-teal-900/75 border border-white/10 px-2 py-0.5 rounded-badge font-medium">
            {pkg.flightType || "Tipe penerbangan belum dicantumkan"}
          </span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Category & Title */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-badge border border-teal-100">
              {pkg.category}
            </span>
            <span className="text-[11px] font-medium text-slate-muted">
              {pkg.departureCity}
            </span>
          </div>
          
          <Link href={`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`} className="block group-hover:text-teal-700 transition-colors">
            <h3 className="font-serif text-base sm:text-lg font-bold text-teal-primary leading-snug line-clamp-2 min-h-[2.6rem]">
              {pkg.name}
            </h3>
          </Link>
        </div>

        {/* ── Key Specifications (Visible on BOTH mobile & desktop) ── */}
        <div className="bg-warm-bg rounded-button p-3 border border-warm-border/60 space-y-2 mb-4 text-xs font-sans">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-muted flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Keberangkatan
            </span>
            <span className="font-bold text-teal-primary text-right truncate">{pkg.departureDate}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-warm-border/40">
            <span className="text-slate-muted flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Hotel Makkah
            </span>
            <span className="font-semibold text-slate-dark text-right truncate max-w-[160px]" title={pkg.hotelMakkah}>
              {pkg.hotelMakkah}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-warm-border/40">
            <span className="text-slate-muted flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Hotel Madinah
            </span>
            <span className="font-semibold text-slate-dark text-right truncate max-w-[160px]" title={pkg.hotelMadinah}>
              {pkg.hotelMadinah}
            </span>
          </div>
        </div>

        {/* ── Price and Action Section ── */}
        <div className="mt-auto pt-3 border-t border-warm-border flex flex-col gap-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-caption block font-sans">
                Mulai dari / orang (Quad)
              </span>
              {pkg.originalPrice && (
                <span className="text-xs text-slate-caption line-through font-mono block">
                  {pkg.originalPrice}
                </span>
              )}
              <span className={`text-lg sm:text-xl font-bold font-sans block leading-tight ${isSoldOut ? "text-slate-muted" : "text-teal-primary"}`}>
                {displayPrice}
              </span>
            </div>

            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(pkg)}
                className={`px-2.5 py-1.5 rounded-button text-[11px] font-bold font-sans transition-all flex items-center gap-1 border ${
                  compareSelected
                    ? "bg-teal-primary text-white border-teal-primary shadow-xs"
                    : "bg-warm-bg text-slate-muted border-warm-border hover:border-teal-primary/60 hover:text-teal-primary"
                }`}
                aria-pressed={compareSelected}
              >
                <span>{compareSelected ? "✓ Dipilih" : "+ Bandingkan"}</span>
              </button>
            )}
          </div>

          {/* Action buttons row */}
          <div className="grid grid-cols-5 gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 min-h-11 rounded-button border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all flex items-center justify-center"
              title="Konsultasi WhatsApp untuk paket ini"
              aria-label={`Konsultasi WhatsApp tentang ${pkg.name}`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </a>

            <Link
              href={`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`}
              id={`detail-${pkg.id}`}
              className="col-span-4 min-h-11 rounded-button bg-gold-accent hover:bg-gold-hover active:scale-[0.98] text-slate-dark text-xs font-bold transition-all shadow-card flex items-center justify-center"
            >
              <span>Lihat Detail Paket</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
