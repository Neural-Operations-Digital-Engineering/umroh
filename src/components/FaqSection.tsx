"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { CompanyProfile } from "@/data/company";
import { getFaqItems } from "@/data/faq";
import { getGeneralWhatsAppUrl } from "@/lib/contact";
import InquiryDialog from "@/components/InquiryDialog";

export default function FaqSection({
  company,
  compact = false,
  isHeadingH1 = false,
}: {
  company: CompanyProfile;
  compact?: boolean;
  isHeadingH1?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>("cara-daftar");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [category, setCategory] = useState("all");
  
  const faqs = getFaqItems(company);
  const categories = useMemo(() => Array.from(new Set(faqs.map((faq) => faq.category))), [faqs]);
  
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const term = searchKeyword.trim().toLowerCase();
      const matchCat = category === "all" || faq.category === category;
      const matchTerm = !term || `${faq.question} ${faq.answer}`.toLowerCase().includes(term);
      return matchCat && matchTerm;
    });
  }, [faqs, category, searchKeyword]);

  const displayFaqs = compact ? filteredFaqs.slice(0, 5) : filteredFaqs;
  const whatsappUrl = getGeneralWhatsAppUrl(company.phone);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="deferred-section site-shell scroll-mt-24 border-t border-warm-border py-10 font-sans sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb if standalone page */}
        {isHeadingH1 && (
          <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
            <Link href="/" className="hover:text-teal-primary transition-colors">
              Beranda
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-teal-primary font-semibold">Tanya Jawab (FAQ)</span>
          </nav>
        )}

        {/* Section Header */}
        <div className={compact ? "text-center max-w-2xl mx-auto mb-8" : "max-w-3xl space-y-2"}>
          <p className="eyebrow">
            Pusat Informasi &amp; Panduan
          </p>
          {isHeadingH1 ? (
            <h1 className="editorial-title">
              Pertanyaan yang Sering Diajukan
            </h1>
          ) : (
            <h2 className="editorial-title !text-3xl sm:!text-4xl">
              Pertanyaan yang Sering Diajukan
            </h2>
          )}
          <p className="text-xs sm:text-sm text-slate-body leading-relaxed">
            Jawaban transparan seputar pendaftaran, dokumen paspor dan visa, skema pembayaran, hingga fasilitas hotel di Tanah Suci.
          </p>
        </div>

        {compact ? (
          /* COMPACT VIEW FOR HOMEPAGE (Single centered column) */
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="space-y-3.5">
              {displayFaqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`faq-panel overflow-hidden border transition-all duration-200 ${
                      isOpen
                        ? "border-teal-primary/40 bg-warm-surface shadow-xs"
                        : "border-warm-border bg-warm-bg hover:border-teal-primary/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-sans font-bold text-sm text-teal-primary hover:text-teal-900 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-teal-primary/8 text-teal-primary text-xs font-mono flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="leading-snug">{faq.question}</span>
                      </span>
                      <span className="text-lg text-teal-primary shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-body leading-relaxed border-t border-warm-border/40 font-sans sm:pl-14">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center rounded-button border border-teal-primary px-5 py-2.5 text-xs font-bold text-teal-primary hover:bg-teal-primary hover:text-white transition-colors"
              >
                Baca Seluruh Tanya Jawab
              </Link>
            </div>
          </div>
        ) : (
          /* FULL STANDALONE 2-COLUMN VIEW (/faq) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (4 cols sticky): Category Sidebar & Help Card */}
            <aside className="min-w-0 lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Category Filter Widget */}
              <div className="rounded-card border border-warm-border bg-warm-bg p-5 shadow-card space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block font-sans">
                  Kategori Pertanyaan
                </span>

                <nav className="space-y-1.5" aria-label="Kategori FAQ">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-button text-xs font-bold flex items-center justify-between transition-colors ${
                      category === "all"
                        ? "bg-teal-primary text-white"
                        : "text-slate-body hover:bg-warm-surface"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    <span className="text-[10px] font-mono opacity-80">{faqs.length}</span>
                  </button>

                  {categories.map((cat) => {
                    const count = faqs.filter((f) => f.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-button text-xs font-bold flex items-center justify-between transition-colors ${
                          category === cat
                            ? "bg-teal-primary text-white"
                            : "text-slate-body hover:bg-warm-surface"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] font-mono opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Consultation Assistance Card */}
              <div className="rounded-card border border-warm-border bg-warm-bg p-5 shadow-card space-y-3">
                <h3 className="font-serif text-base font-bold text-teal-primary">
                  Belum Menemukan Jawaban?
                </h3>
                <p className="text-xs text-slate-body leading-relaxed font-sans">
                  Tim customer care Risalah Madina Tour siap menjawab pertanyaan Anda secara langsung.
                </p>
                <div className="space-y-2 pt-1">
                  <InquiryDialog
                    href={whatsappUrl}
                    label="Tanya via WhatsApp"
                    className="w-full min-h-11 inline-flex items-center justify-center rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark text-xs font-bold transition-colors shadow-xs"
                  />
                  <a
                    href={`tel:${company.phone.replace(/\D/g, "")}`}
                    className="w-full min-h-11 inline-flex items-center justify-center rounded-button border border-teal-primary text-teal-primary hover:bg-teal-primary hover:text-white text-xs font-bold transition-colors"
                  >
                    Hubungi: {company.phone}
                  </a>
                </div>
              </div>

            </aside>

            {/* Right Column (8 cols): Search Box & Accordion List */}
            <div className="min-w-0 lg:col-span-8 space-y-4">
              
              {/* Search Box */}
              <div className="relative">
                <label htmlFor="faq-search" className="sr-only">Cari pertanyaan</label>
                <input
                  id="faq-search"
                  type="search"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Ketik kata kunci pertanyaan (misal: paspor, visa, kamar, DP)..."
                  className="w-full min-h-12 rounded-card border border-warm-border bg-warm-bg px-4 pl-11 text-xs sm:text-sm text-slate-dark placeholder:text-slate-caption focus:border-teal-primary focus:outline-none focus:ring-2 focus:ring-teal-primary/15 shadow-xs"
                />
                <svg
                  className="w-4 h-4 text-slate-muted absolute left-4 top-4 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Mobile Category Chips (Visible only on mobile/tablet) */}
              <div className="flex gap-2 overflow-x-auto pb-1.5 lg:hidden" aria-label="Pilihan Kategori Mobile">
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className={`min-h-11 px-3.5 py-2 rounded-button text-xs font-bold shrink-0 transition-colors ${
                    category === "all"
                      ? "bg-teal-primary text-white"
                      : "bg-warm-bg border border-warm-border text-slate-body"
                  }`}
                >
                  Semua ({faqs.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-11 px-3.5 py-2 rounded-button text-xs font-bold shrink-0 transition-colors ${
                      category === cat
                        ? "bg-teal-primary text-white"
                        : "bg-warm-bg border border-warm-border text-slate-body"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between text-xs text-slate-muted px-1">
                <span>
                  Menampilkan <strong>{filteredFaqs.length}</strong> pertanyaan
                  {category !== "all" && <> dalam kategori <strong>{category}</strong></>}
                </span>
                {(searchKeyword || category !== "all") && (
                  <button
                    type="button"
                    onClick={() => { setSearchKeyword(""); setCategory("all"); }}
                    className="text-teal-primary font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* Accordion Items List */}
              <div className="space-y-3.5">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openId === faq.id;
                  return (
                    <article
                      key={faq.id}
                      className={`faq-panel overflow-hidden border transition-all duration-200 ${
                        isOpen
                          ? "border-teal-primary/40 bg-warm-surface shadow-xs"
                          : "border-warm-border bg-warm-bg hover:border-teal-primary/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 font-sans font-bold text-sm text-teal-primary hover:text-teal-900 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-teal-primary/8 text-teal-primary text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="leading-snug">{faq.question}</span>
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 ${
                            isOpen ? "bg-teal-primary text-white" : "bg-teal-primary/8 text-teal-primary"
                          }`}
                        >
                          <span className="text-base font-bold leading-none">{isOpen ? "−" : "+"}</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-body leading-relaxed border-t border-warm-border/40 font-sans sm:pl-14">
                          <p>{faq.answer}</p>
                          <div className="mt-3 pt-2 border-t border-warm-border/40 flex items-center justify-between text-[11px] text-slate-caption">
                            <span>Kategori: {faq.category}</span>
                            <span className="text-emerald-700 font-semibold">Jawaban Terverifikasi Tim</span>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="rounded-card border border-warm-border bg-warm-bg p-8 text-center space-y-3">
                    <h3 className="font-serif text-lg font-bold text-teal-primary">
                      Pertanyaan Tidak Ditemukan
                    </h3>
                    <p className="text-xs text-slate-muted max-w-md mx-auto leading-relaxed">
                      Tidak ada pertanyaan yang sesuai dengan kata kunci &quot;{searchKeyword}&quot;. Silakan reset pencarian atau hubungi kami melalui WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setSearchKeyword(""); setCategory("all"); }}
                      className="min-h-11 rounded-button bg-teal-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-900 transition-colors"
                    >
                      Tampilkan Semua Pertanyaan
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
