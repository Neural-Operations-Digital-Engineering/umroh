import Link from "next/link";
import type { CompanyProfile } from "@/data/company";
import InquiryDialog from "@/components/InquiryDialog";

export function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Pilih Jadwal & Paket", desc: "Tentukan bulan keberangkatan, tipe kamar, serta durasi perjalanan yang sesuai kebutuhan keluarga." },
    { num: "02", title: "Konsultasi & Verifikasi", desc: "Hubungi konsultan kami untuk memastikan ketersediaan seat tiket dan kelengkapan berkas paspor." },
    { num: "03", title: "Akad & Bimbingan Manasik", desc: "Tanda tangani akad resmi, transfer pembayaran ke rekening perusahaan, dan ikuti bimbingan manasik intensif." },
    { num: "04", title: "Berangkat dengan Tenang", desc: "Pelepasan resmi di bandara, pendampingan muthowwif di tanah suci, dan kepulangan selamat berkah." },
  ];

  return (
    <section className="deferred-section border-t border-warm-border bg-[#fffdf8] py-12 font-sans sm:py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">
              Alur Perjalanan
            </span>
            <h2 className="editorial-title !text-2xl sm:!text-4xl">
              Langkah Menuju Baitullah Bersama Kami
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-muted sm:text-sm">
              Prosedur yang jelas, aman, dan transparan dari pendaftaran awal hingga kepulangan ke tanah air.
            </p>
          </div>
          <Link
            href="/faq"
            className="shrink-0 text-xs font-bold text-teal-primary transition-colors hover:text-gold-hover sm:text-sm"
          >
            Pelajari Detail Syarat &amp; Dokumen →
          </Link>
        </div>

        {/* ── Mobile Vertical Timeline (block sm:hidden) ── */}
        <div className="sm:hidden relative pl-6 border-l-2 border-teal-primary/30 space-y-6 ml-2">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`relative rounded-card p-4 border transition-colors ${
                idx === 2
                  ? "bg-teal-primary/5 border-teal-primary/40 ring-1 ring-teal-primary/20"
                  : "bg-warm-surface border-warm-border"
              }`}
            >
              <span className="absolute -left-[35px] top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-teal-primary font-mono text-xs font-bold text-white shadow-xs">
                {step.num}
              </span>
              <h3 className="font-serif text-base font-bold text-teal-primary">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-body">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Desktop & Tablet Grid (hidden sm:grid) ── */}
        <div className="hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`relative overflow-hidden rounded-card p-6 border transition-all flex flex-col justify-between ${
                idx === 2
                  ? "bg-teal-primary/5 border-teal-primary/40 ring-1 ring-teal-primary/20 shadow-card"
                  : "bg-warm-surface border-warm-border shadow-xs hover:border-teal-primary/30 hover:shadow-card"
              }`}
            >
              <span
                className="select-none pointer-events-none absolute right-4 top-2 font-mono text-6xl font-bold text-teal-primary/10 leading-none"
                aria-hidden="true"
              >
                {step.num}
              </span>
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center justify-center rounded-full bg-gold-light px-2.5 py-0.5 font-mono text-[11px] font-bold text-teal-primary border border-gold-border">
                  Langkah {step.num}
                </span>
                <h3 className="font-serif text-base lg:text-lg font-bold text-teal-primary pt-1">{step.title}</h3>
                <p className="text-xs leading-relaxed text-slate-body">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LegalityTeaser({ company }: { company: CompanyProfile }) {
  const items = [
    {
      label: "SK PPIU Kemenag RI",
      val: company.legal.ppiu,
      sub: "Izin Resmi Penyelenggara Umroh",
      icon: (
        <svg className="w-6 h-6 text-teal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "SK PIHK Kemenag RI",
      val: company.legal.pihk,
      sub: "Izin Penyelenggara Haji Khusus",
      icon: (
        <svg className="w-6 h-6 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: "Akreditasi KAN",
      val: `Nomor ${company.certification.number}`,
      sub: `Peringkat Akreditasi ${company.certification.accreditation}`,
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="deferred-section border-t border-warm-border bg-warm-bg py-12 font-sans sm:py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">
              Kepastian Hukum
            </span>
            <h2 className="font-serif text-2xl font-bold text-teal-primary sm:text-4xl">
              Izin Resmi &amp; Akreditasi Pemerintah
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-muted sm:text-sm">
              Data legalitas utama kami terbuka untuk publik guna menjamin kenyamanan dan ketenangan ibadah Anda.
            </p>
          </div>
          <Link
            href="/legalitas"
            className="shrink-0 text-xs font-bold text-teal-primary transition-colors hover:text-gold-hover sm:text-sm"
          >
            Lihat Rincian Legalitas Lengkap →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="space-y-3 rounded-card border border-warm-border bg-warm-surface p-5 shadow-card hover:border-teal-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted">
                  {item.label}
                </span>
                <div className="w-9 h-9 rounded-full bg-warm-bg flex items-center justify-center shrink-0 border border-warm-border">
                  {item.icon}
                </div>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-teal-primary">{item.val}</p>
                <p className="text-xs text-slate-body mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HajiOverviewSection({ company }: { company: CompanyProfile }) {
  return (
    <section className="border-b border-warm-border bg-[#ebe6dc] font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.56fr)] lg:gap-12">
          <div className="min-w-0 space-y-3">
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">
              Program Haji Khusus Berizin Kemenag
            </span>
            <h1 className="editorial-title max-w-4xl !text-3xl sm:!text-5xl">
              Program Haji Khusus &amp; Kuota Resmi
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-body sm:text-base">
              Ibadah haji adalah rukun Islam kelima yang membutuhkan kepastian legalitas dan bimbingan terpercaya. Risalah Madina Tour mengelola program Haji Khusus dengan nomor porsi resmi Kementerian Agama RI dan pendampingan intensif.
            </p>
          </div>

          <div className="content-panel w-full min-w-0 space-y-4 p-5 sm:p-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
              Ringkasan Data Haji
            </span>
            <div className="grid gap-3 text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">Izin PIHK:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">{company.legal.pihk}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">DP Porsi:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">{company.financing.hajjDp}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-start gap-3 text-slate-body">
                <span className="text-slate-muted">Masa Tunggu Acuan:</span>
                <span className="min-w-0 break-words text-right font-bold text-teal-primary">{company.financing.hajjWaitingYears}</span>
              </div>
            </div>
            <InquiryDialog
              href={`https://wa.me/${company.phone.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin berkonsultasi mengenai program Haji Khusus.")}`}
              phone={company.phone}
              source="service"
              sourceLabel="Konsultasi program Haji Khusus"
              label="Konsultasi Porsi Haji Khusus"
              className="inline-flex min-h-11 w-full items-center justify-center whitespace-normal rounded-button bg-teal-primary px-3 text-center text-xs font-bold leading-4 text-white transition-colors hover:bg-teal-900"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
