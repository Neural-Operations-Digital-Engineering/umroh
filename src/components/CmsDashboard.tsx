"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Package, PackageLifecycle, RoomPrice } from "@/types/package";
import type { SiteData } from "@/lib/cms/types";
import { createBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase/browser";
import CmsMediaUpload from "@/components/CmsMediaUpload";
import InquiryManager from "@/components/InquiryManager";

type Tab = "packages" | "company" | "financing" | "payments" | "media" | "inquiries" | "transfer";
type FieldValue = unknown;

const inputClass =
  "mt-1 w-full rounded-button border border-warm-border bg-white px-3 py-2 text-sm text-slate-dark outline-none transition focus:border-teal-primary focus:ring-2 focus:ring-teal-primary/10";
const labelClass = "text-[11px] font-bold uppercase tracking-[0.1em] text-slate-muted block";

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function LinesEditor({
  label,
  values,
  onChange,
  addLabel = "+ Tambah baris",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={labelClass}>{label}</span>
        <button
          type="button"
          className="text-xs font-bold text-teal-primary hover:text-gold-hover transition-colors"
          onClick={() => onChange([...values, ""])}
        >
          {addLabel}
        </button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div className="flex gap-2" key={`${label}-${index}`}>
            <input
              className={inputClass.replace("mt-1 ", "")}
              value={value}
              onChange={(event) =>
                onChange(values.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
              }
            />
            <button
              type="button"
              className="w-9 shrink-0 rounded-button border border-warm-border text-slate-muted hover:border-red-200 hover:text-red-600 transition-colors flex items-center justify-center font-bold"
              aria-label={`Hapus ${label} ${index + 1}`}
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyPackage(index: number): Package {
  const id = `paket-baru-${Date.now()}-${index}`;
  const room = (type: RoomPrice["type"], capacity: string): RoomPrice => ({
    type,
    label: `${type} (Kamar ${capacity})`,
    capacity,
    price: "",
    numeric: 0,
    description: "",
  });
  return {
    id,
    name: "Paket Baru",
    slug: id,
    category: "Umroh Reguler",
    packageType: "reguler",
    categoryColor: "bg-teal-primary",
    departureDate: "",
    departureMonth: "",
    duration: "9 Hari",
    durationDays: 9,
    departureCity: "Jakarta (CGK)",
    flightType: "Direct Flight",
    airline: "Saudia Airlines",
    statusType: "available",
    originalPrice: null,
    discountedPrice: "",
    priceNumeric: 0,
    hotelMakkah: "",
    hotelMadinah: "",
    hotelMakkahDetail: "",
    hotelMadinahDetail: "",
    isUmroh: true,
    isHaji: false,
    roomPricing: [room("Quad", "4 Orang"), room("Triple", "3 Orang"), room("Double", "2 Orang")],
    facilitiesIncluded: [],
    facilitiesExcluded: [],
    itinerary: [],
    gallery: [],
  };
}

function normalizeSiteData(value: SiteData): SiteData {
  const next = structuredClone(value);
  next.company.media = next.company.media || {
    heroUrl: "/images/minaret-hero.jpg",
    heroVideoUrl: "https://ventour-wp.s3.ap-southeast-3.amazonaws.com/wp-content/uploads/2026/04/30054426/REVISI-VIDEO-WEBSITE-IT_2.mp4",
    aboutUrl: "/images/kaaba-courtyard.png",
    documentationUrls: [
      "/images/destinations/turki.jpg",
      "/images/destinations/dubai.jpg",
      "/images/destinations/al-ula.jpg",
      "/images/destinations/thaif.jpg",
      "/images/destinations/mesir.jpg",
      "/images/destinations/mekkah.jpg",
    ],
  };
  if (!next.company.destinationsList || next.company.destinationsList.length === 0) {
    next.company.destinationsList = [
      {
        id: "turki",
        title: "Turki",
        sub: "Umroh Plus Turki",
        desc: "Nikmati ibadah umroh yang khusyuk dilanjutkan dengan perjalanan wisata ke Turki, menjelajahi keindahan sejarah Islam, budaya, dan destinasi ikonik yang memukau.",
        img: "/images/destinations/turki.jpg",
      },
      {
        id: "dubai",
        title: "Dubai",
        sub: "Umroh Plus Dubai",
        desc: "Rasakan ibadah umroh yang nyaman sekaligus pengalaman wisata modern di Dubai dengan destinasi kelas dunia, fasilitas mewah, dan suasana kota yang spektakuler.",
        img: "/images/destinations/dubai.jpg",
      },
      {
        id: "mesir",
        title: "Mesir",
        sub: "Umroh Plus Mesir",
        desc: "Sempurnakan ibadah umroh Anda dengan perjalanan ke Mesir, mengunjungi jejak sejarah Islam dan peradaban dunia yang penuh makna dan inspirasi.",
        img: "/images/destinations/mesir.jpg",
      },
      {
        id: "al-ula",
        title: "Al Ula",
        sub: "City Tour Al Ula",
        desc: "Sempurnakan ibadah umroh Anda dengan perjalanan ke Al Ula, menikmati keindahan alam eksotis, situs bersejarah, dan suasana menenangkan penuh keagungan.",
        img: "/images/destinations/al-ula.jpg",
      },
      {
        id: "thaif",
        title: "Thaif",
        sub: "City Tour Thaif",
        desc: "Nikmati ibadah umroh yang khusyuk dilanjutkan dengan kunjungan ke Thaif, kota sejuk dengan pemandangan pegunungan, kebun mawar, dan udara menyegarkan.",
        img: "/images/destinations/thaif.jpg",
      },
      {
        id: "mekkah",
        title: "Mekkah",
        sub: "Umroh Reguler Khusyuk",
        desc: "Raih kemabruran ibadah Umroh langsung di hadapan Ka'bah dan Masjidil Haram dengan hotel dekat serta bimbingan muthowwif berpengalaman.",
        img: "/images/destinations/mekkah.jpg",
      },
    ];
  }
  next.company.leaders = next.company.leaders.map((leader) => ({ ...leader, imageUrl: leader.imageUrl || "" }));
  next.packages = next.packages.map((pkg) => ({
    ...pkg,
    imageUrl: pkg.imageUrl || "",
    gallery: pkg.gallery || [],
  }));
  return next;
}

function MediaManager({
  data,
  setData,
  supabase,
  selectedPackageId,
  setSelectedPackageId,
  updateCompany,
  updateLeader,
  updateGalleryItem,
  addGalleryItem,
  removeGalleryItem,
}: {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData | null>>;
  supabase: SupabaseClient | null;
  selectedPackageId: string | null;
  setSelectedPackageId: (value: string) => void;
  updateCompany: (path: string, value: FieldValue) => void;
  updateLeader: (index: number, key: "name" | "role" | "description" | "imageUrl", value: string) => void;
  updateGalleryItem: (index: number, key: "label" | "tag" | "caption" | "alt" | "imageUrl", value: string) => void;
  addGalleryItem: () => void;
  removeGalleryItem: (index: number) => void;
}) {
  const company = data.company;
  const selectedPackage = data.packages.find((item) => item.id === selectedPackageId) || null;

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="max-w-2xl text-xs leading-relaxed text-slate-muted sm:text-sm">
          Kelola foto latar hero, video sinematik, kartu destinasi wisata halal, dokumentasi jemaah, profil pimpinan, dan cover paket.
        </p>

        <div className="space-y-6">
          {/* 1. Hero Section Media */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">Hero Section (Bagian Atas Homepage)</h2>
            <p className="mt-1 text-xs text-slate-muted">
              Upload foto latar resolusi tinggi atau tautan video sinematik untuk background hero halaman depan.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <CmsMediaUpload
                label="Foto Poster / Latar Menara Hero"
                value={company.media?.heroUrl || "/images/minaret-hero.jpg"}
                folder="site/hero"
                supabase={supabase}
                onChange={(value) => updateCompany("media.heroUrl", value)}
              />
              <div className="space-y-3">
                <Field
                  label="URL Video Sinematik (MP4 / WebM)"
                  value={company.media?.heroVideoUrl || ""}
                  onChange={(value) => updateCompany("media.heroVideoUrl", value)}
                  placeholder="https://.../video.mp4"
                />
                <p className="text-[11px] text-slate-muted leading-relaxed">
                  Video akan otomatis di-loop secara hening di layar desktop. Jika video kosong, website otomatis menggunakan Foto Poster Hero di sebelah kiri.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Destination Showcase Slider */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-warm-border pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">
                  Destinasi Wisata Halal &amp; Umroh Plus (Slider Tengah)
                </h2>
                <p className="mt-1 text-xs text-slate-muted">
                  Kelola foto, nama kota/negara, sub-label, dan deskripsi destinasi yang tampil pada slider interaktif beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newDest = {
                    id: `dest-${Date.now()}`,
                    title: "Destinasi Baru",
                    sub: "Umroh Plus",
                    desc: "Perjalanan ibadah dan wisata sejarah Islam yang memukau.",
                    img: "/images/destinations/turki.jpg",
                  };
                  setData((curr) => {
                    if (!curr) return curr;
                    return {
                      ...curr,
                      company: {
                        ...curr.company,
                        destinationsList: [...(curr.company.destinationsList || []), newDest],
                      },
                    };
                  });
                }}
                className="rounded-button bg-teal-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-900 transition-colors"
              >
                + Tambah Destinasi
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {(company.destinationsList || []).map((dest, destIdx) => (
                <div key={dest.id || destIdx} className="rounded-card border border-warm-border bg-warm-bg p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-warm-border pb-2.5">
                    <span className="text-xs font-bold text-teal-primary uppercase tracking-wider font-mono">
                      Destinasi #{destIdx + 1}: {dest.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setData((curr) => {
                          if (!curr) return curr;
                          const updated = (curr.company.destinationsList || []).filter((_, i) => i !== destIdx);
                          return { ...curr, company: { ...curr.company, destinationsList: updated } };
                        });
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Hapus Destinasi
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nama Destinasi"
                      value={dest.title}
                      onChange={(val) => {
                        setData((curr) => {
                          if (!curr) return curr;
                          const updated = (curr.company.destinationsList || []).map((item, i) =>
                            i === destIdx ? { ...item, title: val } : item
                          );
                          return { ...curr, company: { ...curr.company, destinationsList: updated } };
                        });
                      }}
                    />
                    <Field
                      label="Sub-label (e.g. Umroh Plus Turki)"
                      value={dest.sub}
                      onChange={(val) => {
                        setData((curr) => {
                          if (!curr) return curr;
                          const updated = (curr.company.destinationsList || []).map((item, i) =>
                            i === destIdx ? { ...item, sub: val } : item
                          );
                          return { ...curr, company: { ...curr.company, destinationsList: updated } };
                        });
                      }}
                    />
                  </div>

                  <label className="block">
                    <span className={labelClass}>Deskripsi Perjalanan</span>
                    <textarea
                      className={`${inputClass} min-h-16`}
                      value={dest.desc}
                      onChange={(e) => {
                        setData((curr) => {
                          if (!curr) return curr;
                          const updated = (curr.company.destinationsList || []).map((item, i) =>
                            i === destIdx ? { ...item, desc: e.target.value } : item
                          );
                          return { ...curr, company: { ...curr.company, destinationsList: updated } };
                        });
                      }}
                    />
                  </label>

                  <CmsMediaUpload
                    label={`Foto Kartu Destinasi ${dest.title}`}
                    value={dest.img}
                    folder={`destinations/${dest.id || destIdx}`}
                    supabase={supabase}
                    onChange={(val) => {
                      setData((curr) => {
                        if (!curr) return curr;
                        const updated = (curr.company.destinationsList || []).map((item, i) =>
                          i === destIdx ? { ...item, img: val } : item
                        );
                        return { ...curr, company: { ...curr.company, destinationsList: updated } };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 3. Profil Kantor & Tim Layanan (Tentang Kami) */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">Foto Profil Perusahaan (Halaman Tentang)</h2>
            <p className="mt-1 text-xs text-slate-muted">
              Foto utama kantor atau tim pendamping yang tampil di halaman Tentang Kami dan section profil.
            </p>
            <div className="mt-5">
              <CmsMediaUpload
                label="Foto Kantor / Tim Pendamping"
                value={company.media?.aboutUrl || "/images/kaaba-courtyard.png"}
                folder="site/about"
                supabase={supabase}
                onChange={(value) => updateCompany("media.aboutUrl", value)}
              />
            </div>
          </section>

          {/* 4. Foto Tim Kepemimpinan */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">Foto Tim Kepemimpinan (Direksi &amp; Pimpinan)</h2>
            <p className="mt-1 text-xs text-slate-muted">Foto profil direktur dan komisaris yang ditampilkan pada profil perusahaan.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {company.leaders.map((leader, index) => (
                <div key={`${leader.name}-${index}`} className="space-y-3 rounded-card border border-warm-border p-4 bg-warm-bg">
                  <div>
                    <p className="text-sm font-bold text-teal-primary">{leader.name}</p>
                    <p className="text-[11px] text-slate-muted">{leader.role}</p>
                  </div>
                  <CmsMediaUpload
                    label="Foto Profil"
                    value={leader.imageUrl}
                    folder={`leaders/${index + 1}`}
                    supabase={supabase}
                    onChange={(value) => updateLeader(index, "imageUrl", value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 5. Galeri Dokumentasi Jemaah */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">Galeri Dokumentasi Jemaah</h2>
                <p className="mt-1 text-xs text-slate-muted">
                  Foto-foto suasana ibadah jemaah di Mekkah, Madinah, dan wisata halal (halaman Dokumentasi).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentDocs = company.media?.documentationUrls || [];
                  updateCompany("media.documentationUrls", [...currentDocs, ""]);
                }}
                className="rounded-button bg-teal-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-900 transition-colors"
              >
                + Tambah Foto Dokumentasi
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(company.media?.documentationUrls || []).map((url, docIdx) => (
                <div key={docIdx} className="rounded-card border border-warm-border bg-warm-bg p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-muted">
                    <span>Foto Dokumentasi #{docIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (company.media?.documentationUrls || []).filter((_, i) => i !== docIdx);
                        updateCompany("media.documentationUrls", updated);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                  <CmsMediaUpload
                    label={`Foto #${docIdx + 1}`}
                    value={url}
                    folder={`documentation/${docIdx + 1}`}
                    supabase={supabase}
                    onChange={(newUrl) => {
                      const updated = (company.media?.documentationUrls || []).map((item, i) =>
                        i === docIdx ? newUrl : item
                      );
                      updateCompany("media.documentationUrls", updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 6. Galeri Foto & Cover Tiap Paket */}
          <section className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-warm-border pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">Foto Cover &amp; Galeri Paket</h2>
                <p className="mt-1 text-xs text-slate-muted">Pilih paket untuk mengedit foto cover utama dan foto galeri detailnya.</p>
              </div>
              <label className="block sm:min-w-72">
                <span className={labelClass}>Pilih Paket Ibadah</span>
                <select
                  className={inputClass}
                  value={selectedPackageId || ""}
                  onChange={(event) => setSelectedPackageId(event.target.value)}
                >
                  {data.packages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name || item.slug}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedPackage && (
              <div className="mt-5 space-y-6">
                {/* Main Package Cover Image */}
                <div className="rounded-card border border-warm-border bg-warm-bg p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-primary mb-3">
                    Foto Cover Utama: {selectedPackage.name}
                  </h3>
                  <CmsMediaUpload
                    label="Cover / Banner Paket"
                    value={selectedPackage.imageUrl || ""}
                    folder={`packages/${selectedPackage.slug}`}
                    supabase={supabase}
                    onChange={(val) => {
                      setData((curr) => {
                        if (!curr) return curr;
                        return {
                          ...curr,
                          packages: curr.packages.map((p) =>
                            p.id === selectedPackage.id ? { ...p, imageUrl: val } : p
                          ),
                        };
                      });
                    }}
                  />
                </div>

                {/* Additional Gallery Items */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-primary">
                    Galeri Tambahan Detail ({selectedPackage.gallery?.length || 0} Foto)
                  </h3>
                  {(selectedPackage.gallery || []).map((item, index) => (
                    <div
                      key={item.id}
                      className="grid gap-3 rounded-card border border-warm-border p-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end bg-warm-bg"
                    >
                      <CmsMediaUpload
                        label={`Galeri ${index + 1}`}
                        value={item.imageUrl}
                        folder={`packages/${selectedPackage.slug}/gallery`}
                        supabase={supabase}
                        onChange={(value) => updateGalleryItem(index, "imageUrl", value)}
                      />
                      <Field label="Judul" value={item.label} onChange={(value) => updateGalleryItem(index, "label", value)} />
                      <Field label="Tag" value={item.tag} onChange={(value) => updateGalleryItem(index, "tag", value)} />
                      <Field
                        label="Caption / Alt Text"
                        value={item.caption}
                        onChange={(value) => {
                          updateGalleryItem(index, "caption", value);
                          updateGalleryItem(index, "alt", value);
                        }}
                      />
                      <button
                        type="button"
                        className="min-h-10 rounded-button border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() => removeGalleryItem(index)}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGalleryItem}
                    className="min-h-10 rounded-button border border-teal-primary px-4 py-2.5 text-xs font-bold text-teal-primary hover:bg-teal-primary hover:text-white transition-colors"
                  >
                    + Tambah Foto Galeri Detail
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CmsDashboard() {
  const [data, setData] = useState<SiteData | null>(null);
  const [tab, setTab] = useState<Tab>("packages");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabase = useMemo(() => (typeof window === "undefined" ? null : createBrowserSupabase()), []);

  async function loadData() {
    setBusy(true);
    try {
      if (supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setSessionToken(sessionData.session.access_token);
          setAuthUser(sessionData.session.user.email || "Admin Supabase");
        }
      }
      const response = await fetch("/api/cms", { cache: "no-store" });
      if (!response.ok) throw new Error("Data CMS tidak dapat dimuat.");
      const nextData = normalizeSiteData((await response.json()) as SiteData);
      setData(nextData);
      setSelectedPackageId(nextData.packages[0]?.id || null);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Data CMS tidak dapat dimuat.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPackage = useMemo(
    () => data?.packages.find((item) => item.id === selectedPackageId) || null,
    [data, selectedPackageId]
  );

  function updateCompany(path: string, value: FieldValue) {
    setData((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      const [section, key] = path.split(".");
      const target = key
        ? (next.company as unknown as Record<string, Record<string, FieldValue>>)[section]
        : (next.company as unknown as Record<string, FieldValue>);
      if (key) target[key] = value;
      else (next.company as unknown as Record<string, FieldValue>)[section] = value;
      return next;
    });
  }

  function updatePackage<K extends keyof Package>(key: K, value: Package[K]) {
    setData((current) =>
      current
        ? {
            ...current,
            packages: current.packages.map((item) =>
              item.id === selectedPackageId ? { ...item, [key]: value } : item
            ),
          }
        : current
    );
  }

  function updatePackageArray(key: "facilitiesIncluded" | "facilitiesExcluded", values: string[]) {
    updatePackage(key, values);
  }

  function updateLeader(index: number, key: "name" | "role" | "description" | "imageUrl", value: string) {
    setData((current) =>
      current
        ? {
            ...current,
            company: {
              ...current.company,
              leaders: current.company.leaders.map((leader, leaderIndex) =>
                leaderIndex === index ? { ...leader, [key]: value } : leader
              ),
            },
          }
        : current
    );
  }

  function updateGalleryItem(index: number, key: "label" | "tag" | "caption" | "alt" | "imageUrl", value: string) {
    if (!selectedPackage) return;
    updatePackage(
      "gallery",
      (selectedPackage.gallery || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  }

  function addGalleryItem() {
    if (!selectedPackage) return;
    updatePackage("gallery", [
      ...(selectedPackage.gallery || []),
      { id: `gallery-${Date.now()}`, label: "Dokumentasi baru", tag: "Perjalanan", caption: "", alt: "", imageUrl: "" },
    ]);
  }

  function removeGalleryItem(index: number) {
    if (!selectedPackage) return;
    updatePackage("gallery", (selectedPackage.gallery || []).filter((_, itemIndex) => itemIndex !== index));
  }

  async function saveData() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as SiteData & { error?: string; conflict?: boolean };
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            result.error ||
              "Konflik Versi: Data di database telah diperbarui oleh editor lain. Muat ulang halaman untuk mengambil versi terbaru."
          );
        }
        throw new Error(result.error || "Perubahan tidak dapat disimpan.");
      }
      setData(normalizeSiteData(result));
      setMessage(
        isSupabaseConfigured
          ? "Perubahan tersimpan ke Supabase dan akan tampil global."
          : "Supabase belum dikonfigurasi. Perubahan belum disimpan."
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Perubahan tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function resetData() {
    if (!window.confirm("Kembalikan semua data CMS ke seed dari dokumen profil dan paket?")) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ reset: true, updated_at: data?.updated_at }),
      });
      const result = (await response.json()) as SiteData & { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Reset tidak diizinkan. Hanya admin yang dapat mereset data.");
      }
      const normalizedData = normalizeSiteData(result);
      setData(normalizedData);
      setSelectedPackageId(normalizedData.packages[0]?.id || null);
      setMessage("Data dikembalikan ke seed awal.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Reset gagal.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setSessionToken("");
    setAuthUser("");
    setMessage("Sesi Supabase ditutup.");
  }

  function exportData() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "risalah-madina-cms.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteData;
        if (!parsed.company || !Array.isArray(parsed.packages)) throw new Error("Struktur JSON tidak sesuai CMS.");
        const normalizedData = normalizeSiteData(parsed);
        setData(normalizedData);
        setSelectedPackageId(normalizedData.packages[0]?.id || null);
        setMessage("File diimpor ke editor. Tekan Simpan untuk menerapkannya.");
      } catch (importError) {
        setError(importError instanceof Error ? importError.message : "File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  }

  function addPackage() {
    const nextPackage = emptyPackage(data?.packages.length || 0);
    setData((current) => (current ? { ...current, packages: [...current.packages, nextPackage] } : current));
    setSelectedPackageId(nextPackage.id);
    setTab("packages");
    setMessage("Paket baru ditambahkan ke editor.");
  }

  function deleteSelectedPackage() {
    if (!data || !selectedPackage || !window.confirm(`Hapus ${selectedPackage.name}?`)) return;
    const nextPackages = data.packages.filter((item) => item.id !== selectedPackage.id);
    setData({ ...data, packages: nextPackages });
    setSelectedPackageId(nextPackages[0]?.id || null);
    setMessage("Paket dihapus dari editor. Tekan Simpan untuk menerapkan.");
  }

  if (busy)
    return (
      <main className="cms-shell min-h-screen px-4 py-20 text-center text-slate-muted font-sans">
        Memuat ruang kerja CMS…
      </main>
    );
  if (!data)
    return (
      <main className="cms-shell min-h-screen px-4 py-20 text-center text-red-700 font-sans">
        {error || "Data CMS tidak tersedia."}
      </main>
    );

  const company = data.company;
  const companyRecord = company as unknown as Record<string, string>;
  const legal = company.legal;
  const certification = company.certification;
  const financing = company.financing;

  return (
    <main className="cms-shell min-h-screen text-slate-dark font-sans">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[250px_1fr]">
        
        {/* CMS Sidebar */}
        <aside className="cms-sidebar flex flex-col justify-between p-5 text-white lg:min-h-screen lg:p-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-button border border-gold-accent/40 bg-teal-900 font-serif text-lg font-bold text-gold-accent shadow-xs">
                RM
              </span>
              <div>
                <p className="font-bold font-serif leading-tight">Ruang CMS</p>
                <p className="text-[11px] text-white/60">Risalah Madina Tour</p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/70">
              Kelola jadwal paket, profil perusahaan, legalitas, dan rekening resmi.
            </p>

            <nav className="mt-6 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
              {(
                [
                  ["packages", "Paket Ibadah"],
                  ["company", "Profil & Legalitas"],
                  ["media", "Media Galeri"],
                  ["inquiries", "Inquiry Masuk"],
                  ["financing", "Pembiayaan"],
                  ["payments", "Rekening Bank"],
                  ["transfer", "Backup & Sync"],
                ] as [Tab, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-button px-3 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all ${
                    tab === value
                      ? "bg-gold-accent text-slate-dark shadow-xs font-bold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 rounded-card border border-white/15 bg-white/5 p-3.5 text-xs text-white/70">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
              />
              <strong className="text-white text-[11px]">
                {isSupabaseConfigured ? "Supabase Cloud" : "CMS belum aktif"}
              </strong>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isSupabaseConfigured
                ? "Data tersinkronisasi otomatis secara global."
                : "Konfigurasikan Supabase untuk membaca dan menyimpan data CMS."}
            </p>
          </div>
        </aside>

        {/* CMS Content Body */}
        <section className="cms-workspace min-w-0 space-y-6 p-4 sm:p-7 lg:p-8">
          <header className="flex flex-col gap-4 border-b border-[#d8d2c4] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Content Management System</p>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                {tab === "packages" && "Kelola Jadwal & Paket Ibadah"}
                {tab === "company" && "Profil Perusahaan & Legalitas"}
                {tab === "media" && "Galeri & Aset Media"}
                {tab === "inquiries" && "Inquiry Konsultasi"}
                {tab === "financing" && "Skema Tabungan & Pembiayaan"}
                {tab === "payments" && "Rekening Resmi Perusahaan"}
                {tab === "transfer" && "Backup, Import & Pengaturan"}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={resetData}
                className="rounded-button border border-warm-border bg-white px-3 py-2 text-xs font-bold text-slate-body hover:border-red-200 hover:text-red-700 transition-colors"
              >
                Reset Default
              </button>
              <button
                type="button"
                onClick={saveData}
                disabled={saving}
                className="rounded-button bg-gold-accent px-4 py-2 text-xs font-bold text-slate-dark shadow-card hover:bg-gold-hover disabled:cursor-wait disabled:opacity-60 transition-all flex items-center gap-1.5"
              >
                <span>{saving ? "Menyimpan…" : "Simpan Perubahan"}</span>
              </button>
            </div>
          </header>

          {isSupabaseConfigured && (
            <section className="cms-panel border-teal-primary/20 bg-teal-primary/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-primary">Status Autentikasi CMS</p>
                  <p className="text-xs text-slate-body mt-0.5">
                    {authUser ? `Terhubung sebagai ${authUser}` : "Anda belum login. Masuk untuk menyimpan perubahan ke database."}
                  </p>
                </div>
                {authUser ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-button border border-warm-border bg-white px-3.5 py-1.5 text-xs font-bold text-slate-body hover:bg-warm-muted transition-colors"
                  >
                    Keluar Sesi
                  </button>
                ) : (
                  <a
                    href="/admin/login?next=/admin"
                    className="inline-flex items-center justify-center rounded-button bg-teal-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-900 transition-colors"
                  >
                    Masuk ke CMS →
                  </a>
                )}
              </div>
            </section>
          )}

          {(message || error) && (
            <div
              className={`rounded-button border px-4 py-3 text-sm font-medium ${
                error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {error || message}
            </div>
          )}

          {tab === "media" && (
            <MediaManager
              data={data}
              setData={setData}
              supabase={supabase}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              updateCompany={updateCompany}
              updateLeader={updateLeader}
              updateGalleryItem={updateGalleryItem}
              addGalleryItem={addGalleryItem}
              removeGalleryItem={removeGalleryItem}
            />
          )}

          {tab === "inquiries" && <InquiryManager sessionToken={sessionToken} />}

          {/* TAB 1: PACKAGES */}
          {tab === "packages" && (
            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
              {/* Package selector list */}
              <div className="rounded-card border border-warm-border bg-white p-4 shadow-card">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-warm-border">
                  <h2 className="font-bold text-sm text-teal-primary">Daftar Paket ({data.packages.length})</h2>
                  <button
                    type="button"
                    onClick={addPackage}
                    className="rounded-button bg-teal-primary px-2.5 py-1 text-xs font-bold text-white hover:bg-teal-900"
                  >
                    + Paket Baru
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {data.packages.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedPackageId(item.id)}
                      className={`w-full rounded-button border p-3 text-left transition-all ${
                        selectedPackageId === item.id
                          ? "border-teal-primary bg-teal-primary/8 shadow-xs"
                          : "border-warm-border hover:border-teal-primary/40 bg-warm-bg"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          {item.category || item.packageType}
                        </span>
                        <span className="text-[10px] text-slate-caption font-mono">{item.duration}</span>
                      </div>
                      <span className="mt-1 block text-xs sm:text-sm font-bold leading-snug text-slate-dark truncate">
                        {item.name || "Tanpa nama"}
                      </span>
                      <span className="mt-1 block text-[11px] text-slate-muted">{item.departureDate || "Tanggal belum diisi"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Detail Editor */}
              {selectedPackage && (
                <div className="space-y-5">
                  <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-warm-border">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-hover">Detail Paket</span>
                        <h2 className="font-serif text-xl font-bold text-teal-primary">{selectedPackage.name || "Paket Baru"}</h2>
                      </div>
                      <button
                        type="button"
                        onClick={deleteSelectedPackage}
                        className="rounded-button border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Hapus Paket
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Nama Paket" value={selectedPackage.name} onChange={(value) => updatePackage("name", value)} />
                      <Field
                        label="Slug URL"
                        value={selectedPackage.slug}
                        onChange={(value) => updatePackage("slug", value.toLowerCase().replace(/\s+/g, "-"))}
                      />
                      <Field label="Kategori Tampilan" value={selectedPackage.category} onChange={(value) => updatePackage("category", value)} />
                      <Field label="Tanggal Keberangkatan" value={selectedPackage.departureDate} onChange={(value) => updatePackage("departureDate", value)} />
                      <Field label="Bulan Keberangkatan" value={selectedPackage.departureMonth} onChange={(value) => updatePackage("departureMonth", value)} />
                      <Field label="Durasi Tampilan (e.g. 9 Hari)" value={selectedPackage.duration} onChange={(value) => updatePackage("duration", value)} />
                      <Field
                        label="Jumlah Hari (Numerik)"
                        type="number"
                        value={selectedPackage.durationDays}
                        onChange={(value) => updatePackage("durationDays", Number(value) || 0)}
                      />
                      <Field label="Kota Embarkasi" value={selectedPackage.departureCity} onChange={(value) => updatePackage("departureCity", value)} />
                      <Field label="Jenis Penerbangan" value={selectedPackage.flightType} onChange={(value) => updatePackage("flightType", value)} />
                      <Field label="Maskapai Penerbangan" value={selectedPackage.airline} onChange={(value) => updatePackage("airline", value)} />
                      <Field label="Harga Tampilan" value={selectedPackage.discountedPrice} onChange={(value) => updatePackage("discountedPrice", value)} />
                      <Field
                        label="Harga Numerik (IDR)"
                        type="number"
                        value={selectedPackage.priceNumeric}
                        onChange={(value) => updatePackage("priceNumeric", Number(value) || 0)}
                      />
                      <Field label="Hotel Makkah" value={selectedPackage.hotelMakkah} onChange={(value) => updatePackage("hotelMakkah", value)} />
                      <Field label="Hotel Madinah" value={selectedPackage.hotelMadinah} onChange={(value) => updatePackage("hotelMadinah", value)} />
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <label className="block">
                        <span className={labelClass}>Jenis Paket</span>
                        <select
                          className={inputClass}
                          value={selectedPackage.packageType}
                          onChange={(event) => updatePackage("packageType", event.target.value as Package["packageType"])}
                        >
                          <option value="reguler">Umroh Reguler</option>
                          <option value="plus">Umroh Plus</option>
                          <option value="khusus">Haji Khusus</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className={labelClass}>Status Kuota</span>
                        <select
                          className={inputClass}
                          value={selectedPackage.statusType}
                          onChange={(event) => updatePackage("statusType", event.target.value as Package["statusType"])}
                        >
                          <option value="available">Jadwal Tersedia</option>
                          <option value="pending">Perlu Dikonfirmasi</option>
                          <option value="warning">Kuota Terbatas</option>
                          <option value="soldout">Kuota Penuh</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className={labelClass}>Lifecycle Status</span>
                        <select
                          className={inputClass}
                          value={selectedPackage.lifecycle || "upcoming"}
                          onChange={(event) => updatePackage("lifecycle", event.target.value as PackageLifecycle)}
                        >
                          <option value="draft">Draft</option>
                          <option value="upcoming">Akan Datang</option>
                          <option value="low_seats">Kursi Terbatas</option>
                          <option value="sold_out">Terjual Penuh</option>
                          <option value="closed">Pendaftaran Ditutup</option>
                          <option value="departed">Sudah Berangkat</option>
                          <option value="archived">Arsip</option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="flex items-center gap-2.5 rounded-button border border-warm-border px-3.5 py-2.5 text-xs font-semibold bg-warm-bg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPackage.isUmroh}
                          onChange={(event) => updatePackage("isUmroh", event.target.checked)}
                          className="rounded text-teal-primary"
                        />
                        Tampilkan di Katalog Umroh
                      </label>
                      <label className="flex items-center gap-2.5 rounded-button border border-warm-border px-3.5 py-2.5 text-xs font-semibold bg-warm-bg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPackage.isHaji}
                          onChange={(event) => updatePackage("isHaji", event.target.checked)}
                          className="rounded text-teal-primary"
                        />
                        Tampilkan di Katalog Haji
                      </label>
                    </div>

                    <div className="mt-4 pt-4 border-t border-warm-border">
                      <CmsMediaUpload
                        label="Foto Cover / Thumbnail Paket"
                        value={selectedPackage.imageUrl || ""}
                        folder={`packages/${selectedPackage.slug}`}
                        supabase={supabase}
                        onChange={(value) => updatePackage("imageUrl", value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-card border border-warm-border bg-white p-5 shadow-card">
                      <LinesEditor
                        label="Fasilitas Termasuk"
                        values={selectedPackage.facilitiesIncluded || []}
                        onChange={(values) => updatePackageArray("facilitiesIncluded", values)}
                      />
                      <div className="mt-5">
                        <LinesEditor
                          label="Fasilitas Belum Termasuk"
                          values={selectedPackage.facilitiesExcluded || []}
                          onChange={(values) => updatePackageArray("facilitiesExcluded", values)}
                        />
                      </div>
                    </div>

                    <div className="rounded-card border border-warm-border bg-white p-5 shadow-card">
                      <h3 className={labelClass}>Rincian Harga Tipe Kamar</h3>
                      <div className="mt-3 space-y-3">
                        {(selectedPackage.roomPricing || []).map((room, index) => (
                          <div className="rounded-button border border-warm-border p-3 bg-warm-bg" key={room.type}>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <Field
                                label={`Harga Kamar ${room.type}`}
                                value={room.price}
                                onChange={(value) =>
                                  updatePackage(
                                    "roomPricing",
                                    selectedPackage.roomPricing?.map((item, roomIndex) =>
                                      roomIndex === index ? { ...item, price: value } : item
                                    )
                                  )
                                }
                              />
                              <Field
                                label="Harga Numerik (IDR)"
                                type="number"
                                value={room.numeric}
                                onChange={(value) =>
                                  updatePackage(
                                    "roomPricing",
                                    selectedPackage.roomPricing?.map((item, roomIndex) =>
                                      roomIndex === index ? { ...item, numeric: Number(value) || 0 } : item
                                    )
                                  )
                                }
                              />
                            </div>
                            <div className="mt-2">
                              <Field
                                label="Keterangan Kamar"
                                value={room.description}
                                onChange={(value) =>
                                  updatePackage(
                                    "roomPricing",
                                    selectedPackage.roomPricing?.map((item, roomIndex) =>
                                      roomIndex === index ? { ...item, description: value } : item
                                    )
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPANY */}
          {tab === "company" && (
            <div className="space-y-6">
              <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                <h2 className="font-serif text-xl font-bold text-teal-primary">Identitas &amp; Kontak Perusahaan</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Nama Brand" value={companyRecord.brandName} onChange={(value) => updateCompany("brandName", value)} />
                  <Field label="Nama Legalitas PT" value={companyRecord.legalName} onChange={(value) => updateCompany("legalName", value)} />
                  <Field label="Alamat Kantor" value={companyRecord.address} onChange={(value) => updateCompany("address", value)} />
                  <Field label="Nomor WhatsApp" value={companyRecord.phone} onChange={(value) => updateCompany("phone", value)} />
                  <Field label="Email Resmi" type="email" value={companyRecord.email} onChange={(value) => updateCompany("email", value)} />
                  <Field label="Akun Instagram" value={companyRecord.instagramHandle} onChange={(value) => updateCompany("instagramHandle", value)} />
                </div>
              </div>

              <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                <h2 className="font-serif text-xl font-bold text-teal-primary">Legalitas Resmi &amp; Izin PPIU</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="SK PPIU Kemenag" value={legal.ppiu} onChange={(value) => updateCompany("legal.ppiu", value)} />
                  <Field label="SK PIHK" value={legal.pihk} onChange={(value) => updateCompany("legal.pihk", value)} />
                  <Field label="Akte Notaris" value={legal.deed} onChange={(value) => updateCompany("legal.deed", value)} />
                  <Field label="SK Kemenkumham" value={legal.kemenkumham} onChange={(value) => updateCompany("legal.kemenkumham", value)} />
                  <Field label="NIB" value={legal.nib} onChange={(value) => updateCompany("legal.nib", value)} />
                  <Field label="NPWP Badan" value={legal.npwp} onChange={(value) => updateCompany("legal.npwp", value)} />
                  <Field label="Nomor Sertifikat Akreditasi" value={certification.number} onChange={(value) => updateCompany("certification.number", value)} />
                  <Field label="Tingkat Akreditasi" value={certification.accreditation} onChange={(value) => updateCompany("certification.accreditation", value)} />
                  <Field label="Tanggal Terbit" value={certification.issuedAt} onChange={(value) => updateCompany("certification.issuedAt", value)} />
                  <Field label="Masa Berlaku" value={certification.validUntil} onChange={(value) => updateCompany("certification.validUntil", value)} />
                </div>
              </div>

              <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                <h3 className="font-serif text-lg font-bold text-teal-primary mb-3">Tim Manajemen &amp; Pimpinan</h3>
                <div className="grid gap-4 lg:grid-cols-3">
                  {company.leaders.map((leader, index) => (
                    <div className="rounded-button border border-warm-border p-4 bg-warm-bg" key={`${leader.name}-${index}`}>
                      <Field
                        label="Nama"
                        value={leader.name}
                        onChange={(value) =>
                          setData({
                            ...data,
                            company: {
                              ...data.company,
                              leaders: data.company.leaders.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: value } : item
                              ),
                            },
                          })
                        }
                      />
                      <div className="mt-3">
                        <Field
                          label="Jabatan / Peran"
                          value={leader.role}
                          onChange={(value) =>
                            setData({
                              ...data,
                              company: {
                                ...data.company,
                                leaders: data.company.leaders.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, role: value } : item
                                ),
                              },
                            })
                          }
                        />
                      </div>
                      <label className="mt-3 block">
                        <span className={labelClass}>Biografi Singkat</span>
                        <textarea
                          className={`${inputClass} min-h-24`}
                          value={leader.description}
                          onChange={(event) =>
                            setData({
                              ...data,
                              company: {
                                ...data.company,
                                leaders: data.company.leaders.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, description: event.target.value } : item
                                ),
                              },
                            })
                          }
                        />
                      </label>
                      <div className="mt-3">
                        <CmsMediaUpload
                          label="Foto Profil Pimpinan"
                          value={leader.imageUrl || ""}
                          folder={`leaders/${index + 1}`}
                          supabase={supabase}
                          onChange={(value) =>
                            setData({
                              ...data,
                              company: {
                                ...data.company,
                                leaders: data.company.leaders.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, imageUrl: value } : item
                                ),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCING */}
          {tab === "financing" && (
            <div className="space-y-6">
              <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                <h2 className="font-serif text-xl font-bold text-teal-primary">Ketentuan Pembiayaan &amp; DP</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="DP Umroh" value={financing.umrahDp} onChange={(value) => updateCompany("financing.umrahDp", value)} />
                  <Field label="DP Haji" value={financing.hajjDp} onChange={(value) => updateCompany("financing.hajjDp", value)} />
                </div>
                <label className="mt-4 block">
                  <span className={labelClass}>Catatan Ketentuan Pembayaran</span>
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={financing.note}
                    onChange={(event) => updateCompany("financing.note", event.target.value)}
                  />
                </label>
                <div className="mt-5">
                  <LinesEditor
                    label="Metode Pembayaran Resmi"
                    values={financing.options}
                    onChange={(values) => updateCompany("financing.options", values)}
                  />
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-card border border-warm-border bg-white p-5 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-teal-primary">Simulasi Tabungan Umroh</h3>
                  <div className="mt-4 space-y-3">
                    {financing.umrahSavings.map((row, index) => (
                      <div className="grid gap-2 rounded-button border border-warm-border p-3 sm:grid-cols-3 bg-warm-bg" key={`${row.term}-${index}`}>
                        <Field
                          label="Jangka Waktu"
                          value={row.term}
                          onChange={(value) =>
                            updateCompany(
                              "financing.umrahSavings",
                              financing.umrahSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, term: value } : item
                              )
                            )
                          }
                        />
                        <Field
                          label="Angsuran Bulanan"
                          value={row.monthly}
                          onChange={(value) =>
                            updateCompany(
                              "financing.umrahSavings",
                              financing.umrahSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, monthly: value } : item
                              )
                            )
                          }
                        />
                        <Field
                          label="Setara Harian"
                          value={row.daily}
                          onChange={(value) =>
                            updateCompany(
                              "financing.umrahSavings",
                              financing.umrahSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, daily: value } : item
                              )
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-card border border-warm-border bg-white p-5 shadow-card">
                  <h3 className="font-serif text-lg font-bold text-teal-primary">Simulasi Tabungan Haji</h3>
                  <div className="mt-4 space-y-3">
                    {financing.hajjSavings.map((row, index) => (
                      <div className="grid gap-2 rounded-button border border-warm-border p-3 sm:grid-cols-2 bg-warm-bg" key={`${row.name}-${index}`}>
                        <Field
                          label="Nama Program"
                          value={row.name}
                          onChange={(value) =>
                            updateCompany(
                              "financing.hajjSavings",
                              financing.hajjSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: value } : item
                              )
                            )
                          }
                        />
                        <Field
                          label="Deposit Awal"
                          value={row.deposit}
                          onChange={(value) =>
                            updateCompany(
                              "financing.hajjSavings",
                              financing.hajjSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, deposit: value } : item
                              )
                            )
                          }
                        />
                        <Field
                          label="Bulanan"
                          value={row.monthly}
                          onChange={(value) =>
                            updateCompany(
                              "financing.hajjSavings",
                              financing.hajjSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, monthly: value } : item
                              )
                            )
                          }
                        />
                        <Field
                          label="Tenor"
                          value={row.term}
                          onChange={(value) =>
                            updateCompany(
                              "financing.hajjSavings",
                              financing.hajjSavings.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, term: value } : item
                              )
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS */}
          {tab === "payments" && (
            <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
              <h2 className="font-serif text-xl font-bold text-teal-primary">Rekening Bank Resmi Perusahaan</h2>
              <p className="mt-1 text-xs text-slate-muted">
                Rekening ini ditampilkan di footer dan halaman legalitas sebagai rujukan resmi jamaah.
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {company.bankAccounts.map((account, index) => (
                  <div className="rounded-button border border-warm-border p-4 bg-warm-bg" key={`${account.bank}-${index}`}>
                    <Field
                      label="Nama Bank"
                      value={account.bank}
                      onChange={(value) =>
                        setData({
                          ...data,
                          company: {
                            ...data.company,
                            bankAccounts: data.company.bankAccounts.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, bank: value } : item
                            ),
                          },
                        })
                      }
                    />
                    <div className="mt-3">
                      <Field
                        label="Nomor Rekening"
                        value={account.account}
                        onChange={(value) =>
                          setData({
                            ...data,
                            company: {
                              ...data.company,
                              bankAccounts: data.company.bankAccounts.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, account: value } : item
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRANSFER & BACKUP */}
          {tab === "transfer" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-card border border-warm-border bg-white p-5 shadow-card sm:p-6">
                <h2 className="font-serif text-xl font-bold text-teal-primary">Backup &amp; Restore JSON</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-muted">
                  Unduh seluruh database CMS dalam bentuk berkas JSON untuk backup atau transfer ke server lain.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={exportData}
                    className="rounded-button bg-teal-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-900 shadow-card"
                  >
                    Unduh Backup JSON
                  </button>
                  <label className="cursor-pointer rounded-button border border-warm-border bg-white px-4 py-2.5 text-xs font-bold text-teal-primary hover:border-teal-primary/40 hover:bg-warm-muted transition-colors">
                    Unggah Restore JSON
                    <input
                      className="sr-only"
                      type="file"
                      accept="application/json"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) importData(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-card border border-amber-200 bg-amber-50 p-5 shadow-card sm:p-6">
                <h2 className="font-serif text-xl font-bold text-amber-900">Status Server &amp; Database</h2>
                <p className="mt-2 text-xs leading-relaxed text-amber-900/80">
                  {isSupabaseConfigured
                    ? "Supabase aktif: Perubahan data tersimpan secara terpusat di cloud database PostgreSQL Supabase."
                    : "Supabase belum dikonfigurasi: CMS dikunci agar tidak menyimpan data tanpa database terpusat."}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
