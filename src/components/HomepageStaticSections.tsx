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
            Pelajari Detail Syarat &amp; Dokumen
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="content-panel space-y-2 p-5 transition-colors hover:border-teal-primary/30"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-light font-mono text-xs font-bold text-gold-hover">
                {step.num}
              </span>
              <h3 className="pt-1 font-serif text-base font-bold text-teal-primary">{step.title}</h3>
              <p className="text-xs leading-relaxed text-slate-body">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LegalityTeaser({ company }: { company: CompanyProfile }) {
  const items = [
    { label: "SK PPIU Kemenag RI", val: company.legal.ppiu, sub: "Izin Resmi Penyelenggara Umroh" },
    { label: "SK PIHK Kemenag RI", val: company.legal.pihk, sub: "Izin Penyelenggara Haji Khusus" },
    { label: "Akreditasi KAN", val: `Nomor ${company.certification.number}`, sub: `Peringkat Akreditasi ${company.certification.accreditation}` },
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
            Lihat Rincian Legalitas Lengkap
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="space-y-1.5 rounded-card border border-warm-border bg-warm-surface p-5 shadow-card"
            >
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-muted">
                {item.label}
              </span>
              <p className="font-mono text-sm font-bold text-teal-primary">{item.val}</p>
              <p className="text-xs text-slate-body">{item.sub}</p>
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
