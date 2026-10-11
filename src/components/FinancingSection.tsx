"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { CompanyProfile } from "@/data/company";
import { getGeneralWhatsAppUrl } from "@/lib/contact";

export default function FinancingSection({
  company,
  isHeadingH1 = false,
}: {
  company: CompanyProfile;
  isHeadingH1?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"umroh" | "haji">("umroh");
  const whatsappUrl = getGeneralWhatsAppUrl(company.phone);

  return (
    <section id="pembiayaan" className="border-t border-warm-border bg-warm-surface py-10 sm:py-16 scroll-mt-24 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb if standalone page */}
        {isHeadingH1 && (
          <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
            <Link href="/" className="hover:text-teal-primary transition-colors">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-teal-primary font-semibold">
              Pembiayaan &amp; Tabungan Syariah
            </span>
          </nav>
        )}

        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-badge bg-gold-light px-3 py-1 text-xs font-bold text-teal-primary border border-gold-border">
              Akad Syariah Wadiah
            </span>
            <span className="rounded-badge bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              Tanpa Riba &amp; Tanpa Denda
            </span>
          </div>

          {isHeadingH1 ? (
            <h1 className="font-serif text-3xl font-bold leading-tight text-teal-primary sm:text-4xl lg:text-5xl">
              Skema Pembiayaan &amp; Tabungan Umroh / Haji
            </h1>
          ) : (
            <h2 className="font-serif text-2xl font-bold leading-tight text-teal-primary sm:text-3xl lg:text-4xl">
              Kemudahan Menuju Baitullah dengan Tabungan Syariah
            </h2>
          )}
          <p className="mt-3 text-sm leading-6 text-slate-body sm:text-base">
            Wujudkan niat ibadah Anda dan keluarga melalui perencanaan keuangan yang terarah, aman, dan transparan bersama bank syariah mitra resmi Risalah Madina Tour.
          </p>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 cols): Skema & DP Rules + Direct Help */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Opsi Pembayaran Card */}
            <div className="rounded-card border border-warm-border bg-warm-bg p-6 shadow-card space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block mb-1">
                  Metode Fleksibel
                </span>
                <h3 className="font-serif text-xl font-bold text-teal-primary">
                  Pilihan Skema Pembayaran
                </h3>
              </div>

              <div className="space-y-3">
                {company.financing.options.map((option, index) => (
                  <div key={option} className="flex gap-3 border-b border-warm-border/70 pb-3 last:border-0 last:pb-0">
                    <span className="font-mono text-xs font-bold text-gold-hover bg-gold-light w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs sm:text-sm leading-5 text-slate-body">{option}</span>
                  </div>
                ))}
              </div>

              {/* Ketentuan Uang Muka (DP) */}
              <div className="border-t border-warm-border pt-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block">
                  Ketentuan Uang Muka (DP)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-button bg-warm-surface border border-warm-border">
                    <span className="text-[11px] text-slate-muted block">DP Paket Umroh</span>
                    <span className="text-sm font-bold text-teal-primary block mt-0.5">{company.financing.umrahDp}</span>
                    <span className="text-[10px] text-slate-caption block mt-1">Penguncian seat tiket</span>
                  </div>
                  <div className="p-3 rounded-button bg-warm-surface border border-warm-border">
                    <span className="text-[11px] text-slate-muted block">DP Haji Khusus</span>
                    <span className="text-sm font-bold text-teal-primary block mt-0.5">{company.financing.hajjDp}</span>
                    <span className="text-[10px] text-slate-caption block mt-1">Nomor porsi Kemenag</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-warm-muted rounded-button border border-warm-border text-xs text-slate-muted leading-relaxed">
                Catatan: {company.financing.note}
              </div>
            </div>

            {/* Rekening & Bantuan Langsung */}
            <div className="rounded-card border border-teal-primary/20 bg-teal-primary p-6 text-white shadow-card space-y-4">
              <h4 className="font-serif text-lg font-bold">Konsultasi Rencana Tabungan</h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Konsultan kami siap membantu menghitungkan simulasi keberangkatan sesuai kemampuan tabungan bulanan keluarga Anda.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-button bg-gold-accent hover:bg-gold-hover px-4 py-2.5 text-xs font-bold text-slate-dark transition-colors shadow-xs"
              >
                Konsultasi Tabungan via WhatsApp
              </a>
            </div>

          </div>

          {/* Right Column (7 cols): Interactive Tabungan Umroh & Haji Simulation */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-card border border-warm-border bg-warm-bg p-6 shadow-card space-y-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-warm-border gap-2" role="tablist" aria-label="Pilihan Tabungan">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "umroh"}
                  onClick={() => setActiveTab("umroh")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "umroh"
                      ? "border-teal-primary text-teal-primary"
                      : "border-transparent text-slate-muted hover:text-slate-dark"
                  }`}
                >
                  Tabungan Umroh Berencana
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "haji"}
                  onClick={() => setActiveTab("haji")}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "haji"
                      ? "border-teal-primary text-teal-primary"
                      : "border-transparent text-slate-muted hover:text-slate-dark"
                  }`}
                >
                  Tabungan Haji Khusus (Tenor 72 Bln)
                </button>
              </div>

              {/* Tab 1: Umroh Content */}
              {activeTab === "umroh" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-xs text-slate-muted font-sans">
                      Estimasi acuan biaya: <strong className="text-teal-primary">Rp 32.500.000 / jemaah</strong>
                    </p>
                    <span className="text-[11px] text-gold-hover font-semibold">
                      Akad Wadiah Yad Dhamanah
                    </span>
                  </div>

                  {/* Desktop & Mobile Card/Table Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {company.financing.umrahSavings.map((row) => (
                      <div
                        key={row.term}
                        className="p-4 rounded-card border border-warm-border bg-warm-surface shadow-xs space-y-2 hover:border-teal-primary/30 transition-colors"
                      >
                        <span className="text-[11px] font-bold text-gold-hover uppercase tracking-wider block font-sans">
                          {row.term}
                        </span>
                        <div className="border-t border-warm-border pt-2 space-y-1">
                          <div>
                            <span className="text-[10px] text-slate-muted block">Setoran Bulanan</span>
                            <span className="font-serif text-lg font-bold text-teal-primary block">
                              {row.monthly}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-muted block">Setara Harian</span>
                            <span className="text-xs font-semibold text-slate-body block">
                              {row.daily}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-caption leading-relaxed italic pt-2">
                    *Dana tabungan tersimpan aman di rekening bank syariah atas nama calon jemaah sendiri dan dapat ditarik untuk pelunasan saat jadwal keberangkatan ditentukan.
                  </p>
                </div>
              )}

              {/* Tab 2: Haji Content */}
              {activeTab === "haji" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-xs text-slate-muted font-sans">
                      Program porsi resmi Kemenag RI dengan jangka menabung terencana.
                    </p>
                    <span className="text-[11px] text-teal-primary font-semibold">
                      Kurs USD Transparan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {company.financing.hajjSavings.map((row) => (
                      <div
                        key={row.name}
                        className="p-5 rounded-card border border-warm-border bg-warm-surface shadow-xs space-y-3 hover:border-teal-primary/30 transition-colors"
                      >
                        <span className="font-serif text-base font-bold text-teal-primary block">
                          {row.name}
                        </span>

                        <div className="space-y-2 text-xs border-t border-warm-border pt-3">
                          <div className="flex justify-between items-center text-slate-body">
                            <span className="text-slate-muted">Deposit Nomor Porsi:</span>
                            <span className="font-bold text-teal-primary">{row.deposit}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-body">
                            <span className="text-slate-muted">Angsuran Bulanan:</span>
                            <span className="font-bold text-teal-primary">{row.monthly}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-body border-t border-warm-border/60 pt-2">
                            <span className="text-slate-muted">Total Tabungan:</span>
                            <span className="font-bold text-gold-hover text-sm">{row.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-caption leading-relaxed italic pt-2">
                    *Setoran bulanan tabungan berlangsung selama 72 bulan. Estimasi biaya akhir disesuaikan dengan BPIH Khusus yang ditetapkan Pemerintah Republik Indonesia pada tahun keberangkatan.
                  </p>
                </div>
              )}

            </div>

            {/* Perlengkapan Umroh Premium */}
            <div className="rounded-card border border-warm-border bg-warm-bg p-6 shadow-card space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans block mb-1">
                  Fasilitas Jemaah
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-teal-primary">
                  Perlengkapan Ibadah Eksklusif Termasuk
                </h3>
                <p className="mt-1 text-xs text-slate-muted font-sans">
                  Setiap jemaah yang terdaftar mendapatkan paket perlengkapan resmi dari Risalah Madina Tour.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {company.equipment.map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded-button bg-warm-surface border border-warm-border/80 flex items-center gap-2 text-xs text-slate-body font-sans font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                    <span className="truncate" title={item}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
