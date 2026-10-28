import Image from "next/image";
import Link from "next/link";

export default function TestimonialsSection({ company }: { company: import("@/data/company").CompanyProfile }) {
  const photo1 = company.media?.aboutUrl && company.media.aboutUrl !== "/images/travel-team.jpg"
    ? company.media.aboutUrl
    : "/images/kaaba-courtyard.png";
  const photo2 = company.media?.documentationUrls?.[1] || "/images/destinations/mekkah.jpg";
  const photo3 = company.media?.documentationUrls?.[2] || "/images/destinations/madinah.jpg";

  return (
    <section id="dokumentasi" className="deferred-section scroll-mt-24 border-t border-warm-border bg-warm-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Dokumentasi perjalanan</p>
            <h2 className="font-sans text-2xl font-bold leading-tight text-teal-primary sm:text-3xl">
              Melihat siapa yang mendampingi Anda
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-body sm:text-base">
              Perjalanan ibadah terasa lebih tenang ketika orang, tempat, dan prosesnya terlihat jelas.
            </p>
          </div>
          <Link
            href="/dokumentasi"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-teal-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-teal-primary hover:bg-teal-primary hover:text-white transition-all shrink-0"
          >
            <span>Buka Galeri Dokumentasi</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {/* Foto Utama Besar */}
          <figure className="group relative min-h-[22rem] sm:min-h-[26rem] overflow-hidden rounded-card bg-teal-primary sm:col-span-2 lg:col-span-7">
            <Image
              src={photo1}
              alt="Pelataran Ka'bah di Masjidil Haram"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 max-w-xl p-5 text-white sm:p-7">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-accent">Dokumentasi Ibadah</span>
              <p className="mt-2 font-sans text-xl font-bold leading-tight sm:text-2xl">
                Perjalanan ibadah yang dipersiapkan dengan tertib dan didampingi dengan tulus.
              </p>
              <p className="mt-1.5 text-xs text-white/80 leading-relaxed hidden sm:block">
                Pelataran Masjidil Haram dan agenda manasik jamaah dipandu pembimbing muthowwif bersertifikat resmi.
              </p>
            </figcaption>
          </figure>

          {/* Kolom 2 Foto Tambahan */}
          <div className="sm:col-span-2 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <figure className="group relative min-h-[14rem] sm:min-h-[12.5rem] overflow-hidden rounded-card bg-teal-primary">
              <Image
                src={photo2}
                alt="Suasana Ibadah Makkah"
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-4 sm:p-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-accent">Akomodasi Nyaman</span>
                <p className="mt-1 font-sans text-sm sm:text-base font-bold leading-snug">
                  Hotel terkonfirmasi dekat pelataran masjid utama.
                </p>
              </figcaption>
            </figure>

            <figure className="group relative min-h-[14rem] sm:min-h-[12.5rem] overflow-hidden rounded-card bg-teal-primary">
              <Image
                src={photo3}
                alt="Ziarah Madinah Al Munawwarah"
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-4 sm:p-5 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-accent">Bimbingan Lapangan</span>
                <p className="mt-1 font-sans text-sm sm:text-base font-bold leading-snug">
                  Pendampingan muthowwif kompeten dari ketibaan hingga kepulangan.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
