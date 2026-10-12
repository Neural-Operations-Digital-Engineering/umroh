# Verifikasi Performa dan Build

Tanggal: 12 Oktober 2026
Baseline: `28deb4b`
Sesudah: `2cb19fa`

## Build

- `next build --webpack`: berhasil.
- Compile webpack: berhasil.
- TypeScript: selesai tanpa error.
- Static generation: 23/23 halaman berhasil.
- Lint ESLint: 0 error, 5 warning unused variable yang tidak memblokir build.

## Konfirmasi API

- `Plus_Jakarta_Sans` tanpa `weight` diterima. Dokumentasi Next.js merekomendasikan variable font tanpa daftar weight; build dan TypeScript berhasil.
- `fetchPriority="high"` pada `next/image` diterima oleh tipe React dan build berhasil.
- `dynamic(() => import(...).then((m) => m.HowItWorksSection))` diterima dan build berhasil.

## Ukuran entry route hasil build

Next.js 16.3.5 dengan webpack tidak mencetak kolom ukuran route pada output build. Angka berikut adalah ukuran file entry server hasil kompilasi di `.next/server/app`, bukan total transfer browser.

| Route | Sebelum | Sesudah | Perubahan |
| --- | ---: | ---: | ---: |
| `/` | 39,913 B | 42,915 B | +3,002 B |
| `/umroh` | 5,444 B | 5,428 B | -16 B |
| `/umroh/[slug]` | 24,879 B | 24,861 B | -18 B |

Build output mencantumkan route yang sama pada baseline dan sesudah, termasuk empat static slug Umroh.

## Smoke test browser

- `/`: berhasil dirender; gambar hero, CTA, cookie notice, dan floating WhatsApp tampil.
- Slider destinasi: memilih Dubai mengganti heading dan latar dengan benar.
- `/umroh`: berhasil dirender; empat paket tampil dengan gambar ber-alt dan tautan detail.
- `/umroh/umroh-spesial-liburan-sekolah`: berhasil dirender; detail jadwal, harga, fasilitas, dan CTA WhatsApp tampil.
- Tautan WhatsApp: href `wa.me` terbentuk pada CTA hero, kartu paket, CTA detail, dan tombol floating.
- Tidak ditemukan indikasi gambar pecah pada accessibility tree atau screenshot smoke test.
- URL video hero merespons HTTP 200 dengan MIME `video/mp4`. Playback desktop belum dapat dibuktikan secara penuh karena browser desktop dan Chrome tidak tersedia di host.

## Lighthouse

Audit Lighthouse mobile dan desktop untuk `/`, `/umroh`, dan `/umroh/[slug]` belum dapat menghasilkan skor LCP, CLS, TBT, atau total transfer size. Lighthouse CLI terpasang, tetapi `chrome-launcher` tidak menemukan instalasi Chrome. Baseline Lighthouse sebelum perubahan juga tidak pernah direkam.
