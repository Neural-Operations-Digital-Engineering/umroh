import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/cms/store";
import { getPackageWhatsAppUrl } from "@/lib/contact";
import { getAbsoluteUrl } from "@/lib/site-url";
import { getBreadcrumbSchema, getProductSchema } from "@/lib/structured-data";
import SharePackageButton from "@/components/SharePackageButton";
import InquiryDialog from "@/components/InquiryDialog";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { packages } = await getSiteData();
  return packages
    .filter((item) => item.isHaji && item.lifecycle !== "draft" && item.lifecycle !== "archived")
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { company, packages } = await getSiteData();
  const pkg = packages.find((item) => item.slug.toLowerCase() === slug.toLowerCase() && item.isHaji);
  if (!pkg) {
    return {
      title: `Paket Haji Tidak Ditemukan | ${company.brandName}`,
    };
  }
  const canonicalUrl = getAbsoluteUrl(`/haji/${pkg.slug}`);
  return {
    title: `${pkg.name} | Haji Khusus Resmi Kemenag | ${company.brandName}`,
    description: `Detail program Haji Khusus ${pkg.name}, estimasi keberangkatan ${pkg.departureDate} (${pkg.duration}), fasilitas maktab, hotel, dan konsultasi nomor porsi resmi Kemenag.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      url: canonicalUrl,
      title: `${pkg.name} | Haji Khusus Resmi Kemenag | ${company.brandName}`,
      description: `Detail program Haji Khusus ${pkg.name}, estimasi keberangkatan ${pkg.departureDate} (${pkg.duration}), fasilitas maktab, hotel, dan konsultasi nomor porsi resmi Kemenag.`,
      images: [{ url: pkg.imageUrl || company.media?.heroUrl || "/images/kaaba-courtyard.png", alt: pkg.name }],
    },
  };
}

export default async function HajiDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { company, packages } = await getSiteData();
  const pkg = packages.find((item) => item.slug.toLowerCase() === slug.toLowerCase() && item.isHaji);
  if (!pkg) notFound();

  const included = pkg.facilitiesIncluded || [];
  const excluded = pkg.facilitiesExcluded || [];
  const itinerary = pkg.itinerary || [];
  const roomPrices = pkg.roomPricing || [];
  const whatsappUrl = getPackageWhatsAppUrl(company.phone, pkg);
  const productSchema = getProductSchema(pkg, company);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Haji Khusus", url: "/haji" },
    { name: pkg.name, url: `/haji/${pkg.slug}` },
  ]);

  return (
    <main className="bg-warm-bg min-h-screen py-6 sm:py-10 pb-28 lg:pb-16 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs font-sans text-slate-caption flex items-center gap-2">
          <Link href="/" className="hover:text-teal-primary transition-colors">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/haji" className="hover:text-teal-primary transition-colors">
            Haji Khusus
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-teal-primary font-semibold truncate max-w-[200px] sm:max-w-md">
            {pkg.name}
          </span>
        </nav>

        {/* 2-Column Split: 8 cols main content + 4 cols sticky sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 COLS): Title, Specs, Hotel, Rooms, Included/Excluded, Itinerary, Process */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider rounded-badge shadow-xs ${pkg.categoryColor || "bg-teal-primary"}`}>
                  {pkg.category}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-badge text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  Perlu Konfirmasi Kuota SISKOPATUH
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-badge text-[11px] sm:text-xs font-semibold bg-teal-primary/8 text-teal-primary border border-teal-primary/15 font-sans">
                  Izin PIHK Resmi Kemenag
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-teal-primary leading-tight">
                {pkg.name}
              </h1>

              <p className="font-sans text-sm sm:text-base text-slate-body leading-relaxed">
                Program ibadah Haji Khusus berizin resmi PIHK dengan durasi {pkg.duration} dari {pkg.departureCity}. Bimbingan ibadah terstruktur sesuai Sunnah, fasilitas tenda AC Masyair VIP, serta pendampingan dokter dan muthowwif berpengalaman.
              </p>
            </div>

            {/* Hero Image if available */}
            {pkg.imageUrl && (
              <div className="relative rounded-card overflow-hidden border border-warm-border bg-warm-surface shadow-card">
                <div className="aspect-16/9 w-full bg-teal-900 relative">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Program Specifications Grid */}
            <section aria-labelledby="haji-specs" className="rounded-card border border-warm-border bg-warm-surface p-5 sm:p-7 shadow-card space-y-4">
              <h2 id="haji-specs" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-caption font-sans">
                Ringkasan Program & Spesifikasi
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-1">
                <div className="border-l-2 border-teal-primary/30 pl-3">
                  <dt className="text-xs text-slate-muted font-sans">Keberangkatan</dt>
                  <dd className="mt-1 text-sm font-bold text-teal-primary font-sans">{pkg.departureDate}</dd>
                </div>
                <div className="border-l-2 border-teal-primary/30 pl-3">
                  <dt className="text-xs text-slate-muted font-sans">Durasi Ibadah</dt>
                  <dd className="mt-1 text-sm font-bold text-teal-primary font-sans">{pkg.duration}</dd>
                </div>
                <div className="border-l-2 border-teal-primary/30 pl-3">
                  <dt className="text-xs text-slate-muted font-sans">Maskapai Penerbangan</dt>
                  <dd className="mt-1 text-sm font-bold text-teal-primary font-sans">{pkg.airline}</dd>
                </div>
                <div className="border-l-2 border-teal-primary/30 pl-3">
                  <dt className="text-xs text-slate-muted font-sans">Kota Embarkasi</dt>
                  <dd className="mt-1 text-sm font-bold text-teal-primary font-sans">{pkg.departureCity}</dd>
                </div>
              </dl>
            </section>

            {/* Hotel & Akomodasi Makkah & Madinah */}
            <section aria-labelledby="haji-hotel" className="rounded-card border border-warm-border bg-warm-surface p-6 shadow-card space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans mb-1">Akomodasi Hotel</p>
                <h2 id="haji-hotel" className="font-serif text-xl sm:text-2xl font-bold text-teal-primary">
                  Hotel Makkah & Madinah
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-button bg-warm-bg border border-warm-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-hover font-sans block">
                    Hotel Makkah Al Mukarramah
                  </span>
                  <h3 className="font-serif font-bold text-teal-primary text-base">
                    {pkg.hotelMakkah}
                  </h3>
                  <p className="text-xs text-slate-body leading-relaxed">
                    {pkg.hotelMakkahDetail || "Hotel bintang 5 di pelataran Masjidil Haram atau setara, dengan akses sholat mudah dan catering fullboard."}
                  </p>
                </div>

                <div className="p-4 rounded-button bg-warm-bg border border-warm-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-hover font-sans block">
                    Hotel Madinah Al Munawwarah
                  </span>
                  <h3 className="font-serif font-bold text-teal-primary text-base">
                    {pkg.hotelMadinah}
                  </h3>
                  <p className="text-xs text-slate-body leading-relaxed">
                    {pkg.hotelMadinahDetail || "Hotel bintang 5 di ring 1 Masjid Nabawi, memudahkan rawatib dan ziarah Raudhah Asy-Syarifah."}
                  </p>
                </div>
              </div>
            </section>

            {/* Room Options & Pricing */}
            {roomPrices.length > 0 && (
              <section aria-labelledby="haji-pricing" className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover font-sans mb-1">Pilihan Tipe Kamar</p>
                  <h2 id="haji-pricing" className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                    Rincian Biaya per Tipe Kamar
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-slate-muted mt-1 leading-relaxed">
                    Harga per orang dalam Rupiah atau USD sesuai kurs acuan Kemenag dan asosiasi resmi.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {roomPrices.map((room) => (
                    <article
                      key={room.type}
                      className={`rounded-card border p-5 bg-warm-surface shadow-card transition-colors flex flex-col justify-between ${
                        room.isPopular ? "border-gold-accent ring-1 ring-gold-accent/40" : "border-warm-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-serif font-bold text-teal-primary text-lg">
                            {room.label}
                          </h3>
                          {room.isPopular && (
                            <span className="rounded-badge bg-gold-light px-2 py-0.5 text-[10px] font-bold text-teal-primary border border-gold-border">
                              Paling Diminati
                            </span>
                          )}
                        </div>

                        <span className="inline-block text-xs font-semibold text-slate-muted mb-3 font-sans">
                          Kapasitas: {room.capacity}
                        </span>

                        <p className="font-serif text-2xl font-bold text-teal-primary">
                          {room.price}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-warm-border/60">
                        <p className="text-xs leading-relaxed text-slate-body font-sans">
                          {room.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Facilities: Included & Excluded */}
            <section aria-labelledby="facilities-heading" className="grid gap-6 sm:grid-cols-2">
              <h2 id="facilities-heading" className="sr-only">Fasilitas dan Ketentuan Biaya</h2>
              
              {/* Termasuk */}
              <div className="bg-warm-surface rounded-card border border-warm-border p-6 shadow-card space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    Fasilitas Utama
                  </span>
                  <h3 className="font-serif text-xl font-bold text-teal-primary">
                    Biaya Sudah Termasuk
                  </h3>
                </div>

                <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-body border-t border-warm-border pt-4">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Belum Termasuk */}
              <div className="bg-warm-surface rounded-card border border-warm-border p-6 shadow-card space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-status-soldout block mb-1">
                    Biaya Tambahan
                  </span>
                  <h3 className="font-serif text-xl font-bold text-teal-primary">
                    Biaya Belum Termasuk
                  </h3>
                </div>

                <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-slate-body border-t border-warm-border pt-4">
                  {excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-status-soldout flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✕
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3 bg-warm-muted rounded-button border border-warm-border text-xs text-slate-muted">
                  Konfirmasi rincian komponen dam, kurban, dan kelebihan bagasi sebelum keberangkatan.
                </div>
              </div>
            </section>

            {/* Daily Itinerary */}
            {itinerary.length > 0 && (
              <section aria-labelledby="haji-itinerary" className="bg-warm-surface rounded-card border border-warm-border p-6 sm:p-8 shadow-card space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover mb-1 font-sans">Rencana Perjalanan</p>
                  <h2 id="haji-itinerary" className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
                    Itinerary Perjalanan Haji {pkg.duration}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-slate-muted mt-1 leading-relaxed">
                    Alur bimbingan manasik, tarwiyah/wukuf Masyair, thawaf ifadhah, hingga tahallul terbimbing secara tartil.
                  </p>
                </div>

                <div className="space-y-4 border-l-2 border-teal-primary/20 ml-3 sm:ml-4 pl-4 sm:pl-6">
                  {itinerary.map((item) => (
                    <div key={item.day} className="relative group">
                      <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-teal-primary border-2 border-white shadow-xs" />

                      <div className="p-4 rounded-card border border-warm-border bg-warm-bg">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-sans font-bold text-sm sm:text-base text-teal-primary">
                            Hari {item.day}: {item.title}
                          </h3>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-badge bg-gold-light text-teal-primary border border-gold-border">
                            {item.location}
                          </span>
                        </div>
                        <p className="font-sans text-xs sm:text-sm text-slate-body leading-relaxed">
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-caption font-sans italic pt-2">
                  *Rangkaian manasik dan pergerakan masyair disesuaikan dengan maktab resmi serta jadwal pergerakan Naqabah Arab Saudi demi keselamatan seluruh jemaah.
                </p>
              </section>
            )}

            {/* Haji Process Steps */}
            <section aria-labelledby="haji-process" className="rounded-card bg-teal-primary p-6 text-white shadow-elevated sm:p-8">
              <h2 id="haji-process" className="font-serif text-2xl sm:text-3xl font-bold">
                Alur Pendaftaran Haji Khusus
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-white/75">
                Prosedur legal dan transparan untuk kepastian porsi dan keberangkatan Anda.
              </p>
              
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div className="space-y-2 border-t border-white/20 pt-4">
                  <span className="font-mono text-xs font-bold text-gold-accent">Langkah 01</span>
                  <h3 className="font-serif font-bold text-base">Konsultasi Kuota & Dokumen</h3>
                  <p className="text-xs leading-5 text-white/75 font-sans">
                    Pemeriksaan masa tunggu nomor porsi SISKOPATUH dan verifikasi kelengkapan paspor serta identitas.
                  </p>
                </div>
                
                <div className="space-y-2 border-t border-white/20 pt-4">
                  <span className="font-mono text-xs font-bold text-gold-accent">Langkah 02</span>
                  <h3 className="font-serif font-bold text-base">Akad & Pembayaran Resmi</h3>
                  <p className="text-xs leading-5 text-white/75 font-sans">
                    Penandatanganan akad resmi BPIH Khusus dan transfer pembayaran hanya ke rekening resmi perusahaan.
                  </p>
                </div>
                
                <div className="space-y-2 border-t border-white/20 pt-4">
                  <span className="font-mono text-xs font-bold text-gold-accent">Langkah 03</span>
                  <h3 className="font-serif font-bold text-base">Manasik & Keberangkatan</h3>
                  <p className="text-xs leading-5 text-white/75 font-sans">
                    Pembekalan manasik intensif tatap muka, pemeriksaan kesehatan, pembagian perlengkapan, dan pelepasan resmi.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN (4 COLS): Sticky Booking & Consultation Widget (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
            
            {/* Primary Sticky Booking Card */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-6 shadow-elevated space-y-5">
              
              <div>
                <span className="text-xs uppercase font-bold text-slate-caption block font-sans">
                  Mulai Dari / Orang
                </span>
                <span className="font-serif text-3xl font-bold text-teal-primary block mt-1">
                  {pkg.discountedPrice}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Konfirmasi Kuota PIHK Kemenag
                </span>
              </div>

              {/* Quick Specs Micro-List */}
              <div className="border-y border-warm-border py-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Tahun / Musim:</span>
                  <span className="font-bold text-teal-primary">{pkg.departureDate}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Durasi Program:</span>
                  <span className="font-bold text-teal-primary">{pkg.duration}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Penerbangan:</span>
                  <span className="font-bold text-teal-primary truncate max-w-[170px]" title={pkg.airline}>{pkg.airline}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Hotel Makkah:</span>
                  <span className="font-medium text-slate-dark truncate max-w-[170px]" title={pkg.hotelMakkah}>{pkg.hotelMakkah}</span>
                </div>
                <div className="flex justify-between items-center text-slate-body">
                  <span className="text-slate-muted">Hotel Madinah:</span>
                  <span className="font-medium text-slate-dark truncate max-w-[170px]" title={pkg.hotelMadinah}>{pkg.hotelMadinah}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-12 px-5 py-3 rounded-button bg-gold-accent hover:bg-gold-hover text-slate-dark font-sans font-bold text-sm shadow-card flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Konsultasi Haji Khusus</span>
                </a>

                <InquiryDialog
                  href={whatsappUrl}
                  packageId={pkg.id}
                  packageName={pkg.name}
                  label="Tanyakan Ketersediaan Porsi"
                  className="w-full min-h-11 px-4 py-2.5 rounded-button border border-teal-primary text-teal-primary hover:bg-teal-primary hover:text-white font-sans font-bold text-xs flex items-center justify-center transition-all"
                />

                <div className="pt-2 flex justify-center">
                  <SharePackageButton title={pkg.name} />
                </div>
              </div>

              {/* Anti-Fraud Notice */}
              <div className="p-3 bg-warm-muted rounded-button border border-warm-border text-[11px] text-slate-muted leading-relaxed">
                Pembayaran pendaftaran resmi hanya ditransfer ke rekening an. <strong className="text-teal-primary">{company.legalName}</strong>.
              </div>

            </div>

            {/* Assistance Card */}
            <div className="rounded-card border border-warm-border bg-warm-surface p-5 shadow-card text-center space-y-2">
              <p className="font-serif font-bold text-base text-teal-primary">
                Konsultasi Tatap Muka
              </p>
              <p className="text-xs text-slate-muted leading-relaxed">
                Kunjungi kantor kami untuk konsultasi langsung bersama konsultan haji dan tinjau berkas perizinan Kemenag.
              </p>
              <a
                href={`tel:${company.phone.replace(/\D/g, "")}`}
                className="inline-block pt-1 text-xs font-bold text-teal-primary hover:underline"
              >
                Telepon: {company.phone}
              </a>
            </div>

          </aside>

        </div>

      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-warm-surface border-t border-warm-border p-3.5 px-4 shadow-elevated flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-caption block uppercase font-bold font-sans">
            Mulai Dari / Orang
          </span>
          <span className="font-sans font-bold text-base text-teal-primary block truncate">
            {pkg.discountedPrice}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-sticky-cta"
          className="min-h-11 px-5 py-2.5 rounded-button bg-teal-primary text-white font-sans text-xs font-bold shadow-card flex items-center gap-2 shrink-0 active:scale-[0.98]"
        >
          <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>WhatsApp Konsultasi</span>
        </a>
      </div>

    </main>
  );
}
