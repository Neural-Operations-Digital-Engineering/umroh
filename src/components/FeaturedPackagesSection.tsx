"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import type { Package } from "@/types/package";

export default function FeaturedPackagesSection({ packages }: { packages: Package[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "reguler" | "plus" | "khusus">("all");

  const categoryTabs = [
    { id: "all", label: "Semua Paket" },
    { id: "reguler", label: "Umroh Reguler" },
    { id: "plus", label: "Umroh Plus Wisata" },
    { id: "khusus", label: "Haji Khusus" },
  ] as const;

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

          <Link
            href="/umroh"
            id="see-all-packages"
            className="hidden sm:inline-flex items-center text-xs font-bold text-teal-primary hover:text-gold-hover transition-colors font-sans whitespace-nowrap"
          >
            <span>Buka Katalog Lengkap</span>
          </Link>
        </div>

        {/* ── Category Filter Tabs (Swipeable pills on mobile) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-10 px-4 py-2 rounded-button text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-teal-primary text-white shadow-xs font-bold"
                  : "bg-warm-surface text-slate-body border border-warm-border hover:bg-warm-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Multi-Column Grid on Desktop / Smooth Horizontal Snap Rail on Mobile ── */}
        {filteredList.length > 0 ? (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-none pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredList.map((pkg) => (
              <div key={pkg.id} className="min-w-[280px] sm:min-w-0 shrink-0 sm:shrink snap-start w-[85vw] sm:w-auto">
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
