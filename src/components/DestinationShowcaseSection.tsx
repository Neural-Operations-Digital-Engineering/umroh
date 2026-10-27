"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { companyProfile, type CompanyProfile } from "@/data/company";

interface DestinationItem {
  id: string;
  title: string;
  sub: string;
  desc: string;
  img: string;
}

const defaultDestinations: DestinationItem[] = (companyProfile.destinationsList as unknown as DestinationItem[]) || [];

export default function DestinationShowcaseSection({ company }: { company: CompanyProfile }) {
  const destinations: DestinationItem[] = company.destinationsList && company.destinationsList.length > 0
    ? company.destinationsList
    : defaultDestinations;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const didMount = useRef(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Let visitors keep a destination still once they start interacting with it.
  useEffect(() => {
    if (!destinations.length || isPaused || !isInView) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % destinations.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [destinations.length, isInView, isPaused]);

  // Geser carousel kartu secara horizontal saja. Jangan pakai scrollIntoView:
  // dia ikut menggulung halaman secara vertikal dan menarik user balik ke section ini.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const rail = railRef.current;
    const card = rail?.children[current] as HTMLElement | undefined;
    if (!rail || !card) return;
    const delta = card.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    rail.scrollTo({ left: rail.scrollLeft + delta, behavior: "smooth" });
  }, [current]);

  const activeDest = destinations[current] || destinations[0] || {
    id: "turki",
    title: "Turki",
    sub: "Umroh Plus Turki",
    desc: "Perjalanan ibadah dan wisata halal bersejarah.",
    img: "/images/destinations/turki.jpg",
  };

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      // Swipe left -> Next
      setCurrent((prev) => (prev + 1) % destinations.length);
    } else if (diff < -40) {
      // Swipe right -> Prev
      setCurrent((prev) => (prev > 0 ? prev - 1 : destinations.length - 1));
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="deferred-section relative min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] w-full bg-showcase-bg text-white overflow-hidden py-10 sm:py-14 my-8 sm:my-12 flex items-center"
      aria-label="Eksplorasi Destinasi Wisata Halal & Umroh Plus"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onFocus={() => setIsPaused(true)}
    >
      {/* ── Background Crossfade ── */}
      {/* Only render the active slide and the next one (preload for smooth transition).
          All other slides are unmounted to avoid fetching their images. */}
      {destinations.map((dest, idx) => {
        const isActive = idx === current;
        const isNext = idx === (current + 1) % destinations.length;
        // Render only the active and next slide; keep previous active briefly via CSS opacity.
        if (!isActive && !isNext) return null;
        return (
          <div
            key={dest.id}
            className={`absolute inset-0 transition-[opacity,transform] duration-1000 ease-in-out ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{ transitionProperty: "opacity, transform" }}
          >
            <Image
              src={dest.img}
              alt={`Latar ${dest.title}`}
              fill
              sizes="100vw"
              loading="lazy"
              className="object-cover object-center"
            />
            {/* Natural Film Vignette */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/40" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0b1015] via-transparent to-black/40" />
          </div>
        );
      })}

      {/* ── Left Timeline Dots (Ventour Design) ── */}
      <div className="hidden lg:flex flex-col items-center justify-between absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 h-64 z-20">
        <div className="w-[1.5px] h-full bg-white/20 absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none" />
        {destinations.map((dest, i) => (
          <button
            key={dest.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={`relative z-10 w-2.5 h-2.5 rounded-full transition-[background-color,box-shadow,transform] duration-300 ${
              i === current
                ? "bg-white scale-150 ring-4 ring-white/30"
                : "bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Pilih destinasi ${dest.title}`}
          />
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:pl-28 lg:pr-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── Left Descriptive Column ── */}
          <div className="min-w-0 lg:col-span-5 space-y-4 sm:space-y-6">
            <h2 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
              {activeDest.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed max-w-md font-normal">
              {activeDest.desc}
            </p>

            {/* Micro Indicator on Mobile/Tablet */}
            <div className="flex items-center gap-2 pt-2 lg:hidden">
              {destinations.map((dest, i) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-[background-color,width] duration-300 ${
                    i === current ? "w-6 bg-white" : "w-2 bg-white/30"
                  }`}
                  aria-label={`Pilih ${dest.title}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right Carousel Cards Column ── */}
          <div className="min-w-0 lg:col-span-7 overflow-hidden">
            <div
              className="flex gap-4 py-2 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory"
              ref={railRef}
            >
              {destinations.map((item, index) => {
                const isActive = index === current;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setCurrent(index)}
                    className={`w-[260px] sm:w-[320px] shrink-0 snap-start cursor-pointer text-left transition-[opacity,transform] duration-500 ${
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-50 hover:opacity-80"
                    }`}
                  >
                    {/* Top card header with label & dots */}
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <span className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-[200px]">
                        {item.sub}
                      </span>
                      <div className="flex gap-1 shrink-0">
                        {destinations.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`h-1 w-1 rounded-full transition-[background-color,width] ${
                              dotIdx === index ? "bg-white w-2" : "bg-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Image Card Container */}
                    <div
                      className={`relative h-[260px] sm:h-[340px] w-full rounded-card overflow-hidden border transition-[border-color,box-shadow] duration-500 shadow-elevated ${
                        isActive
                          ? "border-white/50 ring-2 ring-white/20 shadow-white/10"
                          : "border-white/15"
                      }`}
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 260px, 320px"
                        loading="lazy"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
