"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  package_name: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  message: string | null;
  source_path: string;
  context: {
    source?: string;
    label?: string;
    pagePath?: string;
    package?: { category?: string; price?: string; href?: string };
  } | null;
  status: string;
  created_at: string;
}

export default function InquiryManager({ sessionToken }: { sessionToken: string }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!sessionToken) {
        setError("Sesi admin belum tersedia. Muat ulang halaman setelah login.");
        setBusy(false);
        return;
      }
      try {
        const response = await fetch("/api/inquiries", { headers: { Authorization: `Bearer ${sessionToken}` }, cache: "no-store" });
        const result = (await response.json()) as { inquiries?: Inquiry[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Inquiry belum dapat dimuat.");
        setItems(result.inquiries || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Inquiry belum dapat dimuat.");
      } finally {
        setBusy(false);
      }
    }
    void load();
  }, [sessionToken]);

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl text-sm leading-6 text-slate-body">
          Kontak, konteks, dan pertanyaan yang diisi sebelum calon jemaah membuka WhatsApp.
        </p>

        {busy && <p className="mt-8 text-sm text-slate-muted">Memuat inquiry…</p>}
        {error && <p className="mt-8 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {!busy && !error && items.length === 0 && <p className="mt-8 rounded-card border border-warm-border bg-warm-surface p-6 text-sm text-slate-body">Belum ada inquiry masuk.</p>}
        {!busy && !error && items.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-card border border-warm-border bg-warm-surface shadow-card">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-b border-warm-border bg-warm-bg text-xs uppercase tracking-wider text-slate-muted">
                <tr><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Jemaah</th><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Pertanyaan</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-warm-border">
                {items.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-muted">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4"><p className="font-bold text-teal-primary">{item.contact_name || "Tanpa nama"}</p>{item.contact_phone && <p className="mt-1 text-xs text-slate-muted">{item.contact_phone}</p>}</td>
                    <td className="max-w-[220px] px-4 py-4 text-xs font-semibold text-teal-primary">
                      {item.package_name || "Konsultasi umum"}
                      {item.context?.package?.category && <span className="mt-1 block font-normal text-slate-muted">{item.context.package.category}</span>}
                      {item.context?.package?.price && <span className="mt-1 block font-normal text-slate-muted">{item.context.package.price}</span>}
                    </td>
                    <td className="max-w-[260px] px-4 py-4 text-xs leading-5 text-slate-body">
                      <span className="font-semibold text-teal-primary">{item.context?.label || "Konsultasi umum"}</span>
                      <span className="mt-1 block">{item.message || "Tidak ada pertanyaan tambahan."}</span>
                      <span className="mt-1 block text-[11px] text-slate-caption">Dari {item.source_path}</span>
                    </td>
                    <td className="px-4 py-4"><span className="rounded-badge bg-gold-light px-2 py-1 text-[11px] font-bold text-teal-primary">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
