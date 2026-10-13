# Pemberitahuan Materi Pihak Ketiga

Dokumen ini membatasi klaim kepemilikan eksklusif pada materi yang memang dimiliki atau
dilisensikan kepada proyek. Dependensi, font, foto, video, ikon, logo, dan materi referensi
tetap tunduk pada syarat pemilik atau lisensinya masing-masing.

## Dependensi langsung

Versi berasal dari `package.json` dan lockfile pada saat audit. Lisensi harus dikonfirmasi
kembali ketika dependensi diperbarui.

| Paket | Versi proyek | Lisensi terdeteksi |
| --- | --- | --- |
| `next` | 16.3.5 | MIT |
| `react` | 19.2.8 | MIT |
| `react-dom` | 19.2.8 | MIT |
| `@supabase/ssr` | 0.12.7 | MIT |
| `@supabase/supabase-js` | 2.116.x di manifest; lockfile memasang 2.117.3 | MIT |
| `@tailwindcss/postcss` | ^4 | MIT |
| `tailwindcss` | ^4 | MIT |
| `typescript` | ^5 | Apache-2.0 |
| `eslint` | ^9 | MIT |
| `eslint-config-next` | 16.3.5 | MIT |
| `@types/node` | ^20 | MIT |
| `@types/react` | ^19 | MIT |
| `@types/react-dom` | ^19 | MIT |

Transitive dependencies pada lockfile juga memiliki lisensi lain, termasuk Apache-2.0,
ISC, LGPL-3.0-or-later, dan kombinasi lisensi. Lisensi proyek ini tidak mengubah, mengambil
alih, atau membatasi hak yang diwajibkan oleh lisensi dependensi tersebut. Untuk distribusi
binary atau source bundle, jalankan pemindai lisensi dan sertakan notice teks yang diwajibkan
oleh setiap dependensi.

## Font dan aset

- `Plus Jakarta Sans` dimuat melalui `next/font/google`; hak font tetap berada pada pemilik
  dan lisensi font yang berlaku, bukan pada proyek ini.
- `public/next.svg`, `public/vercel.svg`, `public/window.svg`, dan `public/globe.svg` adalah
  aset template/default yang tidak boleh diklaim sebagai aset orisinal proyek tanpa verifikasi.
- Foto pada `public/images` belum memiliki catatan provenance atau bukti lisensi di repository.
  Jangan menjanjikan hak eksklusif atas foto tersebut sebelum bukti kepemilikannya disimpan.
- Nilai default `heroVideoUrl` masih mengarah ke host pihak ketiga (`ventour-wp.s3...`).
  Video tersebut harus diganti dengan aset milik sendiri atau disertai izin tertulis sebelum
  didistribusikan atau digunakan sebagai bukti aset orisinal.
- File dan screenshot dalam `example_pages` adalah bahan referensi/prototipe. Materi eksternal
  di dalamnya tidak termasuk Material Berlisensi dan sebaiknya dikeluarkan dari distribusi
  production.

## Kewajiban pemeliharaan

Setiap kontribusi baru harus mencatat sumber aset, lisensi, dan pemberi izin bila materi
tersebut bukan karya orisinal. Jangan menghapus notice pihak ketiga dari dependensi atau
paket distribusi.
