"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import type { Package } from "@/types/package";

export default function FeaturedPackagesSection({ packages }: { packages: Package[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "reguler" | "plus" | "khusus">("all");

  const counts = useMemo(() => {
    return {
      all: packages.length,
      reguler: packages.filter((p) => !p.isHaji && p.packageType === "reguler").length,
      plus: packages.filter((p) => !p.isHaji && p.packageType === "plus").length,
      khusus: packages.filter((p) => p.isHaji || p.packageType === "khusus").length,
    };
  }, [packages]);

  const categoryTabs = useMemo(() => [
    { id: "all" as const, label: "Semua Paket", count: counts.all },
    { id: "reguler" as const, label: "Umroh Reguler", count: counts.reguler },
    { id: "plus" as const, label: "Umroh Plus Wisata", count: counts.plus },
    { id: "khusus" as const, label: "Haji Khusus", count: counts.khusus },
  ], [counts]);

  const filteredList = useMemo(() => {
    if (activeTab === "all") return packages.slice(0, 6);
    if (activeTab === "khusus") return packages.filter((p) => p.isHaji).slice(0, 6);
    return packages.filter((p) => p.packageType === activeTab).slice(0, 6);
  }, [packages, activeTab]);

  return (
    <section id="katalog" className="scroll-mt-24 py-12 sm:py-16 lg:py-20 bg-warm-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Section Header with Editorial Alignment ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-warm-border pb-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Jadwal Terkonfirmasi</p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-primary leading-tight">
              Pilihan Paket Umroh &amp; Haji
            </h2>
            <p className="text-xs sm:text-sm text-slate-muted mt-2 font-sans max-w-xl leading-relaxed">
              Bandingkan jadwal keberangkatan, tipe kamar, maskapai, dan hotel di Makkah serta Madinah.
            </p>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-primary" aria-hidden="true" />
              {packages.length} paket siap berangkat
            </span>
            <Link
              href="/umroh"
              id="see-all-packages"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-teal-primary hover:text-gold-hover transition-colors font-sans whitespace-nowrap mt-1"
            >
              <span>Buka Katalog Lengkap</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ── Category Filter Tabs (Swipeable pills on mobile) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-10 px-4 py-2 rounded-button text-xs font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] shrink-0 ${
                activeTab === tab.id
                  ? "bg-teal-primary text-white shadow-xs font-bold"
                  : "bg-warm-surface text-slate-body border border-warm-border hover:bg-warm-muted"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1 text-[11px] ${activeTab === tab.id ? "text-white/80" : "text-slate-caption"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* ── Multi-Column Grid on Desktop / Smooth Horizontal Snap Rail on Mobile ── */}
        {filteredList.length > 0 ? (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-none pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredList.map((pkg) => (
              <div key={pkg.id} className="min-w-[280px] sm:min-w-0 shrink-0 sm:shrink snap-start w-[78vw] sm:w-auto">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-warm-surface rounded-card border border-warm-border">
            <p className="text-sm text-slate-muted">Belum ada paket untuk kategori ini saat ini.</p>
          </div>
        )}

        {/* ── Mobile Footer CTA ── */}
        <div className="sm:hidden text-center pt-2">
          <Link
            href="/umroh"
            id="see-all-mobile"
            className="w-full min-h-11 py-3 px-5 rounded-button bg-warm-surface border border-warm-border text-teal-primary text-xs font-bold inline-flex items-center justify-center shadow-xs hover:bg-warm-muted"
          >
            <span>Buka Semua Paket Umroh &amp; Haji</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
