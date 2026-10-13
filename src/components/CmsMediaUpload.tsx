"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

interface CmsMediaUploadProps {
  label: string;
  value?: string;
  folder: string;
  supabase: SupabaseClient | null;
  onChange: (value: string) => void;
}

export default function CmsMediaUpload({ label, value = "", folder, supabase, onChange }: CmsMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Pilih file gambar (JPG, PNG, WebP, atau GIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 8 MB.");
      return;
    }
    if (!supabase) {
      setError("Supabase belum terhubung di environment CMS.");
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("cms-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      setError(uploadError.message || "Upload gambar gagal. Pastikan bucket cms-media sudah dibuat.");
    } else {
      const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }

  return <div className="space-y-2">
    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-muted">{label}</span>
    <div className="flex flex-col gap-3 rounded-button border border-dashed border-warm-border bg-warm-bg p-3 sm:flex-row sm:items-center">
      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-button border border-warm-border bg-teal-primary/10" style={value ? { backgroundImage: `url(${value})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined} aria-label={value ? `Preview ${label}` : `Belum ada ${label}`}>
        {!value && <div className="flex h-full items-center justify-center px-2 text-center text-[10px] font-semibold text-slate-muted">Belum ada foto</div>}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="URL gambar (opsional)" aria-label={`${label} URL`} className="w-full rounded-button border border-warm-border bg-white px-3 py-2 text-xs text-slate-dark outline-none focus:border-teal-primary" />
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex min-h-10 cursor-pointer items-center rounded-button bg-teal-primary px-3 py-2 text-xs font-bold text-white hover:bg-teal-900">
            {uploading ? "Mengunggah…" : "Upload gambar"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="min-h-10 rounded-button border border-warm-border px-3 py-2 text-xs font-bold text-red-700 hover:border-red-200">Hapus gambar</button>}
        </div>
        {error && <p className="text-xs leading-5 text-red-700">{error}</p>}
      </div>
    </div>
  </div>;
}
