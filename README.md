# 🎌 Hiragana Master

Aplikasi web interaktif untuk belajar Hiragana Jepang — lengkap dengan chart, flashcard, kuis, dan latihan menulis.

## Fitur

- **Chart** — Tabel lengkap semua 92 karakter Hiragana, dikelompokkan berdasarkan baris. Klik karakter untuk langsung ke latihan menulis.
- **Flashcard** — Kartu bolak-balik dengan mnemonic dan contoh kata. Bisa di-shuffle.
- **Quiz** — Pilihan ganda dua mode: Kana → Romaji dan Romaji → Kana. Dilengkapi streak counter dan tracking akurasi.
- **Writing** — Kanvas untuk latihan menulis karakter dengan panduan samar di belakang.
- **Progress tracking** — Setiap karakter punya indikator penguasaan (hijau/kuning/merah) yang tersimpan di browser.

## Cara Menjalankan Secara Lokal

**Requirement:** Node.js v18 atau lebih baru

```bash
# Install dependencies
npm install

# Jalankan mode development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Deploy ke Vercel

### Cara 1: Via GitHub (Direkomendasikan)

1. Buat repository baru di [github.com](https://github.com)
2. Upload semua file ini ke repo tersebut (drag & drop di GitHub web)
3. Buka [vercel.com](https://vercel.com) → **New Project**
4. Import repo GitHub kamu
5. Klik **Deploy** — Vercel otomatis detect Next.js
6. Selesai! Kamu dapat link `nama-project.vercel.app` yang langsung live

### Cara 2: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Struktur Project

```
hiragana-master/
├── data/
│   └── hiragana.js       # Data semua karakter, mnemonic, contoh kata
├── pages/
│   ├── _app.js           # Wrapper global
│   ├── _document.js      # Custom HTML document
│   └── index.js          # Halaman utama (semua fitur)
├── styles/
│   └── globals.css       # CSS global
├── next.config.js
├── package.json
└── README.md
```

## Tech Stack

- **Framework:** Next.js 14
- **Language:** JavaScript (React)
- **Styling:** CSS-in-JS (inline styles)
- **Storage:** localStorage (progress tersimpan di browser)
- **Fonts:** Noto Sans JP, DM Sans, Space Mono (Google Fonts)
- **Deploy:** Vercel (gratis)
