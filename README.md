# GrabMaR 💰

Aplikasi kalkulator pendapatan harian untuk driver Grab. Hitung uang digital & cash, simpan riwayat, dan lihat detail breakdown setiap hari.

---

## ✨ Fitur

- **Kalkulator Pendapatan** — Input dompet digital (Kredit, Tunai, OVO) dan uang cash per lembar + input manual
- **Live Total** — Total otomatis update saat mengetik
- **Akun & Login** — Register/login dengan JWT authentication
- **Simpan & Riwayat** — Simpan hasil perhitungan dan lihat riwayat semua pendapatan
- **Detail Breakdown** — Modal detail untuk setiap entri riwayat
- **Responsive** — Desktop tabel, mobile cards

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript, Tailwind CSS (CDN) |
| Backend | Node.js Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (custom, pure JS) |
| Hosting | Vercel |

---

## 🚀 Deploy ke Vercel

### 1. Setup Database

Buat project di [supabase.com](https://supabase.com), lalu jalankan SQL di **SQL Editor**:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE earnings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    dompet_kredit NUMERIC DEFAULT 0,
    dompet_tunai NUMERIC DEFAULT 0,
    ovo_cash NUMERIC DEFAULT 0,
    cash_100k INT DEFAULT 0,
    cash_50k INT DEFAULT 0,
    cash_20k INT DEFAULT 0,
    cash_10k INT DEFAULT 0,
    cash_5k INT DEFAULT 0,
    cash_2k INT DEFAULT 0,
    cash_1k INT DEFAULT 0,
    cash_manual NUMERIC DEFAULT 0,
    total_digital NUMERIC DEFAULT 0,
    total_cash NUMERIC DEFAULT 0,
    total_all NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> ⚠️ **Disable RLS** pada kedua tabel (Table Editor → pilih tabel → RLS disabled).

### 2. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME_KAMU/GrabMaR.git
git push -u origin main
```

### 3. Deploy di Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New Project** → Import repo GitHub
2. Tambahkan **Environment Variables**:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Anon public key dari Supabase |
| `JWT_SECRET` | String random panjang bebas |

3. Klik **Deploy** → Selesai! 🎉

---

## 💻 Local Development

```bash
# 1. Clone & install
git clone https://github.com/USERNAME_KAMU/GrabMaR.git
cd GrabMaR
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env → isi SUPABASE_URL, SUPABASE_KEY, JWT_SECRET

# 3. Jalankan
npm run dev
```

Buka `http://localhost:8000` ✅

## 📁 Struktur File

```
GrabMaR/
├── api/
│   ├── _helpers.js          # Shared utilities (Supabase, JWT, CORS)
│   ├── register.js          # POST /api/register
│   ├── login.js             # POST /api/login
│   ├── save-earning.js      # POST /api/save-earning
│   ├── earnings.js          # GET  /api/earnings
│   └── earning-detail.js    # GET  /api/earning-detail?id=X
├── auth.js                  # Frontend auth helpers
├── script.js                # Calculator & save logic
├── style.css                # All styles
├── index.html               # Home / calculator
├── login.html               # Login page
├── register.html            # Register page
├── history.html             # Riwayat pendapatan
├── server.js                # Local dev server
├── vercel.json              # Vercel routing config
└── package.json             # Dependencies
```

## 📝 License

MIT
