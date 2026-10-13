"use client";

import { useState, type FormEvent, type ReactNode } from "react";

interface InquiryDialogProps {
  href: string;
  packageId?: string;
  packageName?: string;
  label: string;
  className: string;
  id?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

export default function InquiryDialog({ href, packageId, packageName, label, className, id, children, ariaLabel }: InquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const popup = window.open("", "_blank");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          packageId: packageId || null,
          packageName: packageName || null,
          contactName: name,
          contactPhone: phone,
          message,
          sourcePath: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      const result = (await response.json()) as { stored?: boolean; error?: string; reason?: string };
      if (!response.ok || !result.stored) {
        throw new Error(result.error || result.reason || "Formulir belum dapat disimpan. Coba lagi.");
      }
      if (popup) {
        popup.opener = null;
        popup.location.href = href;
      } else {
        window.location.href = href;
      }
      setOpen(false);
      setName("");
      setPhone("");
      setMessage("");
    } catch (submitError) {
      popup?.close();
      setError(submitError instanceof Error ? submitError.message : "Formulir belum dapat disimpan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button id={id} type="button" aria-label={ariaLabel} className={className} onClick={() => { setError(""); setOpen(true); }}>{children || label}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-dark/45 p-4 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="inquiry-dialog-title" className="w-full max-w-lg rounded-card border border-warm-border bg-warm-surface p-5 shadow-elevated sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover">Sebelum ke WhatsApp</p>
                <h2 id="inquiry-dialog-title" className="mt-1 font-serif text-2xl font-bold text-teal-primary">Tinggalkan kontak singkat</h2>
                <p className="mt-2 text-sm leading-6 text-slate-body">Data ini membantu admin menindaklanjuti pertanyaan tentang paket yang sama.</p>
              </div>
              <button type="button" className="min-h-11 min-w-11 rounded-button border border-warm-border text-xl text-slate-body" aria-label="Tutup formulir inquiry" onClick={() => setOpen(false)}>×</button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={submit}>
              <label className="block text-sm font-semibold text-teal-primary">Nama <span className="font-normal text-red-700">*</span><input required className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
              <label className="block text-sm font-semibold text-teal-primary">Nomor WhatsApp <span className="font-normal text-red-700">*</span><input required className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" /></label>
              <label className="block text-sm font-semibold text-teal-primary">Pertanyaan / kebutuhan <span className="font-normal text-slate-muted">(opsional)</span><textarea className="mt-2 min-h-24 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-primary" value={message} onChange={(event) => setMessage(event.target.value)} /></label>
              {error && <p role="alert" className="rounded-button border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-800">{error}</p>}
              <p className="text-[11px] leading-5 text-slate-muted">Data ini hanya dipakai tim kami untuk menindaklanjuti konsultasi Anda dan tidak dimasukkan ke URL WhatsApp.</p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" className="min-h-11 rounded-button border border-warm-border px-4 py-2.5 text-sm font-bold text-slate-body" onClick={() => setOpen(false)}>Batal</button>
                <button type="submit" className="min-h-11 rounded-button bg-teal-primary px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? "Menyimpan…" : "Lanjut ke WhatsApp"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
