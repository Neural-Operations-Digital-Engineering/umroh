"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase/browser";

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const nextPath = searchParams.get("next")?.startsWith("/admin") ? searchParams.get("next") : "/admin";
  const isUnauthorized = searchParams.get("error") === "not-authorized";
  const isConfigurationError = searchParams.get("error") === "configuration";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Supabase Auth belum dikonfigurasi pada environment aplikasi.");
      setBusy(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message || "Login gagal. Periksa email dan password Anda.");
      setBusy(false);
      return;
    }

    window.location.assign(nextPath || "/admin");
  }

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-4 py-8 text-slate-dark sm:px-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[#d5cec0] bg-[#fffdf8] shadow-[0_2rem_5rem_rgba(43,47,39,0.16)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-teal-deep lg:block">
          <Image src="/images/minaret-hero.jpg" alt="Suasana Masjidil Haram" fill sizes="40vw" className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-teal-deep/55" />
          <div className="absolute inset-x-8 bottom-10 text-white"><p className="eyebrow !text-gold-accent">Ruang kerja perjalanan</p><p className="mt-4 max-w-xs font-sans text-3xl font-bold leading-tight tracking-[-0.04em]">Kerapian di belakang layar terasa di setiap perjalanan.</p><p className="mt-4 max-w-sm text-xs leading-6 text-white/65">Kelola paket, media, dan inquiry jemaah dari satu ruang yang tertata.</p></div>
        </div>
        <div className="p-6 sm:p-10 lg:p-14">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-button border border-gold-accent/40 bg-teal-primary font-serif text-lg font-bold text-gold-accent">RM</span>
          <div>
            <p className="font-serif text-lg font-bold text-teal-primary">Ruang CMS</p>
            <p className="text-xs text-slate-muted">Risalah Madina Tour</p>
          </div>
        </div>
        <div className="mt-8">
          <p className="eyebrow">Akses terbatas</p>
          <h1 className="mt-4 font-sans text-3xl font-bold tracking-[-0.04em] text-teal-primary">Masuk ke CMS</h1>
          <p className="mt-3 text-sm leading-6 text-slate-body">Gunakan akun Supabase yang sudah terdaftar sebagai admin atau editor.</p>
        </div>

        {(isUnauthorized || isConfigurationError || error) && (
          <div className="mt-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
            {error || (isConfigurationError ? "Konfigurasi Supabase belum lengkap pada server production." : "Akun ini belum memiliki role admin atau editor.")}
          </div>
        )}

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-button border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900">Supabase belum tersambung. Isi environment Supabase sebelum mengaktifkan CMS production.</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-teal-primary">
              Email
              <input className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm text-slate-dark outline-none focus:border-teal-primary" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block text-sm font-semibold text-teal-primary">
              Password
              <input className="mt-2 min-h-11 w-full rounded-button border border-warm-border bg-white px-3 py-2.5 text-sm text-slate-dark outline-none focus:border-teal-primary" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button className="min-h-12 w-full rounded-button bg-teal-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-900 disabled:cursor-wait disabled:opacity-60" disabled={busy} type="submit">
              {busy ? "Memeriksa akses…" : "Masuk ke CMS"}
            </button>
          </form>
        )}
        </div>
      </section>
    </main>
  );
}
