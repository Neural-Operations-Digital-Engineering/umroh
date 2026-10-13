"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show if user hasn't acknowledged before
    const hasConsent = window.localStorage.getItem("rm_cookie_consent");
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const handleDismiss = () => {
    window.localStorage.setItem("rm_cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Pemberitahuan Privasi & Cookie"
      className="fixed bottom-4 left-4 max-w-[calc(100vw-5.5rem)] sm:max-w-xs z-30 animate-in slide-in-from-bottom-2 fade-in duration-300 font-sans pointer-events-auto"
    >
      <div className="bg-slate-dark text-white border border-white/15 p-3 sm:p-3.5 rounded-2xl shadow-elevated text-xs space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-bold text-gold-accent flex items-center gap-1.5 text-[11px] sm:text-xs">
            <svg className="w-3.5 h-3.5 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Kenyamanan &amp; Privasi</span>
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 -mr-1 -mt-1 flex items-center justify-center text-white/60 hover:text-white text-xs font-bold rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tutup pemberitahuan"
          >
            ✕
          </button>
        </div>

        <p className="text-white/80 leading-snug text-[10px] sm:text-[11px]">
          Website ini menggunakan cookie teknis untuk navigasi jadwal paket ibadah. Baca{" "}
          <Link href="/privacy-policy" className="text-gold-light underline hover:text-white">
            Kebijakan Privasi
          </Link>.
        </p>

        <div className="flex items-center justify-end gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-8 px-3 py-1 rounded-lg bg-gold-accent hover:bg-gold-hover text-slate-dark text-[11px] font-bold transition-colors shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </aside>
  );
}
