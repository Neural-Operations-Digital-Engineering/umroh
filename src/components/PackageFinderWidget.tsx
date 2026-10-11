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
    <div className="relative z-20 -mt-6 sm:-mt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSearch}
        className="rounded-card sm:rounded-box border border-warm-border bg-warm-surface p-4 sm:p-6 shadow-elevated"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
          
          {/* 1. Bulan Keberangkatan */}
          <div>
            <label
              htmlFor="finder-month"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted mb-1.5"
            >
              Bulan Berangkat
            </label>
            <select
              id="finder-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full min-h-11 px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs sm:text-sm font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
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
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted mb-1.5"
            >
              Jenis Program
            </label>
            <select
              id="finder-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full min-h-11 px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs sm:text-sm font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
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
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted mb-1.5"
            >
              Kota Keberangkatan
            </label>
            <select
              id="finder-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full min-h-11 px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs sm:text-sm font-medium text-slate-dark focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
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
              className="w-full min-h-11 px-5 py-2.5 rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark font-sans text-xs sm:text-sm font-bold shadow-card transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <span>Cari Jadwal</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
