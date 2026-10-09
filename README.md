# 🎂 Web Ulang Tahun Mila

Website ulang tahun interaktif dengan animasi, foto, bunga, dan QR code kejutan.
Dibuat dengan **React + Vite**, siap di-hosting gratis di **Vercel**.

## ✨ Fitur

- Animasi balon & bunga beterbangan, gradient bergerak, blob blur
- Foto orang yang berulang tahun dengan frame berputar & badge umur
- Hitung mundur (countdown) otomatis ke ulang tahun berikutnya
- Galeri foto + bunga dengan efek hover
- **QR code / barcode**: dipindai → membuka kejutan rahasia
- Kartu doa & harapan dengan animasi muncul saat di-scroll
- Efek confetti ("Tiup Lilin")
- Tombol musik (opsional)

## 🚀 Menjalankan di komputer

```bash
npm install
npm run dev
```

Buka alamat yang muncul (biasanya http://localhost:5173).

## ✏️ Cara kustomisasi

Semua data pribadi ada di satu file: **`src/config.js`**

| Yang diubah        | Keterangan                                            |
| ------------------ | ----------------------------------------------------- |
| `name`             | Nama yang berulang tahun                              |
| `age`              | Umur                                                 |
| `birthDay/Month/Year` | Tanggal lahir untuk countdown                      |
| `photo`            | Path foto utama (contoh `/images/mila.jpg`)           |
| `gallery`          | Daftar foto + caption galeri                          |
| `wishes`           | Doa & harapan                                         |
| `secretTitle/secretMessage` | Isi kejutan saat QR dipindai                 |
| `musicUrl`         | Isi link mp3 untuk tombol musik (contoh `/music.mp3`) |
| `socials`          | Link sosial media                                     |

### Mengganti foto

1. Taruh fotomu di folder **`public/images/`** (misal `mila.jpg`, `bunga1.jpg`).
2. Ubah `photo` dan `gallery` di `src/config.js` agar menunjuk ke file tersebut.
3. Foto SVG contoh (`mila.svg`, `flowers.svg`) bisa kamu hapus setelahnya.

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

## 🔎 Catatan soal QR code

QR code berisi link website ini sendiri + `#surprise`. Saat dipindai, pengunjung
langsung melihat pop-up kejutan beserta confetti. Jadi pastikan dibagikan setelah
website sudah online di Vercel agar link-nya benar.

---

Dibuat dengan ❤ untuk orang istimewa.
