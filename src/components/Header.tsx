"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CompanyProfile } from "@/data/company";
import { getGeneralWhatsAppUrl } from "@/lib/contact";
import InquiryDialog from "@/components/InquiryDialog";

/**
 * HEADER GLOBAL COMPONENT
 * Sticky header with responsive navigation, mobile drawer with thumb-reach optimization,
 * precise active link matching, and smooth animated hamburger icon.
 */
export default function Header({ company }: { company: CompanyProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation Links
  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Umroh", href: "/umroh" },
    { name: "Haji", href: "/haji" },
    { name: "Tentang", href: "/tentang" },
    { name: "Dokumentasi", href: "/dokumentasi" },
    { name: "FAQ", href: "/faq" },
  ];

  // Detect scroll for subtle shadow adjustment
  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const nextIsScrolled = window.scrollY > 10;
        setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
        frameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  if (pathname.startsWith("/admin")) return null;

  // Helper for active matching
  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b border-[#dcd7cc] transition-[background-color,box-shadow] duration-300 ${
          isScrolled
            ? "bg-[#f5f1e9] shadow-[0_10px_30px_rgba(30,41,35,0.08)]"
            : "bg-[#f5f1e9]"
        }`}
      >
        <div className="hidden border-b border-[#dcd7cc]/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#66716b] md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span>Jawa Barat · Indonesia</span>
            <span className="text-teal-primary">Pendampingan ibadah yang tenang dan terukur</span>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-primary rounded-button"
            aria-label={`${company.brandName} Beranda`}
          >
            {/* Monogram */}
            <div className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] border border-[#91ad3e]/50 bg-teal-primary font-serif text-lg font-bold text-gold-accent shadow-[0_6px_16px_rgba(6,44,34,0.18)] transition-transform group-hover:-translate-y-0.5">
              RM
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[1.05rem] font-bold text-teal-primary leading-none tracking-tight">
                {company.brandName}
              </span>
              <span className="text-[10px] font-sans text-slate-muted uppercase tracking-wider font-semibold mt-0.5">
                Umroh &amp; Haji
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (>=1024px) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
              className={`px-3 py-2 text-xs font-semibold font-sans transition-all duration-200 ${
                    isActive
                      ? "text-teal-primary border-b-2 border-gold-accent font-bold"
                      : "text-slate-body hover:text-teal-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <InquiryDialog
              href={getGeneralWhatsAppUrl(company.phone)}
              label="Konsultasi"
              className="flex items-center gap-2 border border-gold-accent bg-gold-accent px-4 py-2.5 font-sans text-xs font-semibold text-slate-dark shadow-[0_6px_16px_rgba(102,125,44,0.16)] transition-all duration-200 hover:bg-gold-hover"
            >
              <svg className="w-3.5 h-3.5 text-slate-dark fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Konsultasi</span>
            </InquiryDialog>
          </div>

          {/* Tablet & Mobile Hamburger Button (<=1023px) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Compact CTA for Mobile/Tablet */}
            <Link
              href="/umroh"
              className="sm:flex hidden px-3.5 py-2 rounded-button bg-gold-accent text-slate-dark text-xs font-semibold items-center gap-1.5 shadow-sm"
            >
              <span>Lihat Paket</span>
            </Link>

            {/* Hamburger Icon with Animated Morphing */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-button border border-warm-border bg-warm-surface text-teal-primary transition-colors hover:bg-warm-muted focus:outline-none focus:ring-2 focus:ring-teal-primary"
              aria-expanded={isMobileMenuOpen}
              aria-label="Buka menu navigasi"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={`w-5 h-0.5 bg-teal-primary rounded-full transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-teal-primary rounded-full transition-all duration-200 ease-in-out ${
                    isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-teal-primary rounded-full transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY & PANEL */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-slate-dark/60 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Content Panel */}
        <div
          className={`absolute top-0 right-0 flex h-full w-full max-w-sm flex-col justify-between border-l border-warm-border bg-[#f5f1e9] shadow-elevated transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-warm-border flex items-center justify-between bg-warm-surface">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-badge bg-teal-primary text-gold-accent font-serif font-bold text-base flex items-center justify-center">
                RM
              </div>
              <span className="font-serif font-bold text-teal-primary text-base">
                {company.brandName}
              </span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
              className="w-9 h-9 rounded-button bg-warm-muted text-slate-muted hover:text-teal-primary flex items-center justify-center"
              aria-label="Tutup menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-5 py-6 overflow-y-auto space-y-1.5 flex-1 flex flex-col justify-center">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-caption mb-2 px-3">
              Navigasi Utama
            </div>
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-button text-sm font-semibold font-sans transition-all duration-200 ${
                    isActive
                      ? "bg-teal-primary text-white shadow-sm font-bold"
                      : "text-slate-body hover:bg-warm-muted hover:text-teal-primary"
                  }`}
                >
                  <span>{link.name}</span>
                  <svg
                    className={`w-4 h-4 ${
                      isActive ? "text-gold-accent" : "text-slate-caption"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA Block */}
          <div className="p-5 border-t border-warm-border bg-warm-surface space-y-3">
            <InquiryDialog
              href={getGeneralWhatsAppUrl(company.phone)}
              label="Konsultasi via WhatsApp"
              className="w-full min-h-12 px-5 py-3 rounded-button bg-teal-primary text-white font-sans text-sm font-semibold shadow-card flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Konsultasi via WhatsApp</span>
            </InquiryDialog>

            <div className="text-center text-[11px] text-slate-caption">
              Tim kami siap membantu memilih jadwal yang sesuai.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
