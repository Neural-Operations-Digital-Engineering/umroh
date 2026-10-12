"use client";
import React, { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import { Package, FilterState } from "@/types/package";
import { parseDepartureDate } from "@/lib/package";

interface PackageCatalogViewProps {
  initialPackages: Package[];
  title: string;
  subtitle: string;
  badgeLabel: string;
  defaultPackageType?: string;
  catalogScope?: "all" | "umroh" | "haji";
}

const initialFilterState: FilterState = {
  month: "all",
  city: "all",
  duration: "all",
  priceRange: "all",
  packageType: "all",
};

export default function PackageCatalogView({
  initialPackages,
  title,
  subtitle,
  badgeLabel,
  defaultPackageType = "all",
  catalogScope = "all",
}: PackageCatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine if this catalog is dedicated to Haji, Umroh, or All
  const isHajiCatalog = catalogScope === "haji" || defaultPackageType === "khusus" || pathname.startsWith("/haji");
  const isUmrohCatalog = catalogScope === "umroh" || pathname.startsWith("/umroh");

  const [filters, setFilters] = useState<FilterState>(() => ({
    month: searchParams.get("bulan") || "all",
    city: searchParams.get("kota") || "all",
    duration: searchParams.get("durasi") || "all",
    priceRange: searchParams.get("harga") || "all",
    packageType: searchParams.get("tipe") || (isHajiCatalog ? "khusus" : defaultPackageType),
  }));

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(() => searchParams.get("q") || "");
  const [sortOrder, setSortOrder] = useState(() => searchParams.get("urut") || "nearest");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [quickPill, setQuickPill] = useState<string>("all");

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.month !== "all") query.set("bulan", filters.month);
    if (filters.city !== "all") query.set("kota", filters.city);
    if (filters.duration !== "all") query.set("durasi", filters.duration);
    if (filters.priceRange !== "all") query.set("harga", filters.priceRange);
    if (filters.packageType !== defaultPackageType && filters.packageType !== "all") query.set("tipe", filters.packageType);
    if (searchKeyword.trim()) query.set("q", searchKeyword.trim());
    if (sortOrder !== "nearest") query.set("urut", sortOrder);
    router.replace(`${pathname}${query.toString() ? `?${query.toString()}` : ""}`, { scroll: false });
  }, [filters, searchKeyword, sortOrder, pathname, router, defaultPackageType]);

  // Lock body scroll when mobile sheet or compare modal is open
  useEffect(() => {
    if (isMobileFilterOpen || isCompareModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen, isCompareModalOpen]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileFilterOpen(false);
        setIsCompareModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter option choices derived from available data
  const monthOptions = useMemo(() => {
    const months = Array.from(new Set(initialPackages.map((p) => p.departureMonth).filter(Boolean)));
    return [{ value: "all", label: "Semua Bulan" }, ...months.map((m) => ({ value: m, label: m }))];
  }, [initialPackages]);

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(initialPackages.map((p) => p.departureCity).filter(Boolean)));
    return [{ value: "all", label: "Semua Kota Embarkasi" }, ...cities.map((c) => ({ value: c, label: c }))];
  }, [initialPackages]);

  const durationOptions = useMemo(() => {
    if (isHajiCatalog) {
      return [
        { value: "all", label: "Semua Durasi" },
        { value: "medium", label: "20 - 25 Hari (Haji Khusus Standar)" },
        { value: "long", label: "> 25 Hari (Haji Khusus Lengkap)" },
      ];
    }
    return [
      { value: "all", label: "Semua Durasi" },
      { value: "short", label: "9 - 10 Hari (Reguler)" },
      { value: "medium", label: "12 - 14 Hari (Plus / Liburan)" },
      { value: "long", label: "> 15 Hari" },
    ];
  }, [isHajiCatalog]);

  const priceOptions = useMemo(() => {
    if (isHajiCatalog) {
      return [
        { value: "all", label: "Semua Kisaran Biaya" },
        { value: "under-150", label: "< USD 12.000 / Rp 180 Juta" },
        { value: "above-150", label: "> USD 12.000 / Rp 180 Juta (VIP)" },
      ];
    }
    return [
      { value: "all", label: "Semua Kisaran Harga" },
      { value: "under-35", label: "< Rp 35 Juta" },
      { value: "35-45", label: "Rp 35 Juta - Rp 45 Juta" },
      { value: "above-45", label: "> Rp 45 Juta" },
    ];
  }, [isHajiCatalog]);

  // Scope-aware Package Type Options (Crucial fix: isolates Haji vs Umroh)
  const typeOptions = useMemo(() => {
    if (isHajiCatalog) {
      return [
        { value: "all", label: "Semua Program Haji" },
        { value: "khusus", label: "Haji Khusus (Resmi Kemenag)" },
      ];
    }
    return [
      { value: "all", label: "Semua Tipe Umroh" },
      { value: "reguler", label: "Umroh Reguler (9 Hari)" },
      { value: "plus", label: "Umroh Plus (Thaif / Turki / Dubai)" },
    ];
  }, [isHajiCatalog]);

  // Quick Filter Pills data
  const quickPillOptions = useMemo(() => {
    if (isHajiCatalog) {
      return [
        { id: "all", label: "Semua Jadwal Haji" },
        { id: "khusus", label: "Haji Khusus" },
        { id: "nearest", label: "Keberangkatan Terdekat" },
      ];
    }
    return [
      { id: "all", label: "Semua Paket" },
      { id: "reguler", label: "Umroh Reguler" },
      { id: "plus", label: "Umroh Plus & Liburan" },
      { id: "under-35", label: "Budget < 35 Jt" },
      { id: "nearest", label: "Terdekat" },
    ];
  }, [isHajiCatalog]);

  // Handle Quick Filter Pill Click
  const handleQuickPill = (id: string) => {
    setQuickPill(id);
    if (id === "all") {
      setFilters({ ...initialFilterState, packageType: isHajiCatalog ? "khusus" : "all" });
      setSortOrder("nearest");
    } else if (id === "reguler") {
      setFilters((prev) => ({ ...prev, packageType: "reguler" }));
    } else if (id === "plus") {
      setFilters((prev) => ({ ...prev, packageType: "plus" }));
    } else if (id === "khusus") {
      setFilters((prev) => ({ ...prev, packageType: "khusus" }));
    } else if (id === "under-35") {
      setFilters((prev) => ({ ...prev, priceRange: "under-35" }));
    } else if (id === "nearest") {
      setSortOrder("nearest");
    }
  };

  // Filtering logic
  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      if (pkg.lifecycle === "draft" || pkg.lifecycle === "archived") return false;

      // Filter by scope
      if (isHajiCatalog && !pkg.isHaji) return false;
      if (isUmrohCatalog && !pkg.isUmroh) return false;

      // Search keyword filter
      if (
        searchKeyword &&
        !pkg.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.airline.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.hotelMakkah.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.hotelMadinah.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.departureMonth.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.departureCity.toLowerCase().includes(searchKeyword.toLowerCase()) &&
        !pkg.flightType.toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }

      // Month filter
      if (filters.month !== "all" && pkg.departureMonth !== filters.month) {
        return false;
      }

      // City filter
      if (filters.city !== "all" && pkg.departureCity !== filters.city) {
        return false;
      }

      // Duration filter
      if (filters.duration === "short" && (pkg.durationDays < 9 || pkg.durationDays > 10)) {
        return false;
      }
      if (filters.duration === "medium" && (pkg.durationDays < 11 || pkg.durationDays > 15)) {
        return false;
      }
      if (filters.duration === "long" && pkg.durationDays < 16) {
        return false;
      }

      // Price filter
      if (filters.priceRange === "under-35" && pkg.priceNumeric >= 35000000) {
        return false;
      }
      if (filters.priceRange === "35-45" && (pkg.priceNumeric < 35000000 || pkg.priceNumeric > 45000000)) {
        return false;
      }
      if (filters.priceRange === "above-45" && pkg.priceNumeric <= 45000000) {
        return false;
      }

      // Package type filter
      if (filters.packageType !== "all" && pkg.packageType !== filters.packageType) {
        return false;
      }

      return true;
    });
  }, [initialPackages, filters, searchKeyword, isHajiCatalog, isUmrohCatalog]);

  const sortedPackages = useMemo(() => {
    return [...filteredPackages].sort((a, b) => {
      if (sortOrder === "price-low") return a.priceNumeric - b.priceNumeric;
      if (sortOrder === "price-high") return b.priceNumeric - a.priceNumeric;
      if (sortOrder === "duration") return a.durationDays - b.durationDays;
      return parseDepartureDate(a.departureDate) - parseDepartureDate(b.departureDate);
    });
  }, [filteredPackages, sortOrder]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.month !== "all") count++;
    if (filters.city !== "all") count++;
    if (filters.duration !== "all") count++;
    if (filters.priceRange !== "all") count++;
    if (filters.packageType !== "all" && !(isHajiCatalog && filters.packageType === "khusus")) count++;
    if (searchKeyword.trim() !== "") count++;
    return count;
  }, [filters, searchKeyword, isHajiCatalog]);

  const handleResetFilters = () => {
    setFilters({ ...initialFilterState, packageType: isHajiCatalog ? "khusus" : "all" });
    setSearchKeyword("");
    setSortOrder("nearest");
    setQuickPill("all");
  };

  const toggleCompare = (pkg: Package) => {
    setCompareIds((current) =>
      current.includes(pkg.id)
        ? current.filter((id) => id !== pkg.id)
        : current.length < 3
        ? [...current, pkg.id]
        : current
    );
  };

  const comparePackages = initialPackages.filter((pkg) => compareIds.includes(pkg.id));

  return (
    <div id="katalog" className="site-shell min-h-screen max-w-full overflow-x-clip py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* ── Page Header Banner ── */}
        <div className="page-intro relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <p className="eyebrow mb-3">{badgeLabel}</p>
            <h1 className="editorial-title max-w-4xl">
              {title}
            </h1>
            <p className="editorial-lede mt-4">
              {subtitle}
            </p>
          </div>
        </div>

        {/* ── Quick Filter Pills (Proportional Horizontal Scroll on Mobile) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-xs font-bold text-slate-caption shrink-0 mr-1 hidden sm:inline">
            Pilihan Cepat:
          </span>
          {quickPillOptions.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handleQuickPill(pill.id)}
              className={`min-h-10 px-3.5 py-1.5 rounded-button text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                quickPill === pill.id
                  ? "bg-teal-primary text-white shadow-xs font-bold"
                  : "bg-warm-surface text-slate-body border border-warm-border hover:bg-warm-muted"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ── Search Bar & Controls Bar ── */}
        <div className="catalog-panel flex flex-col items-stretch justify-between gap-3 p-3.5 sm:flex-row sm:items-center sm:p-4">
          
          {/* Quick Search */}
          <div className="relative flex-1">
            <label htmlFor="catalog-search-input" className="sr-only">
              Cari paket ibadah
            </label>
            <input
              id="catalog-search-input"
              type="search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari paket, maskapai, hotel, kota..."
              className="w-full pl-9 pr-8 py-2.5 rounded-button border border-warm-border bg-warm-bg text-xs sm:text-sm font-sans text-slate-dark focus:outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-caption absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword("")}
                className="absolute right-3 top-2.5 text-xs text-slate-caption hover:text-slate-dark"
                aria-label="Bersihkan pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results Counter & Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <span className="text-xs font-sans text-slate-muted shrink-0" aria-live="polite">
              <strong className="text-teal-primary font-bold">{sortedPackages.length}</strong> jadwal ditemukan
            </span>

            {/* Sorting */}
            <label htmlFor="catalog-sort-order" className="sr-only">
              Urutkan jadwal paket
            </label>
            <select
              id="catalog-sort-order"
              aria-label="Urutkan paket"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="min-h-10 rounded-button border border-warm-border bg-warm-bg px-2.5 py-1.5 text-xs text-slate-dark focus:border-teal-primary focus:outline-none font-medium"
            >
              <option value="nearest">Terdekat</option>
              <option value="price-low">Harga Termurah</option>
              <option value="price-high">Harga Tertinggi</option>
              <option value="duration">Durasi Terpendek</option>
            </select>


            {/* View Switcher (Desktop & Tablet) */}
            <div className="hidden md:flex items-center rounded-button border border-warm-border bg-warm-bg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-button transition-colors ${
                  viewMode === "grid" ? "bg-white text-teal-primary shadow-xs" : "text-slate-muted hover:text-slate-dark"
                }`}
                title="Tampilan Grid"
                aria-label="Tampilan Grid"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-button transition-colors ${
                  viewMode === "list" ? "bg-white text-teal-primary shadow-xs" : "text-slate-muted hover:text-slate-dark"
                }`}
                title="Tampilan List"
                aria-label="Tampilan List"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Filter Trigger Button (<1024px) */}
            <button
              type="button"
              id="btn-open-mobile-filter"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-button bg-teal-primary text-white font-sans text-xs font-bold shadow-card hover:bg-teal-900 transition-all shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</span>
            </button>
          </div>
        </div>

        {/* ── Active Filters Tag Bar ── */}
        {activeFilterCount > 0 && (
          <div className="flex items-center flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-caption font-sans">Filter Aktif:</span>
            
            {filters.month !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-primary/10 text-teal-primary text-xs font-medium border border-teal-primary/20">
                <span>Bulan: {filters.month}</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, month: "all" })}
                  className="hover:text-red-500 font-bold"
                  aria-label="Hapus filter bulan"
                >
                  ✕
                </button>
              </span>
            )}

            {filters.city !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-primary/10 text-teal-primary text-xs font-medium border border-teal-primary/20">
                <span>Kota: {filters.city}</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, city: "all" })}
                  className="hover:text-red-500 font-bold"
                  aria-label="Hapus filter kota"
                >
                  ✕
                </button>
              </span>
            )}

            {filters.duration !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-primary/10 text-teal-primary text-xs font-medium border border-teal-primary/20">
                <span>Durasi: {durationOptions.find((d) => d.value === filters.duration)?.label}</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, duration: "all" })}
                  className="hover:text-red-500 font-bold"
                  aria-label="Hapus filter durasi"
                >
                  ✕
                </button>
              </span>
            )}

            {filters.priceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-primary/10 text-teal-primary text-xs font-medium border border-teal-primary/20">
                <span>Harga: {priceOptions.find((p) => p.value === filters.priceRange)?.label}</span>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, priceRange: "all" })}
                  className="hover:text-red-500 font-bold"
                  aria-label="Hapus filter harga"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-status-soldout hover:underline font-bold ml-1 font-sans"
            >
              Reset Semua
            </button>
          </div>
        )}

        {/* ── Main Catalog Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── DESKTOP SIDEBAR FILTER (≥1024px) ── */}
          <aside className="hidden lg:block lg:col-span-4 bg-warm-surface rounded-card border border-warm-border p-5 shadow-card sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-warm-border">
              <div className="flex items-center gap-2 font-serif font-bold text-base text-teal-primary">
                <svg className="w-4 h-4 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter Pencarian</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-teal-primary hover:text-gold-hover font-bold font-sans transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* 1. Tipe Paket (Scope-Aware) */}
            {typeOptions.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-caption font-sans block">
                  {isHajiCatalog ? "Program Haji" : "Tipe Paket Umroh"}
                </label>
                <div className="space-y-1">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFilters({ ...filters, packageType: opt.value })}
                      className={`w-full text-left px-3 py-2 rounded-button text-xs font-sans font-semibold transition-all flex items-center justify-between ${
                        filters.packageType === opt.value
                          ? "bg-teal-primary text-white shadow-xs"
                          : "bg-warm-bg hover:bg-warm-muted text-slate-body border border-warm-border/60"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.packageType === opt.value && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Bulan Keberangkatan */}
            <div className="space-y-1.5">
              <label htmlFor="filter-desktop-month" className="text-[11px] font-bold uppercase tracking-wider text-slate-caption font-sans block">
                Bulan Keberangkatan
              </label>
              <select
                id="filter-desktop-month"
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                className="w-full px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs font-sans text-slate-dark focus:outline-none focus:border-teal-primary"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Kota Embarkasi */}
            <div className="space-y-1.5">
              <label htmlFor="filter-desktop-city" className="text-[11px] font-bold uppercase tracking-wider text-slate-caption font-sans block">
                Kota Embarkasi
              </label>
              <select
                id="filter-desktop-city"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs font-sans text-slate-dark focus:outline-none focus:border-teal-primary"
              >
                {cityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Durasi */}
            <div className="space-y-1.5">
              <label htmlFor="filter-desktop-duration" className="text-[11px] font-bold uppercase tracking-wider text-slate-caption font-sans block">
                Durasi Perjalanan
              </label>
              <select
                id="filter-desktop-duration"
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs font-sans text-slate-dark focus:outline-none focus:border-teal-primary"
              >
                {durationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Range Harga */}
            <div className="space-y-1.5">
              <label htmlFor="filter-desktop-price" className="text-[11px] font-bold uppercase tracking-wider text-slate-caption font-sans block">
                Kisaran Biaya
              </label>
              <select
                id="filter-desktop-price"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-xs font-sans text-slate-dark focus:outline-none focus:border-teal-primary"
              >
                {priceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Consultation helper */}
            <div className="pt-3 border-t border-warm-border text-center">
              <p className="text-[11px] text-slate-muted leading-relaxed mb-2">
                Butuh tanggal khusus atau rombongan keluarga?
              </p>
              <a
                href="https://wa.me/6281272230999?text=Assalamu'alaikum%20Admin%20Risalah%20Madina%20Tour,%20saya%20ingin%20konsultasi%20paket%20ibadah%20custom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-button bg-warm-bg hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Konsultasi CS WhatsApp (0812-7223-0999)</span>
              </a>
            </div>
          </aside>

          {/* ── RESULTS: Responsive Vertical Grid or List (No forced horizontal rail) ── */}
          <div className="lg:col-span-8 space-y-5">
            {sortedPackages.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {sortedPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    layoutMode={viewMode}
                    compareSelected={compareIds.includes(pkg.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              /* ── Actionable Empty State ── */
              <div className="bg-warm-surface rounded-card border border-warm-border p-8 sm:p-12 text-center shadow-card space-y-4">
                <div className="w-14 h-14 rounded-full bg-teal-primary/8 text-teal-primary flex items-center justify-center mx-auto mb-1">
                  <svg className="w-7 h-7 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">
                  Tidak ada jadwal yang cocok
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-muted max-w-md mx-auto leading-relaxed">
                  Tidak ada jadwal yang memenuhi kombinasi filter saat ini. Coba sesuaikan bulan atau reset filter.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-button bg-teal-primary hover:bg-teal-900 text-white font-sans text-xs font-bold shadow-card transition-all"
                  >
                    Reset Filter Pencarian
                  </button>
                  <a
                    href="https://wa.me/6281272230999?text=Assalamu'alaikum%20Admin%20Risalah%20Madina%20Tour,%20saya%20mencari%20jadwal%20keberangkatan%20khusus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-button border border-warm-border bg-warm-bg text-slate-dark font-sans text-xs font-bold hover:bg-warm-muted transition-all"
                  >
                    Tanya Admin WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── STICKY FLOATING COMPARE DOCK (Appears when 1-3 packages are selected) ── */}
      {comparePackages.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-teal-primary text-white rounded-box p-3 sm:p-4 shadow-elevated border border-gold-accent/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-gold-accent text-teal-900 text-xs font-bold flex items-center justify-center font-mono shrink-0">
                {comparePackages.length}
              </span>
              
              <div className="hidden sm:flex items-center gap-2 overflow-hidden">
                {comparePackages.map((pkg) => (
                  <span key={pkg.id} className="text-xs text-white/90 bg-white/10 px-2 py-1 rounded-badge truncate max-w-[140px]">
                    {pkg.name}
                  </span>
                ))}
              </div>

              <span className="sm:hidden text-xs font-semibold truncate">
                {comparePackages.length} Paket Dipilih
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-white/70 hover:text-white px-2 py-1"
                aria-label="Batalkan pilihan bandingkan"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                disabled={comparePackages.length < 2}
                className={`px-4 py-2 rounded-button text-xs font-bold transition-all shadow-card flex items-center gap-1.5 ${
                  comparePackages.length >= 2
                    ? "bg-gold-accent hover:bg-gold-hover text-slate-dark"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                <span>Bandingkan {comparePackages.length >= 2 ? "Sekarang" : "(Pilih Min 2)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE-BY-SIDE COMPARISON MODAL DRAWER ── */}
      {isCompareModalOpen && comparePackages.length >= 2 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCompareModalOpen(false)}
          />

          {/* Modal Panel */}
          <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-warm-surface rounded-card sm:rounded-box border border-warm-border shadow-elevated flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-warm-border flex items-center justify-between bg-warm-muted/50">
              <div>
                <h2 id="compare-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">
                  Perbandingan Paket Ibadah
                </h2>
                <p className="text-xs text-slate-muted mt-0.5">
                  Membandingkan {comparePackages.length} paket secara berdampingan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="w-9 h-9 rounded-full bg-warm-surface border border-warm-border flex items-center justify-center text-slate-dark hover:bg-warm-muted font-bold"
                aria-label="Tutup modal perbandingan"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Comparison Table */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-sans">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-teal-primary/20">
                      <th className="p-3 text-slate-muted font-bold uppercase tracking-wider text-[11px] w-36">
                        Spesifikasi
                      </th>
                      {comparePackages.map((pkg) => (
                        <th key={pkg.id} className="p-3 font-bold text-teal-primary align-top">
                          <span className="text-[10px] text-gold-hover font-bold uppercase block">{pkg.category}</span>
                          <span className="text-sm sm:text-base font-serif font-bold text-teal-primary">{pkg.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border text-slate-body">
                    {/* Keberangkatan */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Keberangkatan</td>
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3 font-bold">{pkg.departureDate}</td>
                      ))}
                    </tr>
                    {/* Durasi */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Durasi Paket</td>
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3 font-mono font-semibold">{pkg.duration}</td>
                      ))}
                    </tr>
                    {/* Maskapai */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Penerbangan</td>
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3">
                          <span className="font-semibold text-slate-dark block">{pkg.airline}</span>
                          <span className="text-[11px] text-slate-muted">{pkg.flightType || "Direct Flight"}</span>
                        </td>
                      ))}
                    </tr>
                    {/* Hotel Makkah */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Hotel Makkah</td>
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3 font-medium">{pkg.hotelMakkah}</td>
                      ))}
                    </tr>
                    {/* Hotel Madinah */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Hotel Madinah</td>
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3 font-medium">{pkg.hotelMadinah}</td>
                      ))}
                    </tr>
                    {/* Harga Kamar Quad */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Kamar Quad (4 org)</td>
                      {comparePackages.map((pkg) => {
                        const quadPrice = pkg.roomPricing?.find((r) => r.type === "Quad")?.price || pkg.discountedPrice;
                        return (
                          <td key={pkg.id} className="p-3 font-bold text-teal-primary text-sm sm:text-base">
                            {quadPrice}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Harga Kamar Double */}
                    <tr>
                      <td className="p-3 font-bold text-teal-primary bg-warm-muted/30">Kamar Double (2 org)</td>
                      {comparePackages.map((pkg) => {
                        const doublePrice = pkg.roomPricing?.find((r) => r.type === "Double")?.price || "Konfirmasi Admin";
                        return (
                          <td key={pkg.id} className="p-3 font-semibold text-slate-dark">
                            {doublePrice}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Action button row */}
                    <tr>
                      <td className="p-3 bg-warm-muted/30" />
                      {comparePackages.map((pkg) => (
                        <td key={pkg.id} className="p-3">
                          <Link
                            href={`/${pkg.isHaji ? "haji" : "umroh"}/${pkg.slug}`}
                            onClick={() => setIsCompareModalOpen(false)}
                            className="inline-flex w-full min-h-10 items-center justify-center rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark font-bold text-xs shadow-card"
                          >
                            Lihat Detail
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── MOBILE & TABLET BOTTOM SHEET FILTER MODAL (<1024px) ── */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-dark/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Panel */}
          <div className="relative z-10 w-full max-h-[85vh] bg-warm-surface rounded-t-[24px] border-t border-warm-border shadow-elevated flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* Header */}
            <div className="p-4 border-b border-warm-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gold-accent" />
                <h3 id="mobile-filter-title" className="font-serif text-lg font-bold text-teal-primary">
                  Filter Paket Ibadah
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-status-soldout hover:underline font-bold font-sans"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-warm-muted flex items-center justify-center text-slate-dark font-bold text-sm"
                  aria-label="Tutup filter"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 font-sans">
              
              {/* 1. Tipe Paket */}
              {typeOptions.length > 1 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-caption block mb-1.5">
                    {isHajiCatalog ? "Program Haji" : "Tipe Paket Umroh"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFilters({ ...filters, packageType: opt.value })}
                        className={`min-h-[42px] px-3 py-2 rounded-button text-xs font-semibold text-center transition-all ${
                          filters.packageType === opt.value
                            ? "bg-teal-primary text-white shadow-xs"
                            : "bg-warm-bg text-slate-body border border-warm-border/80 hover:bg-warm-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Bulan Keberangkatan */}
              <div>
                <label htmlFor="filter-mobile-month" className="text-xs font-bold uppercase tracking-wider text-slate-caption block mb-1.5">
                  Bulan Keberangkatan
                </label>
                <select
                  id="filter-mobile-month"
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-sm text-slate-dark focus:outline-none focus:border-teal-primary"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Kota Embarkasi */}
              <div>
                <label htmlFor="filter-mobile-city" className="text-xs font-bold uppercase tracking-wider text-slate-caption block mb-1.5">
                  Kota Embarkasi
                </label>
                <select
                  id="filter-mobile-city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-sm text-slate-dark focus:outline-none focus:border-teal-primary"
                >
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Durasi */}
              <div>
                <label htmlFor="filter-mobile-duration" className="text-xs font-bold uppercase tracking-wider text-slate-caption block mb-1.5">
                  Durasi Perjalanan
                </label>
                <select
                  id="filter-mobile-duration"
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-sm text-slate-dark focus:outline-none focus:border-teal-primary"
                >
                  {durationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Range Harga */}
              <div>
                <label htmlFor="filter-mobile-price" className="text-xs font-bold uppercase tracking-wider text-slate-caption block mb-1.5">
                  Kisaran Biaya
                </label>
                <select
                  id="filter-mobile-price"
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 rounded-button border border-warm-border bg-warm-bg text-sm text-slate-dark focus:outline-none focus:border-teal-primary"
                >
                  {priceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="p-4 border-t border-warm-border bg-warm-surface">
              <button
                type="button"
                id="btn-apply-mobile-filter"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full min-h-12 py-3 px-6 rounded-button bg-teal-primary hover:bg-teal-900 active:scale-[0.98] text-white font-sans text-sm font-bold shadow-card flex items-center justify-center gap-2 transition-all"
              >
                <span>Tampilkan {sortedPackages.length} Paket</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
