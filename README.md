<div align="center">
<img width="1200" height="475" alt="TalentStream Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# TalentStream
### Multi-Tenant ATS & AI-Powered Recruitment Platform

![Laravel](https://img.shields.io/badge/Backend-Laravel_11-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/Frontend-React_+_TypeScript-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)

</div>

---

TalentStream adalah platform rekrutmen berbasis **SaaS multi-tenant** yang dilengkapi dengan:
- **ATS (Applicant Tracking System)** — Papan Kanban untuk melacak kandidat per tahap rekrutmen.
- **AI Sourcing & CV Parsing** — Integrasi Gemini AI untuk otomatisasi pencarian dan penyaringan kandidat.
- **Multi-Tenant Isolation** — Setiap perusahaan klien memiliki data yang sepenuhnya terisolasi di level database.
- **Super Admin Panel** — Pengelolaan klien, paket langganan, dan arsip akun (Soft Delete).

---

## 🗂️ Struktur Proyek

```
talentstream-main/
├── backend/                  # Laravel 11 (API Backend)
│   ├── app/
│   │   ├── Http/Controllers/Api/   # AuthController, JobController, dst.
│   │   └── Models/                 # User, Job, Application, Candidate, dst.
│   ├── database/
│   │   ├── migrations/             # Skema tabel MySQL
│   │   └── seeders/                # Data awal (DatabaseSeeder.php)
│   └── routes/api.php              # Semua endpoint REST API
├── components/               # React Components (UI)
├── hooks/                    # Custom React Hooks (AI, localStorage)
├── services/api.ts           # Semua pemanggilan HTTP ke Backend
├── types.ts                  # TypeScript type definitions
└── App.tsx                   # Root component & state management
```

---

## ⚙️ Setup & Instalasi

### Prasyarat
- Node.js >= 18
- PHP >= 8.2
- Composer
- MySQL (atau Aiven MySQL untuk cloud)

### 1. Frontend (React + Vite)

```bash
# Install dependencies
npm install

# Buat file environment
cp .env.example .env.local
# Isi VITE_GEMINI_API_KEY dan VITE_API_BASE_URL di .env.local

# Jalankan dev server
npm run dev
```

### 2. Backend (Laravel)

```bash
cd backend

# Install dependencies PHP
composer install

# Salin dan konfigurasi .env
cp .env.example .env
# Isi DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD di .env

# Generate application key
php artisan key:generate

# Jalankan server
php artisan serve --port=8000
```

---

## 🗄️ Migrasi & Seeder Database

Jalankan perintah berikut **secara berurutan** untuk menyiapkan struktur tabel dan mengisi data awal:

```bash
# 1. Jalankan semua migration (membuat seluruh tabel)
php artisan migrate

# 2. Jalankan seeder (mengisi data demo: stages, jobs, kandidat, dll.)
php artisan db:seed

# --- ATAU jalankan keduanya sekaligus ---
php artisan migrate:fresh --seed
```

> ⚠️ **Peringatan:** `migrate:fresh` akan **menghapus seluruh data** dan membuat ulang dari nol. Gunakan hanya di environment development.

Jika hanya ingin menambahkan data demo tanpa reset tabel:
```bash
php artisan db:seed --class=DatabaseSeeder
```

---

## 👤 Akun untuk Pengujian (Login)

### ✅ Super Admin
Akses penuh: kelola semua klien, ubah paket langganan, arsip/pulihkan akun.

| Field    | Value                                |
|----------|--------------------------------------|
| Email    | `superadmin@talentstream.com`        |
| Password | `admin123` atau `password`           |
| Role     | `super_admin`                        |
| Paket    | Enterprise (Tidak terbatas)          |

> *(Alias: `admin@talentstream.com` juga bisa digunakan dengan password yang sama)*

> **Catatan:** Akun Super Admin dibuat **otomatis saat pertama kali login** — tidak perlu seed database terlebih dahulu.

---

### ✅ Client Admin — Akun Klien
Akun klien perusahaan **dibuat melalui halaman Register** atau langsung di database.  
Setelah terdaftar, setiap klien hanya dapat melihat data milik perusahaannya sendiri (isolasi multi-tenant).

Contoh cara membuat akun klien baru:
1. Buka halaman Login → klik **Sign Up / Register**
2. Isi nama, email perusahaan, nomor telepon, dan password (min. 6 karakter)
3. Login — dashboard akan otomatis kosong dan terisolasi dari klien lain

> **Tidak ada akun klien default yang di-seed.** Semua akun klien harus dibuat sendiri melalui Register atau diinput langsung ke database.

---

### 📋 Data Demo yang Di-seed (Bukan Akun Login)

Seeder (`DatabaseSeeder.php`) mengisi data referensi berikut — **ini bukan akun login**, hanya data pengisi untuk keperluan demo tampilan:

| Tipe Data | Isi |
|-----------|-----|
| **Tahapan Rekrutmen** | Applied, Screening, Assessment, Interview, Offer, Hired |
| **Lowongan** | Full-Stack Developer, Customer Support, UI/UX Designer, Product Manager, Digital Marketing Manager |
| **Kandidat Demo** | Anya Forger, Loid Forger, Becky Blackbell, Maya Sari, dan lainnya (data fiktif) |
| **Pewawancara** | Alex Greene, Brenda Smith, Charles Brown, Diana Prince, dst. |

---

## 🌐 Environment Variables

### Frontend (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (`backend/.env`)
```env
APP_NAME=TalentStream
APP_ENV=local
APP_KEY=          # Di-generate otomatis: php artisan key:generate
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=talentstream
DB_USERNAME=root
DB_PASSWORD=

# Opsional: untuk fitur upload CV/file
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🔌 Endpoint API Utama

| Method | Endpoint                    | Keterangan                        |
|--------|-----------------------------|-----------------------------------|
| POST   | `/api/login`                | Login pengguna                    |
| POST   | `/api/register`             | Daftar akun klien baru            |
| GET    | `/api/jobs`                 | Ambil semua lowongan              |
| POST   | `/api/jobs`                 | Buat lowongan baru                |
| GET    | `/api/candidates`           | Ambil data kandidat               |
| POST   | `/api/applications`         | Submit lamaran dari Career Site   |
| PATCH  | `/api/applications/{id}`    | Update status/stage kandidat      |
| GET    | `/api/users`                | Daftar klien (Super Admin only)   |
| PATCH  | `/api/users/{id}`           | Update paket/role klien           |
| DELETE | `/api/users/{id}`           | Arsipkan (soft delete) klien      |
| POST   | `/api/upload`               | Upload file CV ke Cloudinary      |

---

## 📦 Tech Stack

| Layer     | Teknologi                                                       |
|-----------|-----------------------------------------------------------------|
| Frontend  | React 18, TypeScript, Tailwind CSS, Vite, Framer Motion         |
| Backend   | Laravel 11, PHP 8.2, Laravel Sanctum (Auth Token)              |
| Database  | MySQL (Aiven Cloud atau lokal)                                  |
| AI        | Google Gemini API (Sourcing, CV Parsing, Job Description)       |
| Storage   | Cloudinary (Upload CV/File)                                     |

---

*Dikembangkan sebagai proyek KP (Kerja Praktik). Lisensi MIT.*
