"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { buildInquiryMessage, getWhatsAppUrl, type InquiryContext } from "@/lib/inquiry";

interface InquiryDialogProps {
  href?: string;
  phone?: string;
  packageId?: string;
  packageName?: string;
  packageCategory?: string;
  packagePrice?: string;
  packageHref?: string;
  source?: InquiryContext["source"];
  sourceLabel?: string;
  label: string;
  className: string;
  id?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

interface StoredInquiry {
  whatsappUrl: string;
}

function phoneFromHref(href: string | undefined) {
  if (!href) return "";
  try {
    const url = new URL(href);
    return url.pathname.replace(/^\//, "");
  } catch {
    return "";
  }
}

export default function InquiryDialog({
  href,
  phone,
  packageId,
  packageName,
  packageCategory,
  packagePrice,
  packageHref,
  source,
  sourceLabel,
  label,
  className,
  id,
  children,
  ariaLabel,
}: InquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stored, setStored] = useState<StoredInquiry | null>(null);
  const dialogId = useId().replace(/:/g, "");
  const hasPackage = Boolean(packageId || packageName);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [busy, open]);

  function close() {
    if (busy) return;
    setOpen(false);
    setStored(null);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = { name: name.trim(), phone: contactPhone.trim(), message: message.trim() };
    const pagePath = window.location.pathname;
    const context: InquiryContext = {
      source: source || (hasPackage ? "package" : "general"),
      label: sourceLabel || (hasPackage ? "Konsultasi paket" : "Konsultasi umum"),
      pagePath,
      ...(hasPackage
        ? { package: { id: packageId || "", name: packageName || "Paket tidak disebutkan", category: packageCategory, price: packagePrice, href: packageHref } }
        : {}),
    };
    const destinationPhone = phone || phoneFromHref(href);
    const whatsappUrl = getWhatsAppUrl(destinationPhone, buildInquiryMessage({ form, context }));

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          website: new FormData(event.currentTarget).get("website"),
          contactName: form.name,
          contactPhone: form.phone,
          message: form.message,
          packageId: context.package?.id || null,
          packageName: context.package?.name || null,
          context,
          sourcePath: pagePath,
          referrer: document.referrer,
        }),
      });
      const result = (await response.json()) as { stored?: boolean; error?: string; reason?: string };
      if (!response.ok || !result.stored) throw new Error(result.error || result.reason || "Formulir belum dapat disimpan. Coba lagi.");
      setStored({ whatsappUrl });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Formulir belum dapat disimpan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button id={id} type="button" aria-label={ariaLabel} className={className} onClick={() => { setError(""); setStored(null); setOpen(true); }}>
        {children || label}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-dark/45 p-4 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby={`${dialogId}-title`} className="max-h-[min(92svh,720px)] w-full max-w-lg overflow-y-auto rounded-card border border-warm-border bg-warm-surface p-5 shadow-elevated sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Konsultasi singkat</p>
                <h2 id={`${dialogId}-title`} className="mt-1 font-serif text-2xl font-bold text-teal-primary">{stored ? "Data sudah tersimpan" : "Sebelum ke WhatsApp"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-body">{stored ? "Inquiry sudah masuk ke ruang kerja admin. Buka WhatsApp untuk meninjau pesan dan mengirimkannya secara manual." : hasPackage ? "Kami mencatat kontak dan konteks paket ini agar admin dapat menjawab lebih cepat." : "Kami mencatat kontak dan pertanyaan Anda sebelum membuka WhatsApp."}</p>
              </div>
              <button type="button" className="min-h-11 min-w-11 rounded-button border border-warm-border text-xl text-slate-body" aria-label="Tutup formulir inquiry" onClick={close}>×</button>
            </div>

            {stored ? (
              <div className="mt-6 space-y-4">
                <div role="status" className="rounded-button border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900"><strong>Berhasil disimpan.</strong> WhatsApp belum mengirim pesan sampai Anda menekan tombol kirim di aplikasi WhatsApp.</div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button type="button" className="min-h-11 rounded-button border border-warm-border px-4 py-2.5 text-sm font-bold text-slate-body" onClick={close}>Tutup</button>
                  <a href={stored.whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-button bg-teal-primary px-4 py-2.5 text-sm font-bold text-white">Buka WhatsApp</a>
                </div>
              </div>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={submit}>
                <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <label className="block text-sm font-semibold text-teal-primary">Nama <span className="font-normal text-red-700">*</span><input required maxLength={120} className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
                <label className="block text-sm font-semibold text-teal-primary">Nomor WhatsApp <span className="font-normal text-red-700">*</span><input required maxLength={40} className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} inputMode="tel" autoComplete="tel" /></label>
                <label className="block text-sm font-semibold text-teal-primary">Pertanyaan / kebutuhan <span className="font-normal text-slate-muted">(opsional)</span><textarea maxLength={1000} className="mt-2 min-h-24 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={message} onChange={(event) => setMessage(event.target.value)} /></label>
                {error && <p role="alert" className="rounded-button border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-800">{error}</p>}
                <p className="text-[11px] leading-5 text-slate-muted">Data ini dipakai tim kami untuk menindaklanjuti konsultasi. Pesan WhatsApp tetap perlu Anda kirim sendiri setelah aplikasi terbuka.</p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button type="button" className="min-h-11 rounded-button border border-warm-border px-4 py-2.5 text-sm font-bold text-slate-body" onClick={close}>Batal</button>
                  <button type="submit" className="min-h-11 rounded-button bg-teal-primary px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? "Menyimpan…" : "Simpan & siapkan WhatsApp"}</button>
                </div>
              </form>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
