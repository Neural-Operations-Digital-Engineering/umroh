"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CompanyProfile } from "@/data/company";
import { getGeneralWhatsAppUrl } from "@/lib/contact";
import InquiryDialog from "@/components/InquiryDialog";

/**
 * HUMAN MINIMALIST FOOTER
 * Desain bersih, elegan, manusiawi, dan tanpa clutter generic AI.
 * Menyajikan informasi esensial: legalitas PPIU Kemenag RI, rekening resmi,
 * kanal komunikasi langsung, dan navigasi terstruktur.
 */
export default function Footer({ company }: { company: CompanyProfile }) {
  const currentYear = new Date().getFullYear();
  const waUrl = getGeneralWhatsAppUrl(company.phone);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden border-t border-footer-border bg-footer-bg pt-14 pb-10 font-sans text-footer-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ── Top Row: Brand & Official Trust Badges ── */}
        <div className="grid grid-cols-1 items-start gap-8 border-b border-footer-border pb-10 lg:grid-cols-12">
          
          {/* Brand & Mission (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-button bg-teal-primary text-gold-accent font-serif font-bold text-lg flex items-center justify-center border border-gold-accent/30 shadow-xs group-hover:bg-teal-900 transition-colors">
                RM
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white leading-none block">
                  {company.brandName}
                </span>
                <span className="text-[10px] text-gold-accent uppercase tracking-widest font-semibold mt-0.5 block">
                  Penyelenggara Perjalanan Ibadah Umroh &amp; Haji
                </span>
              </div>
            </Link>

            <p className="max-w-md text-xs leading-relaxed text-footer-muted">
              Membimbing ibadah ke Tanah Suci dengan kepastian jadwal, akomodasi hotel yang terverifikasi, transparansi rincian biaya, dan pendampingan muthowwif berkompeten.
            </p>

            {/* Official Certification Chip */}
            <div className="inline-flex items-center gap-2 rounded-button border border-footer-border-inner bg-footer-elevated px-3 py-1.5 text-xs text-footer-chip-text">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>Izin Resmi PPIU Kemenag RI: <strong className="text-white font-mono">{company.legal.ppiu}</strong></span>
            </div>
          </div>

          {/* Navigation Links (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Katalog Program
              </span>
              <ul className="space-y-2 text-footer-muted">
                <li><Link href="/umroh" className="hover:text-white transition-colors">Paket Umroh Reguler</Link></li>
                <li><Link href="/umroh" className="hover:text-white transition-colors">Umroh Plus (Thaif / Turki)</Link></li>
                <li><Link href="/haji" className="hover:text-white transition-colors">Haji Khusus &amp; Furoda</Link></li>
                <li><Link href="/pembiayaan" className="hover:text-white transition-colors">Skema Tabungan Ibadah</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Informasi
              </span>
              <ul className="space-y-2 text-footer-muted">
                <li><Link href="/tentang" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link href="/legalitas" className="hover:text-white transition-colors">Legalitas &amp; Izin Usaha</Link></li>
                <li><Link href="/dokumentasi" className="hover:text-white transition-colors">Galeri Perjalanan</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ &amp; Syarat Paspor</Link></li>
              </ul>
            </div>
          </div>

          {/* Direct Human Contacts (3 Cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Kantor &amp; Kontak Resmi
            </span>
            
            <p className="text-footer-muted leading-relaxed">
              {company.address}
            </p>

            <div className="pt-1 space-y-1.5">
              <InquiryDialog
                href={waUrl}
                phone={company.phone}
                source="general"
                sourceLabel="Konsultasi umum dari footer"
                label={`WhatsApp: ${company.phone}`}
                className="inline-flex items-center gap-2 text-gold-accent hover:text-white transition-colors font-semibold"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>WhatsApp: {company.phone}</span>
              </InquiryDialog>

              <p className="text-footer-muted">
                Email: <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">{company.email}</a>
              </p>
            </div>
          </div>

        </div>

        {/* ── Official Bank Account Notice (Anti-Fraud Security Strip) ── */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-button border border-footer-border-inner bg-footer-surface px-4 py-3 text-xs sm:flex-row sm:items-center">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 block mb-0.5">
              Himbauan Keamanan Pembayaran
            </span>
            <p className="text-footer-muted max-w-2xl text-[11px]">
              Seluruh pembayaran hanya ditransfer ke rekening resmi an. <strong className="text-white">{company.legalName}</strong>. Kami tidak pernah menggunakan rekening pribadi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {company.bankAccounts.map((bank) => (
              <span key={bank.bank} className="px-2.5 py-1 rounded-badge bg-footer-card border border-footer-border text-[11px] text-white">
                <span className="text-gold-accent font-semibold">{bank.bank}:</span> <span className="font-mono">{bank.account}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Attribution ── */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-subtle">
          <p>© {currentYear} {company.brandName} ({company.legalName}). Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/legalitas" className="hover:text-white transition-colors">Legalitas</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <span>•</span>
            <a href={`https://instagram.com/${company.instagramHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram {company.instagramHandle}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
