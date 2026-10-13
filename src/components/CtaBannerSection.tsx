import React from "react";
import Link from "next/link";
import type { CompanyProfile } from "@/data/company";
import InquiryDialog from "@/components/InquiryDialog";

/**
 * CTA BANNER SECTION — Section CTA Penutup
 * Menutup halaman dengan ajakan yang mengarahkan pengguna ke detail paket.
 */

export default function CtaBannerSection({ company }: { company: CompanyProfile }) {
  return (
    <section className="deferred-section py-14 sm:py-20 bg-teal-primary text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-gold-accent">Langkah awal ibadah</p>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-bg leading-tight max-w-3xl mx-auto">
          Wujudkan Niat Ibadah Anda Tahun Ini
        </h2>

        <p className="font-sans text-sm sm:text-base text-slate-100/90 mt-4 max-w-2xl mx-auto leading-relaxed">
          Ceritakan rencana perjalanan Anda. Kami bantu membandingkan jadwal, fasilitas, dan pilihan kamar dengan jelas.
        </p>

        {/* Two actions with different jobs: browse first, ask the team second. */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/umroh"
            id="cta-penutup-jadwal"
            className="w-full sm:w-auto px-7 py-3.5 rounded-button bg-gold-accent hover:bg-gold-hover text-teal-900 font-sans font-bold text-sm shadow-card flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm2 4v8h2v-5.2l4 5.2h2V8h-2v5.2L9 8H7Z" />
            </svg>
            <span>Lihat Jadwal Umroh</span>
          </Link>

          <InquiryDialog
            href={`https://wa.me/${company.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin berkonsultasi mengenai paket Umroh/Haji.")}`}
            id="cta-penutup-lihat-paket"
            label="Konsultasi WhatsApp"
            className="w-full sm:w-auto px-7 py-3.5 rounded-button border border-white/30 hover:bg-white/10 text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          />
        </div>

        {/* Reassurance text */}
        <p className="mt-6 text-xs text-white/70 font-sans">
          Tim kami membantu mencocokkan pilihan paket dengan rencana perjalanan Anda.
        </p>

      </div>
    </section>
  );
}
