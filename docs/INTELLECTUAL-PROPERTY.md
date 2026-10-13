# Audit Kekayaan Intelektual dan Kebijakan Penggunaan

Status: rancangan implementasi, wajib ditinjau oleh profesional hukum sebelum dipakai untuk
penegakan atau penjualan lisensi.

## Kondisi proyek saat audit

- Aplikasi menggunakan Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase, dan ESLint.
- Kode sumber berada di `src/`, konfigurasi build di root, migration database di
  `supabase/migrations/`, dokumentasi di `docs/`, dan aset publik di `public/`.
- Repositori mencantumkan `PT. Risalah Madina Bunga Tiara` sebagai nama legal pada data aplikasi,
  tetapi repository tidak memuat dokumen pengalihan hak, perjanjian kerja, atau bukti bahwa
  badan usaha tersebut adalah pemegang seluruh hak atas kode dan aset.
- Riwayat Git memberi bukti kronologi pengembangan, tetapi identitas committer bukan dengan
  sendirinya bukti kepemilikan hak cipta.
- Tidak ditemukan lisensi proyek sebelumnya. `LICENSE` sekarang menetapkan rancangan proprietary,
  bukan lisensi open-source.

## Batas klaim kepemilikan

Klaim proprietary hanya diarahkan pada kode, struktur, desain, copy, dan aset yang benar-benar
dimiliki atau telah dilisensikan kepada pemegang hak. Dependensi pihak ketiga, font, foto,
video, template/default assets, merek, data perusahaan, dan materi `example_pages` dikecualikan
sampai provenance-nya diverifikasi. Rincian awal ada di `THIRD_PARTY_NOTICES.md`.

## Aturan penggunaan internal

1. Simpan repository sebagai private bila source code tidak memang dimaksudkan untuk dipublikasikan.
2. Berikan akses GitHub/Vercel/Supabase hanya berdasarkan kebutuhan kerja dan cabut akses saat
   hubungan kerja atau kontrak berakhir.
3. Simpan perjanjian contributor, kontraktor, pengalihan hak, dan izin aset di luar repository
   pada penyimpanan yang dikendalikan pemilik.
4. Jangan memasukkan token, private key, service-role key, atau rahasia deployment ke Git.
5. Pertahankan tag/release, commit, backup, dan log deployment sebagai bukti kronologi; ini
   membantu pembuktian tetapi tidak menggantikan pencatatan hak cipta atau kontrak.
6. Jangan menambahkan telemetri tersembunyi, kill switch, obfuscation agresif, atau pembatasan
   yang mengumpulkan data tanpa persetujuan. Minifikasi produksi hanya merupakan optimasi dan
   bukan pengganti perlindungan hukum.

## Prosedur permintaan izin

Permintaan penggunaan komersial, redistribusi, modifikasi publik, sublicensing, deployment
untuk klien, atau pembuatan produk turunan harus memuat identitas pemohon, tujuan, wilayah,
jangka waktu, pengguna, bentuk distribusi, dan aset yang ingin digunakan. Kirim ke alamat
kontak yang akan diisi pada `LICENSE`. Tidak ada izin yang dianggap diberikan hanya karena
repository dapat dilihat atau di-clone.

## Checklist sebelum finalisasi

- [ ] Ganti placeholder pemegang hak cipta dan alamat izin.
- [ ] Konfirmasi apakah pemegang hak adalah individu, PT, atau kombinasi melalui perjanjian.
- [ ] Dokumentasikan kontribusi setiap developer dan kontraktor.
- [ ] Kumpulkan bukti lisensi semua foto, video, font, logo, ikon, dan materi prototipe.
- [ ] Ganti atau lisensikan video hero pihak ketiga.
- [ ] Jalankan pemindaian lisensi transitive dependencies sebelum source/binary distribution.
- [ ] Tinjau klausul termination, liability, forum, dan hukum oleh advokat Indonesia.
- [ ] Pertimbangkan pencatatan ciptaan dan/atau lisensi melalui kanal resmi DJKI bila relevan.
