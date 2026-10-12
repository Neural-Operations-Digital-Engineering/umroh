"use client";
import React from "react";
import Image from "next/image";
import type { CompanyProfile } from "@/data/company";

/**
 * COMPANY PROFILE SECTION — Profil Risalah Madina Tour
 * Layout: 2-column dengan visual media box besar di satu sisi & ringkasan profil di sisi lain.
 */

export default function CompanyProfileSection({ company }: { company: CompanyProfile }) {
  return (
    <section id="tentang" className="scroll-mt-24 py-12 sm:py-16 bg-warm-bg border-t border-warm-border relative overflow-hidden">
      {/* Background grain */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── LEFT COLUMN: Authentic Office / Team Media Placeholder ── */}
          <div className="min-w-0 lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-card overflow-hidden shadow-elevated border border-warm-border bg-warm-surface">
              <div className="relative aspect-4/3 overflow-hidden bg-teal-primary">
                <Image src={company.media?.aboutUrl && company.media.aboutUrl !== "/images/travel-team.jpg" ? company.media.aboutUrl : "/images/kaaba-courtyard.png"} alt="Pelataran Ka'bah di Masjidil Haram" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-teal-900/80 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-badge border border-white/20 bg-teal-900/85 px-3 py-1.5 text-[10px] font-bold text-white">
                  Dokumentasi perjalanan
                </div>
                <p className="absolute bottom-4 left-5 right-5 font-serif text-lg font-bold leading-tight text-white">
                  Hadir sebelum berangkat, mendampingi sampai pulang
                </p>
              </div>

              {/* Bottom detail strip */}
              <div className="p-4 bg-warm-surface border-t border-warm-border flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2 text-teal-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>{company.legalName}</span>
                </div>
                <span className="text-slate-muted text-[11px]">{company.phone}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Content & Trust Badges ── */}
          <div className="min-w-0 lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Profil singkat</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-primary leading-tight">
                Mengenal Risalah Madina Tour
              </h2>
            </div>

            <p className="font-sans text-sm sm:text-base text-slate-body leading-relaxed">
              <strong>{company.brandName}</strong> adalah brand dari {company.legalName}. Layanan yang ditawarkan meliputi Umroh Reguler dan Plus, Haji Khusus, Badal Haji dan Umroh, serta perjalanan domestik dan internasional. Informasi paket di halaman ini bersumber dari profil layanan yang diberikan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm font-sans">
              <div className="rounded-card border border-warm-border bg-warm-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">SK PPIU Kemenag RI</p>
                <p className="mt-1 font-bold text-teal-primary">{company.legal.ppiu}</p>
              </div>
              <div className="rounded-card border border-warm-border bg-warm-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">SK PIHK</p>
                <p className="mt-1 font-bold text-teal-primary">{company.legal.pihk}</p>
              </div>
              <div className="rounded-card border border-warm-border bg-warm-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Sertifikasi</p>
                <p className="mt-1 font-bold text-teal-primary">{company.certification.number} · Akreditasi {company.certification.accreditation}</p>
                <p className="mt-1 text-xs text-slate-muted">Berlaku {company.certification.validUntil}</p>
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`} target="_blank" rel="noopener noreferrer" className="rounded-card border border-warm-border bg-warm-surface p-4 hover:border-teal-primary/40 transition-colors">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-muted">Kantor pusat</p>
                <p className="mt-1 font-bold text-teal-primary">{company.address}</p>
                <p className="mt-1 text-xs text-gold-hover">Buka lokasi di Maps →</p>
              </a>
            </div>

            <details className="rounded-card border border-warm-border bg-warm-surface p-4 text-sm">
              <summary className="cursor-pointer font-bold text-teal-primary">Lihat data legalitas lainnya</summary>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-slate-muted">Akte pendirian</dt><dd className="mt-1 font-semibold text-slate-body">{company.legal.deed}</dd></div>
                <div><dt className="text-xs text-slate-muted">SK Kemenkumham</dt><dd className="mt-1 font-semibold text-slate-body">{company.legal.kemenkumham}</dd></div>
                <div><dt className="text-xs text-slate-muted">Nomor Induk Berusaha</dt><dd className="mt-1 font-semibold text-slate-body">{company.legal.nib}</dd></div>
                <div><dt className="text-xs text-slate-muted">NPWP</dt><dd className="mt-1 font-semibold text-slate-body">{company.legal.npwp}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs text-slate-muted">Penerbit sertifikat</dt><dd className="mt-1 font-semibold text-slate-body">{company.certification.issuer}</dd><dd className="mt-1 text-xs text-slate-muted">Diterbitkan {company.certification.issuedAt}; batas akhir survailen {company.certification.surveillanceDeadline}.</dd></div>
              </dl>
            </details>

            <div className="border-t border-warm-border pt-5">
              <h3 className="font-sans text-base font-bold text-teal-primary">Tim kepemimpinan</h3>
              <div className="mobile-rail sm:grid-cols-3 gap-3 mt-3">
                {company.leaders.map((leader) => (
                  <article key={leader.name} className="overflow-hidden rounded-card border border-warm-border bg-warm-surface">
                    {leader.imageUrl && <div className="relative aspect-square"><Image src={leader.imageUrl} alt={`Foto ${leader.name}`} fill sizes="(max-width: 640px) 82vw, 30vw" className="object-cover" /></div>}
                    <div className="p-4">
                    <h4 className="font-sans text-sm font-bold text-teal-primary">{leader.name}</h4>
                    <p className="mt-1 text-xs font-semibold text-gold-hover">{leader.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-body">{leader.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
