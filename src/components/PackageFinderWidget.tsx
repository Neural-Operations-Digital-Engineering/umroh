"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PackageFinderProps {
  availableMonths?: string[];
  cities?: string[];
}

export default function PackageFinderWidget({
  availableMonths = ["Oktober 2026", "November 2026", "Desember 2026", "Januari 2027", "Februari 2027", "Ramadhan 1448H"],
  cities = ["Jakarta", "Kertajati", "Surabaya"],
}: PackageFinderProps) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedMonth !== "all") params.set("bulan", selectedMonth);
    if (selectedType !== "all") params.set("tipe", selectedType);
    if (selectedCity !== "all") params.set("kota", selectedCity);

    const targetUrl = selectedType === "khusus" ? "/haji" : "/umroh";
    const queryString = params.toString();
    router.push(`${targetUrl}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="relative z-20 -mt-8 mx-auto max-w-6xl px-4 sm:-mt-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSearch}
        className="morph-panel rounded-[1.25rem] p-4 sm:p-6 lg:p-7"
      >
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-warm-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-accent" aria-hidden="true" />
              <p className="eyebrow">Pencarian Cepat Jadwal</p>
            </div>
            <h2 className="mt-1.5 font-sans text-lg font-bold tracking-tight text-teal-primary sm:text-xl">Mulai dari jadwal yang paling sesuai</h2>
          </div>
          <span className="text-[11px] leading-4 text-slate-caption sm:text-right sm:text-[10px]">Pilih kebutuhan perjalanan,<br className="hidden sm:inline" />kami bantu siapkan sisanya.</span>
        </div>
        <div className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          
          {/* 1. Bulan Keberangkatan */}
          <div>
            <label
              htmlFor="finder-month"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-muted"
            >
              Bulan Berangkat
            </label>
            <select
              id="finder-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="min-h-12 w-full rounded-button border border-warm-border bg-warm-bg px-3 py-2 text-xs font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary sm:text-sm"
            >
              <option value="all">Semua Bulan</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Jenis Program */}
          <div>
            <label
              htmlFor="finder-type"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-muted"
            >
              Jenis Program
            </label>
            <select
              id="finder-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="min-h-12 w-full rounded-button border border-warm-border bg-warm-bg px-3 py-2 text-xs font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary sm:text-sm"
            >
              <option value="all">Semua Program</option>
              <option value="reguler">Umroh Reguler</option>
              <option value="plus">Umroh Plus Wisata</option>
              <option value="khusus">Haji Khusus / Furoda</option>
            </select>
          </div>

          {/* 3. Kota Embarkasi */}
          <div>
            <label
              htmlFor="finder-city"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-muted"
            >
              Kota Keberangkatan
            </label>
            <select
              id="finder-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="min-h-12 w-full rounded-button border border-warm-border bg-warm-bg px-3 py-2 text-xs font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary sm:text-sm"
            >
              <option value="all">Semua Kota</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Tombol Submit Pencarian */}
          <div>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-button border border-gold-accent bg-gold-accent px-5 py-2.5 font-sans text-sm font-bold text-slate-dark shadow-card transition-all hover:bg-gold-hover active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2.2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <span>Cari Jadwal</span>
              <svg className="w-4 h-4 shrink-0 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
