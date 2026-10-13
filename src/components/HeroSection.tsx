"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CompanyProfile } from "@/data/company";

const trustPillars = [
  ["Jadwal terkonfirmasi", "Tanggal & maskapai jelas"],
  ["Biaya transparan", "Pilihan kamar terbuka"],
  ["Bimbingan berkompeten", "Dari manasik sampai pulang"],
  ["Perlengkapan lengkap", "Disiapkan sebelum berangkat"],
] as const;

export default function HeroSection({ company }: { company: CompanyProfile }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const heroImage = company.media?.heroUrl || "/images/minaret-hero.jpg";
  const heroVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || company.media?.heroVideoUrl || "";
  const heroHeight = "clamp(430px, 58svh, 560px)";

  useEffect(() => {
    if (!heroVideo) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || nav.connection?.saveData || reducedMotion) return;

    const revealVideo = () => setShowVideo(true);
    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(revealVideo, { timeout: 2500 });
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(revealVideo, 600);
    return () => window.clearTimeout(timeoutId);
  }, [heroVideo]);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    videoRef.current.play().catch(() => undefined);
  }, [showVideo]);

  return (
    <section className="site-hero relative isolate overflow-hidden text-white" style={{ minHeight: heroHeight }}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={heroImage}
          alt={`Suasana ibadah ${company.brandName}`}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover object-center"
        />
        {showVideo && heroVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
            aria-hidden="true"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[#062c22]/35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,44,34,0.94)_0%,rgba(6,44,34,0.78)_38%,rgba(6,44,34,0.28)_76%,rgba(6,44,34,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,44,34,0.82)_0%,rgba(6,44,34,0.08)_62%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[clamp(430px,58svh,560px)] max-w-7xl items-end px-5 pb-7 pt-24 sm:px-8 sm:pb-9 lg:px-12 lg:pb-10">
        <div className="max-w-2xl">
          <p className="eyebrow !text-gold-accent">Umroh &amp; Haji resmi</p>
          <h1 className="mt-4 max-w-2xl text-balance font-sans text-[clamp(2.35rem,5vw,5rem)] font-bold leading-[0.95] tracking-[-0.06em] text-white">
            Berangkat dengan tenang. Pulang membawa makna.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            {company.brandName} mendampingi keluarga Indonesia dengan jadwal, biaya, dan bimbingan yang dapat dipahami sejak konsultasi pertama.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#katalog"
              id="hero-cta-katalog"
              className="inline-flex min-h-11 items-center justify-center border border-gold-accent bg-gold-accent px-5 py-2.5 text-xs font-bold text-slate-dark transition hover:bg-gold-hover sm:text-sm"
            >
              Lihat paket pilihan
            </a>
            <a
              href={`https://wa.me/${company.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Assalamu'alaikum Admin Risalah Madina Tour, saya ingin berkonsultasi mengenai jadwal paket Umroh / Haji.")}`}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-cta-whatsapp"
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-white hover:bg-white/10 sm:text-sm"
            >
              Konsultasi personal
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-3 border-t border-white/20 pt-4 sm:grid-cols-4 sm:gap-x-4">
            {trustPillars.map(([title, description]) => (
              <div key={title} className="min-w-0">
                <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-white/90 sm:text-[11px]">{title}</p>
                <p className="mt-1 text-[10px] leading-4 text-white/55">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-5 top-24 hidden w-40 border-l border-white/25 pl-4 text-[10px] leading-5 text-white/65 lg:block xl:right-12">
          <p className="font-bold uppercase tracking-[0.14em] text-gold-accent">Legalitas perjalanan</p>
          <p className="mt-2">SK PPIU {company.legal.ppiu}</p>
          <p>{company.legal.pihk}</p>
          <p>Akreditasi {company.certification.accreditation}</p>
        </div>
      </div>
    </section>
  );
}
