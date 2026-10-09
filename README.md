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

Klik ikon **gear** di kiri-bawah (ada di halaman menunggu **dan** halaman perayaan, atau buka `#pengaturan`) untuk:

- Mengubah **tanggal lahir** (tersimpan di localStorage browser),
- **Buka Sekarang** untuk pratinjau perayaan,
- **Kunci lagi** untuk kembali ke hitungan menunggu.

Pintasan: tambahkan `#celebration` di URL untuk membuka halaman perayaan.

## ✏️ Cara kustomisasi

Data pribadi ada di satu file: **`src/config.js`**

| Yang diubah        | Keterangan                                            |
| ------------------ | ----------------------------------------------------- |
| `name` / `age`     | Nama & umur yang berulang tahun                       |
| `birthDay/Month/Year` | Tanggal lahir default untuk countdown              |
| `photo`            | Path foto utama di hero (contoh `/images/galeri/foto1.jpg`) |
| `gallery`          | Daftar foto + `caption` + `message` (kata-kata saat foto dibuka) |
| `slides`           | Daftar slide untuk slideshow (foto + judul + subjudul)|
| `secretTitle/secretMessage` | Isi pop-up kejutan saat perayaan dibuka      |
| `musicUrl`         | Isi link mp3 untuk tombol musik (contoh `/music.mp3`) |

### Mengganti foto

1. Taruh fotomu di folder **`public/images/galeri/`** (misal `foto1.jpg` … `foto6.jpg`).
2. Ubah `photo`, `gallery`, dan `slides` di `src/config.js` agar menunjuk ke file tersebut.
3. File SVG contoh (`foto1.svg` … `foto6.svg`) bisa dihapus setelahnya.

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
hasilnya **QR warna pink dengan bentuk love** (modul bulat + logo hati di tengah,
tetap bisa dipindai), lalu bagikan/cetak sendiri:

```bash
# pakai URL default
npm run qr

# atau tentukan URL sendiri (setelah deploy ke Vercel)
npm run qr -- "https://domain-kamu.vercel.app/#celebration"
```

Hasil (PNG + SVG) tersimpan di folder **`qr/`** (di luar `public/`, jadi tidak
ikut ter-deploy). Arahkan QR ke `#celebration` agar langsung membuka halaman
perayaan. Warna & bentuk bisa diatur di `scripts/generate-qr.mjs`.

---

Dibuat dengan ❤ untuk orang istimewa.
