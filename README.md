# Risalah Madina Tour

Website publik dan CMS untuk Risalah Madina Tour, biro perjalanan haji dan umroh. Pengunjung dapat membandingkan paket, membaca detail perjalanan, mengirim pertanyaan, lalu melanjutkan konsultasi melalui WhatsApp. Tim internal mengelola konten, paket, media, dan inquiry dari dashboard admin.

## Fitur utama

- Homepage editorial dengan informasi layanan, destinasi, paket pilihan, dan CTA konsultasi.
- Katalog paket Umroh dan Haji dengan pencarian, filter, pengurutan, dan halaman detail.
- Halaman informasi tentang perusahaan, legalitas, dokumentasi, FAQ, dan pembiayaan.
- Form inquiry sebelum pengunjung diarahkan ke WhatsApp.
- CMS untuk mengelola profil perusahaan, paket, konten, media, dan inquiry.
- Autentikasi Supabase untuk area admin dengan role `admin` dan `editor`.
- Cache dan invalidasi route setelah perubahan data CMS.
- Metadata SEO, sitemap, robots, canonical URL, Open Graph, dan structured data untuk halaman paket.
- Fallback ke data lokal jika Supabase belum dikonfigurasi.

## Teknologi

- Next.js 16 dengan App Router dan TypeScript
- React 19
- Tailwind CSS 4
- Supabase Auth, Postgres, Storage, dan Row Level Security
- ESLint 9

## Memulai secara lokal

Persyaratan: Node.js dan npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah yang tersedia:

```bash
npm run dev      # development server
npm run lint     # pemeriksaan ESLint
npm run build    # production build dan type-check
npm run start    # menjalankan hasil production build
```

## Konfigurasi environment

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publik situs untuk metadata dan sitemap. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key dari Supabase Project Settings → API. |
| `CMS_ADMIN_TOKEN` | Token fallback untuk penyimpanan CMS lokal jika Supabase belum digunakan. Gunakan nilai acak yang panjang. |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | URL video hero self-hosted. Opsional; fallback ke URL media dari CMS. |

Jangan commit `.env.local` atau kredensial apa pun. Gunakan `.env.example` sebagai acuan.

## Menyiapkan Supabase CMS

1. Buat project Supabase.
2. Jalankan migration di Supabase SQL Editor secara berurutan:

   ```text
   supabase/migrations/001_cms.sql
   supabase/migrations/002_cms_media.sql
   supabase/migrations/003_enterprise_security_and_inquiries.sql
   supabase/migrations/004_security_hardening.sql
   ```

3. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
4. Buat user admin atau editor melalui Supabase Authentication → Users.
5. Masukkan UUID user tersebut ke tabel `cms_members`:

   ```sql
   insert into public.cms_members (user_id, role)
   values ('UUID_USER_DARI_SUPABASE_AUTH', 'admin');
   ```

6. Jalankan aplikasi dan buka [`/admin/login`](http://localhost:3000/admin/login).

Role `admin` dapat mengelola seluruh data dan melakukan reset. Role `editor` dapat mengubah konten serta mengunggah media. Data inquiry dibaca dari dashboard setelah pengunjung mengirim form konsultasi.

Tanpa konfigurasi Supabase, situs tetap dapat dijalankan menggunakan data lokal dari [`content/site-data.json`](content/site-data.json). Untuk menyimpan perubahan melalui fallback lokal, isi `CMS_ADMIN_TOKEN`.

## Route penting

| Area | Route |
| --- | --- |
| Situs publik | `/` |
| Katalog Umroh | `/umroh` |
| Detail Umroh | `/umroh/[slug]` |
| Katalog Haji | `/haji` |
| Detail Haji | `/haji/[slug]` |
| Katalog gabungan | `/paket` |
| Detail paket | `/paket/[slug]` |
| Informasi | `/tentang`, `/legalitas`, `/dokumentasi`, `/faq`, `/pembiayaan` |
| Legal | `/terms`, `/privacy-policy` |
| Login CMS | `/admin/login` |
| Dashboard CMS | `/admin` |
| API CMS | `/api/cms` |
| API inquiry | `/api/inquiries` |

## Struktur proyek

```text
src/app/                 route publik, admin, dan API
src/components/          komponen UI dan CMS
src/lib/                 akses data, Supabase, kontak, dan structured data
content/site-data.json   fallback konten lokal
supabase/migrations/     schema, policy, media, inquiry, dan hardening
docs/                    arsitektur dan catatan QA
DESIGN.md                arah visual dan prinsip desain
```

## Dokumentasi terkait

- [`DESIGN.md`](DESIGN.md): arah visual, tone, tipografi, dan guardrail desain.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): alur CMS, autentikasi, cache, storage, dan batas keamanan.
- [`docs/qa/performance-verification-2026-10-12.md`](docs/qa/performance-verification-2026-10-12.md): catatan build, smoke test, dan batasan pengukuran Lighthouse.

## Deploy

Deploy ke platform yang mendukung Next.js dengan menjalankan production build terlebih dahulu:

```bash
npm run build
npm run start
```

Pastikan seluruh variabel environment production sudah diisi di platform deploy dan migration Supabase sudah dijalankan sesuai urutan.
