# 🎂 Web Ulang Tahun Mila

Website ulang tahun interaktif dengan **dua halaman**:
1. **Halaman Menunggu** — hitung mundur flip-card ke hari ulang tahun.
2. **Halaman Perayaan** — otomatis terbuka saat hari H (atau via tombol di Pengaturan), berisi kue + lilin, slideshow, galeri foto, dan ucapan.

Dibuat dengan **React + Vite** + **framer-motion**, siap di-hosting gratis di **Vercel**.

## ✨ Fitur

- **Two-page flow**: countdown menunggu → perayaan, dengan transisi blur halus
- Hitung mundur **flip card** + progress bar menuju hari bahagia
- Halaman perayaan terbuka **otomatis** saat tanggal ulang tahun tiba
- **Kue ulang tahun** interaktif: tiup lilin → confetti + asap
- **Slideshow otomatis** dengan efek geser & Ken Burns
- **Galeri & ucapan digabung**: klik foto → lightbox menampilkan kenangan + kata-kata untuknya
- Pop-up **kejutan** otomatis + confetti saat perayaan dibuka
- Emoji 3D/animasi (Microsoft Teams Animated Emojis)
- Balon & bunga beterbangan, gradient bergerak, blob blur
- Font menarik: Dancing Script, Fredoka, Quicksand
- Tombol musik (opsional) & scroll progress bar

## 🚀 Menjalankan di komputer

```bash
npm install
npm run dev
```

Buka alamat yang muncul (biasanya http://localhost:5173).

## ⚙️ Halaman Pengaturan (khusus pembuat)

Klik ikon **gear** di kiri-bawah (hanya muncul di **mode owner**, atau buka `#owner`) untuk:

- Mengubah **tanggal lahir** (tersimpan di localStorage browser),
- **Buka Sekarang** untuk pratinjau perayaan,
- **Kunci lagi** untuk kembali ke hitungan menunggu,
- **Keluar mode owner** untuk menyembunyikan gear lagi.

### 🔐 Mode owner (pengaturan hanya untuk kamu)

Tombol pengaturan **disembunyikan** dari pengunjung. Untuk membukanya, tambahkan
`#owner` di URL (sekali saja — akan tersimpan di browser itu):

```
https://web-ultah-mila.vercel.app/#owner
```

Setelah itu gear ⚙ muncul dan panel bisa dibuka juga lewat `#pengaturan`.
Klik **Keluar mode owner** untuk menonaktifkan lagi.

> Catatan: tanggal disimpan **per-device** (localStorage). Tanggal yang dilihat
> semua pengunjung berasal dari `src/config.js`. Panel owner hanya mengubah di
> device kamu untuk pratinjau.

### 🔗 Pintasan URL

| URL           | Tampil                                              |
| ------------- | --------------------------------------------------- |
| `/`           | Halaman tunggu (otomatis ke perayaan saat hari-H)   |
| `#celebration`| Langsung halaman **perayaan**                       |
| `#waiting`    | Langsung halaman **tunggu** (walau hari-H)          |
| `#owner`      | Aktifkan mode owner + buka pengaturan               |
| `#pengaturan` | Buka pengaturan (kalau mode owner aktif)            |

## ✏️ Cara kustomisasi

Data pribadi ada di satu file: **`src/config.js`**

| Yang diubah        | Keterangan                                            |
| ------------------ | ----------------------------------------------------- |
| `name`             | Nama yang berulang tahun                              |
| `age`              | Umur cadangan (umur asli dihitung otomatis dari tahun lahir) |
| `birthDay/Month/Year` | Tanggal & tahun lahir (umur + countdown mengikuti ini) |
| `photo`            | Path foto utama di hero (contoh `/images/galeri/foto1.jpg`) |
| `gallery`          | Daftar foto + `caption` + `message` (kata-kata saat foto dibuka) |
| `slides`           | Daftar slide untuk slideshow (foto + judul + subjudul)|
| `secretTitle/secretMessage` | Isi pop-up kejutan saat perayaan dibuka      |
| `musicUrl`         | Path lagu, contoh `/music/shape-of-my-heart.mp3` (taruh file di `public/music/`) |

### Menambahkan lagu

1. Taruh file mp3-mu di **`public/music/`** (mis. `shape-of-my-heart.mp3`).
2. Pastikan `musicUrl` di `src/config.js` menunjuk ke file itu.
3. Tombol musik muncul di kanan-bawah; lagu dicoba autoplay, kalau diblokir browser
   klik tombolnya (atau sentuh halaman) untuk memutar.

### Mengganti foto

1. Taruh fotomu di folder **`public/images/galeri/`** (misal `mila1.jpg` … `mila6.jpg`).
2. Ubah `photo`, `gallery`, dan `slides` di `src/config.js` agar menunjuk ke file tersebut.
3. Galeri tampil portrait (3:4), slideshow menampilkan foto utuh dengan latar blur.

## ☁️ Deploy ke Vercel

Cara paling mudah (via GitHub):

1. Upload project ini ke sebuah repository GitHub.
2. Buka https://vercel.com → **Add New Project** → pilih repository tadi.
3. Vercel otomatis mendeteksi **Vite** (sudah diset di `vercel.json`).
4. Klik **Deploy**. Selesai! 🎉

Atau via CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

## 🔗 Barcode / QR code (di luar web)

QR/barcode **tidak ditampilkan** di website. Buat filenya lewat script Node —
hasilnya **QR yang menyatu dalam bentuk love** (modul bulat + logo hati, tetap
bisa dipindai), lalu bagikan/cetak sendiri. Script menghasilkan **dua QR**:

- `ultah-mila-perayaan` → langsung halaman **perayaan** (`#celebration`, pink)
- `ultah-mila-tunggu` → langsung halaman **tunggu** (`#waiting`, ungu). Tanggal
  hitungannya mengikuti `birthDay/Month/Year` di `src/config.js`

```bash
# pakai URL default + tanggal dari config.js
npm run qr

# tentukan base URL sendiri
npm run qr -- "https://web-ultah-mila.vercel.app"

# tentukan tanggal khusus untuk QR tunggu (bukan dari config)
QR_DATE="5-12-2005" npm run qr
```

Hasil (PNG + SVG) tersimpan di folder **`qr/`** (di luar `public/`, jadi tidak
ikut ter-deploy). Warna & bentuk bisa diatur di `scripts/generate-qr.mjs`.

### Tanggal QR tunggu = waktu yang kamu set di panel

Kalau kamu set tanggal lahir di panel pengaturan (mode owner), buka
**Salin link QR tunggu** di bagian bawah panel — link itu sudah berisi tanggal
yang baru kamu set. Pakai link itu untuk membuat barcode:

```bash
QR_BASE_URL="https://web-ultah-mila.vercel.app" QR_DATE="9-10-2005" npm run qr
```

Cukup ganti `9-10-2005` dengan tanggal hasil salinan di panel. Orang yang
memindai QR tunggu akan melihat countdown mengarah ke tanggal itu (link QR
dianggap punya "waktu sendiri", tidak terpengaruh setelan device lain).

---

Dibuat dengan ❤ untuk orang istimewa.
