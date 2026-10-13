import React from "react";
import Link from "next/link";
import InquiryDialog from "@/components/InquiryDialog";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-warm-bg font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-warm-surface border border-warm-border p-8 sm:p-10 rounded-box shadow-card">
        {/* Decorative Badge */}
        <div className="w-16 h-16 rounded-full bg-teal-primary/8 text-teal-primary flex items-center justify-center mx-auto">
          <span className="font-serif font-bold text-2xl text-gold-hover">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
            Halaman atau jadwal paket yang Anda tuju mungkin telah berpindah, sudah selesai masa keberangkatannya, atau URL salah diketik.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/umroh"
            className="w-full min-h-11 px-5 py-2.5 rounded-button bg-teal-primary hover:bg-teal-900 text-white text-xs font-bold shadow-card flex items-center justify-center gap-2 transition-all"
          >
            <span>Lihat Paket Umroh Aktif</span>
            <svg className="w-4 h-4 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/"
            className="w-full min-h-11 px-5 py-2.5 rounded-button border border-warm-border bg-warm-bg hover:bg-warm-muted text-slate-dark text-xs font-semibold flex items-center justify-center transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <p className="text-[11px] text-slate-caption pt-2">
          Butuh bantuan langsung?{" "}
          <InquiryDialog
            href="https://wa.me/6281272230999?text=Assalamu'alaikum%20Admin%20Risalah%20Madina%20Tour,%20saya%20mencari%20informasi%20paket%20ibadah"
            label="Hubungi Customer Service WhatsApp (0812-7223-0999)"
            className="text-teal-primary font-bold hover:underline"
          />
        </p>
      </div>
    </main>
  );
}
