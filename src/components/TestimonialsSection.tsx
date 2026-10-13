import Image from "next/image";
import Link from "next/link";

export default function TestimonialsSection({ company }: { company: import("@/data/company").CompanyProfile }) {
  return (
    <section id="dokumentasi" className="deferred-section scroll-mt-24 border-t border-warm-border bg-warm-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Dokumentasi perjalanan</p>
          <h2 className="font-sans text-2xl font-bold leading-tight text-teal-primary sm:text-3xl">
            Melihat siapa yang mendampingi Anda
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-body sm:text-base">
            Perjalanan ibadah terasa lebih tenang ketika orang, tempat, dan prosesnya terlihat jelas.
          </p>
          <Link href="/dokumentasi" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-teal-primary hover:text-gold-hover">
            Buka dokumentasi perjalanan
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <figure className="group relative min-h-[23rem] overflow-hidden rounded-card bg-teal-primary">
            <Image src={company.media?.aboutUrl && company.media.aboutUrl !== "/images/travel-team.jpg" ? company.media.aboutUrl : "/images/kaaba-courtyard.png"} alt="Pelataran Ka'bah di Masjidil Haram" fill sizes="(max-width: 1024px) 100vw, 65vw" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 max-w-xl p-5 text-white sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Dokumentasi perjalanan</p>
              <p className="mt-2 font-sans text-xl font-bold leading-tight sm:text-2xl">Perjalanan ibadah yang dipersiapkan dengan tertib dan didampingi dengan nyata.</p>
            </figcaption>
          </figure>

          <figure className="group relative min-h-[23rem] overflow-hidden rounded-card bg-teal-primary">
            <Image src={company.media?.documentationUrls?.[1] || "/images/destinations/mekkah.jpg"} alt="Suasana Makkah" fill sizes="(max-width: 1024px) 100vw, 35vw" loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 p-5 text-white sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Di Tanah Suci</p>
              <p className="mt-2 font-sans text-lg font-bold leading-tight">Dokumentasi jemaah dan perjalanan diperbarui berdasarkan keberangkatan terbaru.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
