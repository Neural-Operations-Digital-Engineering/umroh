# Audit Kekayaan Intelektual dan Kebijakan Penggunaan

Status: rancangan implementasi, wajib ditinjau oleh profesional hukum sebelum dipakai untuk
penegakan atau penjualan lisensi.

## Kondisi proyek saat audit

- Aplikasi menggunakan Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase, dan ESLint.
- Kode sumber berada di `src/`, konfigurasi build di root, migration database di
  `supabase/migrations/`, dokumentasi di `docs/`, dan aset publik di `public/`.
- Pemilik proyek mengonfirmasi `NODE (Neural Operations & Digital Engineering)` sebagai studio
  boutique, author, web developer, dan pemegang utama/pengelola proyek.
- `Risalah Madina Tour` (RMT) adalah badan usaha pengguna situs untuk penjualan jasa umroh dan
  travel. `Yayasan Pondok Digitalpreneur Abdurrahman Bin Auf Cirebon` (ABA) menjalankan subunit
  atau cabang bisnis RMT serta menyediakan media untuk proyek. Ketiga pihak dinyatakan memiliki
  hak sesuai kontribusi dan materi masing-masing; pembagian rinci masih harus dibuktikan.
- Tanggal publikasi pertama diberikan sebagai 15 September 2026. Author dan Web Developer
  yang dicatat adalah `Muhammad Nizar al-Faris`.
- `PT. Risalah Madina Bunga Tiara` juga tercantum pada data aplikasi. Nama tersebut diperlakukan
  sebagai identitas bisnis/konten aplikasi, bukan otomatis sebagai pemegang hak cipta.
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

## Ringkasan izin yang direncanakan

- Hak atas Material Berlisensi bersifat eksklusif bagi NODE, RMT, dan ABA sesuai pembagian hak
  yang sah; NODE menjadi Pemberi Lisensi dan titik komunikasi utama.
- Izin umum dimaksudkan berlaku seumur hidup/tanpa batas waktu selama hak atas Material
  Berlisensi masih dilindungi, tetapi tetap terbatas, tidak dapat dialihkan, dan dapat
  dihentikan karena pelanggaran.
- Evaluasi, pendidikan, penelitian, dan penggunaan sebagai template terbatas diperbolehkan
  sepanjang tidak menyalin substansial kode/konten orisinal dan mencantumkan atribusi di kode
  serta secara terlihat pada situs.
- Penggunaan komersial, deployment untuk klien, redistribusi, atau penggunaan turunan
  memerlukan izin eksplisit tertulis melalui `finance.budsteam@gmail.com`.
- Pelanggaran diberi kesempatan perbaikan selama 14 hari kalender sejak pemberitahuan tertulis
  diterima; izin dapat dihentikan jika pelanggaran tidak diperbaiki.

## Prosedur permintaan izin

Permintaan penggunaan komersial, redistribusi, modifikasi publik, sublicensing, deployment
untuk klien, atau pembuatan produk turunan harus memuat identitas pemohon, tujuan, wilayah,
jangka waktu, pengguna, bentuk distribusi, dan aset yang ingin digunakan. Kirim ke
`finance.budsteam@gmail.com` atau alamat pengganti yang tercantum pada `LICENSE`. Tidak ada
izin yang dianggap diberikan hanya karena
repository dapat dilihat atau di-clone.

## Checklist sebelum finalisasi

- [x] Identitas dan alamat NODE diisi; verifikasi nama resmi, bentuk badan usaha, dan kapasitas
      hukumnya masih diperlukan.
- [x] Relasi NODE–RMT–ABA dan peran masing-masing dicatat berdasarkan keterangan pemilik proyek.
- [ ] Dokumentasikan pembagian hak ketiga pihak melalui perjanjian tertulis.
- [x] Tanggal publikasi pertama dikonfirmasi: 15 September 2026.
- [x] Nama author dan Web Developer dikonfirmasi: Muhammad Nizar al-Faris.
- [x] Kontak permohonan izin diisi: `finance.budsteam@gmail.com`.
- [ ] Konfirmasi domisili hukum dan kewenangan kontak/penandatangan.
- [ ] Dokumentasikan kontribusi setiap developer dan kontraktor.
- [ ] Kumpulkan bukti lisensi semua foto, video, font, logo, ikon, dan materi prototipe.
- [ ] Ganti seluruh aset pihak ketiga yang belum memiliki bukti lisensi; aset tetap dikecualikan
      dari klaim proprietary sampai penggantian selesai.
- [ ] Jalankan pemindaian lisensi transitive dependencies sebelum source/binary distribution.
- [ ] Tinjau klausul termination, liability, forum, dan hukum oleh advokat Indonesia.
- [ ] Pertimbangkan pencatatan ciptaan dan/atau lisensi melalui kanal resmi DJKI bila relevan.
