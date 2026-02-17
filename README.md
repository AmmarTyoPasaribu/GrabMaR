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
