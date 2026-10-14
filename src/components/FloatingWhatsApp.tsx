"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import type { CompanyProfile } from "@/data/company";
import { getGeneralWhatsAppUrl } from "@/lib/contact";
import InquiryDialog from "@/components/InquiryDialog";

export default function FloatingWhatsApp({ company }: { company: CompanyProfile }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const pathname = usePathname();
  const waUrl = getGeneralWhatsAppUrl(company.phone);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2.5 font-sans pointer-events-auto">
      {/* Tooltip Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-dark text-xs font-bold shadow-elevated border border-warm-border/60 animate-in fade-in slide-in-from-right-2 duration-300">
          <span>Hubungi Kami</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-muted hover:text-slate-dark text-[10px] ml-1 p-0.5"
            aria-label="Tutup pesan bantuan"
          >
            ✕
          </button>
        </div>
      )}

      {/* WhatsApp Circular Button with 48x48 Touch Target */}
      <InquiryDialog
        href={waUrl}
        phone={company.phone}
        source="general"
        sourceLabel="Konsultasi umum dari tombol WhatsApp"
        label="Hubungi Layanan Jamaah via WhatsApp"
        ariaLabel="Hubungi Layanan Jamaah via WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-elevated hover:scale-105 active:scale-95 transition-[background-color,transform,box-shadow] duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
        </svg>
      </InquiryDialog>
    </div>
  );
}
