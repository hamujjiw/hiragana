# 🎌 Nihongo Master

Aplikasi web belajar bahasa Jepang lengkap dengan sistem leveling, placement test, vocab, frasa, kalimat, dan hiragana — semua tersimpan di cloud via Supabase.

## Fitur

- **Placement Test** — 15 soal untuk menentukan level awal (Beginner / Elementary / Intermediate)
- **Leveling System** — belajar sesuai level, ada Level Test untuk naik level
- **Vocabulary** — 30 kata per level dengan flashcard & kuis
- **Phrases** — 10 frasa per level dengan situasi penggunaan
- **Sentences** — 5 kalimat per level dengan breakdown kata
- **Hiragana** — chart, flashcard, kuis, dan latihan menulis (92 karakter)
- **Progress Tracking** — tersimpan di Supabase, aman ganti device
- **Auth** — register & login dengan email/password

---

## Setup (Wajib Sebelum Deploy)

### 1. Buat Supabase Project

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Isi nama project, password database, pilih region terdekat
3. Tunggu project selesai dibuat (~1 menit)

### 2. Jalankan SQL Schema

1. Di dashboard Supabase → klik **SQL Editor** → **New Query**
2. Copy seluruh isi file `supabase-schema.sql`
3. Paste ke SQL Editor → klik **Run**
4. Pastikan muncul pesan "Success"

### 3. Ambil API Keys

1. Di dashboard Supabase → **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Setup Environment Variables

**Untuk development lokal:**
```bash
cp .env.local.example .env.local
# Edit .env.local, isi dengan nilai dari Supabase
```

**Untuk Vercel (production):**
1. Di dashboard Vercel → project kamu → **Settings** → **Environment Variables**
2. Tambahkan dua variabel:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL dari Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key dari Supabase
3. Klik **Save** → lalu **Redeploy**

---

## Cara Menjalankan Lokal

```bash
# Requirement: Node.js v18+

npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Deploy ke Vercel

1. Upload semua file ini ke GitHub repo baru
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo
3. Sebelum deploy, tambahkan environment variables Supabase (lihat langkah 4 di atas)
4. Klik **Deploy**
5. Live di `nama-project.vercel.app` 🚀

---

## Struktur Project

```
nihongo-master/
├── data/
│   ├── hiragana.js          # Data 92 karakter hiragana + mnemonic
│   └── content.js           # Vocab, frasa, kalimat, placement test, level test
├── lib/
│   ├── supabase.js          # Supabase client
│   ├── auth.js              # Auth context & hooks
│   └── progress.js          # Progress & level helpers
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js             # Main app (learn, hiragana, progress)
│   ├── login.js             # Login & register
│   └── placement.js         # Placement test
├── styles/
│   └── globals.css
├── supabase-schema.sql      # ← Jalankan ini di Supabase SQL Editor
├── .env.local.example       # Template environment variables
├── next.config.js
└── package.json
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 |
| Auth & Database | Supabase (gratis) |
| Styling | CSS-in-JS |
| Fonts | Noto Sans JP, DM Sans |
| Deploy | Vercel (gratis) |
