import React from "react";

/**
 * WHY US SECTION — "Kenapa Memilih Kami"
 * 4 poin spesifik untuk bisnis travel haji/umroh (Bukan template generik)
 */

const features = [
  {
    id: "bandingkan-paket",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Bandingkan paket dengan tenang",
    desc: "Jadwal, durasi, maskapai, hotel, itinerary, dan fasilitas tersedia dalam satu alur informasi.",
  },
  {
    id: "tour-leader",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Rincian sebelum daftar",
    desc: "Komponen yang termasuk dan belum termasuk dipisahkan agar keluarga dapat menilai biaya dengan lebih jelas.",
  },
  {
    id: "hotel-dekat",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    title: "Pilihan kamar terlihat",
    desc: "Quad, triple, dan double dijelaskan sebagai pilihan terpisah dengan harga per orang.",
  },
  {
    id: "pendampingan",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Pendampingan yang tertata",
    desc: "Alur dokumen, manasik, keberangkatan, dan konfirmasi akhir dijelaskan sesuai paket yang dipilih.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="deferred-section py-12 sm:py-16 bg-warm-surface border-t border-warm-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Keunggulan layanan</p>
          <h2 className="font-serif text-3xl sm:text-[2.2rem] font-bold text-teal-primary leading-tight">
            Kenapa Memilih Kami
          </h2>
          <p className="font-sans text-sm text-slate-muted mt-2 leading-relaxed">
            Mulai dari informasi yang dapat diperiksa, lalu konfirmasi data terbaru sebelum pendaftaran.
          </p>
        </div>

        {/* ── 4-Point Feature Grid: 2 kolom desktop / 1 mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              className="p-5 sm:p-6 rounded-card border border-warm-border bg-warm-bg flex flex-col sm:flex-row items-start gap-4"
            >
              {/* Icon Container */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-card bg-teal-primary/10 text-teal-primary flex items-center justify-center">
                  {f.icon}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-base sm:text-lg font-bold text-teal-primary mb-1">
                  {f.title}
                </h3>
                <p className="font-sans text-sm text-slate-body leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
