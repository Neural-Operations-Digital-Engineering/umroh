"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import type { CompanyProfile } from "@/data/company";

/**
 * Homepage opening: real travel footage, one clear brand statement, and four
 * concrete service signals. The image and video carry the emotional weight;
 * the interface stays quiet so the content remains readable.
 */
export default function HeroSection({ company }: { company: CompanyProfile }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const trustPillars = [
    {
      title: "Jadwal Terkonfirmasi",
      desc: "Tanggal & maskapai pasti",
      fullDesc: "Tanggal rilis & maskapai penerbangan terkonfirmasi",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Biaya Transparan",
      desc: "Pilihan kamar jelas",
      fullDesc: "Pilihan Quad, Triple, Double tanpa biaya tersembunyi",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Muthowwif Berizin",
      desc: "Bimbingan sesuai sunnah",
      fullDesc: "Pendampingan ibadah oleh muthowwif berkompeten",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Perlengkapan Lengkap",
      desc: "Koper & busana ibadah",
      fullDesc: "Koper bagasi, kabin, ihram/mukena, dan buku doa",
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
  ];

  const heroImage = company.media?.heroUrl || "/images/minaret-hero.jpg";
  const heroVideo = company.media?.heroVideoUrl || "https://ventour-wp.s3.ap-southeast-3.amazonaws.com/wp-content/uploads/2026/04/30054426/REVISI-VIDEO-WEBSITE-IT_2.mp4";

  // The video is ambient documentation, not a required interaction. The poster
  // image remains the fallback when a browser or battery saver blocks autoplay.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback gracefully to poster image if battery saver / strict policy blocks autoplay
      });
    }
  }, []);

  return (
    <section className="relative min-h-[68svh] sm:min-h-[520px] lg:min-h-[640px] w-full flex flex-col justify-between overflow-hidden bg-slate-dark text-white">
      
      {/* ── Background Video with Seamless Mobile Autoplay + High-Res Poster ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroImage}
          alt={`Suasana Ibadah ${company.brandName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {heroVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
            poster={heroImage}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}

        {/* A single scrim keeps the headline legible over changing footage. */}
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/25 to-black/80 pointer-events-none" />
      </div>

      {/* ── Top Spacer (Balanced for Navbar) ── */}
      <div className="h-6 sm:h-12" />

      {/* ── Center Content: Responsive, Proportional Brand Typography (Clamp Sizing) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 my-auto">
        <div className="max-w-3xl mx-auto flex flex-col items-center space-y-2 sm:space-y-3.5">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-center gap-2 sm:gap-3.5">
            {/* Existing brand monogram, reused without inventing a second logo. */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button border border-gold-accent/50 bg-teal-primary/80 text-sm font-bold text-gold-accent sm:h-11 sm:w-11 sm:text-base">
              RM
            </div>

            <h1 className="font-sans font-extrabold tracking-tight text-white drop-shadow-lg text-[clamp(1.35rem,5.4vw,3.25rem)] leading-none">
              {company.brandName}
            </h1>
          </div>

          <p className="font-sans text-xs sm:text-sm md:text-base font-medium text-white/90 drop-shadow-md">
            Pendampingan Umroh dan Haji untuk keluarga Indonesia. Izin Resmi Kemenag RI.
          </p>

          {/* ── Hero Action CTAs (Primary + Secondary WhatsApp) ── */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#katalog"
              id="hero-cta-katalog"
              className="inline-flex min-h-12 items-center justify-center rounded-button bg-gold-accent hover:bg-gold-hover px-6 py-3 font-sans text-xs sm:text-sm font-bold text-slate-dark shadow-elevated transition-all active:scale-[0.98]"
            >
              Lihat Paket Umroh 2026
            </a>
            <a
              href={`https://wa.me/${company.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Assalamu'alaikum Admin Risalah Madina Tour, saya ingin berkonsultasi mengenai jadwal paket Umroh / Haji.")}`}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-whatsapp"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-button border border-white/30 bg-black/40 hover:bg-black/60 px-5 py-3 font-sans text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all active:scale-[0.98]"
            >
              <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>

          {/* ── Official Legal Badges Strip ── */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-white/90 font-medium">
            <span className="inline-flex items-center rounded-button bg-white/10 px-3 py-1 border border-white/20">
              SK PPIU: {company.legal.ppiu}
            </span>
            <span className="inline-flex items-center rounded-button bg-white/10 px-3 py-1 border border-white/20">
              {company.legal.pihk}
            </span>
            <span className="inline-flex items-center rounded-button bg-white/10 px-3 py-1 border border-white/20">
              Akreditasi {company.certification.accreditation} (KAN)
            </span>
          </div>

        </div>
      </div>

      {/* Four real service signals, kept in a compact reading band. */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-5 sm:pb-8 lg:pb-10">
        <div className="rounded-card border border-white/20 bg-slate-dark/85 p-3 sm:p-5 lg:p-6 shadow-elevated">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 divide-y-0 divide-x-0 lg:divide-x divide-white/10">
            {trustPillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className={`flex items-center gap-2 sm:gap-3.5 ${
                  idx > 0 ? "lg:pl-5" : ""
                }`}
              >
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/10 border border-white/15 shrink-0 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans font-bold text-[11px] sm:text-xs lg:text-sm text-white leading-tight truncate sm:whitespace-normal">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[9px] sm:text-[11px] text-white/75 mt-0.5 leading-tight truncate sm:whitespace-normal">
                    <span className="sm:hidden">{pillar.desc}</span>
                    <span className="hidden sm:inline">{pillar.fullDesc}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

