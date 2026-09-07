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
php artisan serve
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

## 👤 Akun Demo untuk Pengujian

### ✅ Super Admin
Akses penuh: kelola semua klien, ubah paket langganan, arsip/pulihkan akun.

| Field    | Value                                |
|----------|--------------------------------------|
| Email    | `superadmin@talentstream.com`        |
| Password | `admin123` atau `password`           |
| Role     | `super_admin`                        |
| Paket    | Enterprise (Tidak terbatas)          |

*(Alias: `admin@talentstream.com` juga bisa digunakan)*

---

### ✅ Client Admin — Demo Recruiter
Akses dashboard klien dengan data demo lengkap (lowongan, kandidat, pipeline rekrutmen).

| Field    | Value                        |
|----------|------------------------------|
| Email    | `demo@talentstream.com`      |
| Password | `password`                   |
| Role     | `admin` (Client)             |
| Paket    | Pro                          |
| Company  | TalentStream Demo Corp       |

---

### 🏢 Akun Klien Seed (Multi-Tenant Test)
Akun-akun berikut dibuat otomatis oleh migration untuk menguji isolasi data antar tenant.  
**Catatan:** Password akun ini **tidak di-seed** di database, sehingga tidak bisa digunakan untuk login langsung.  
Untuk mengujinya, gunakan fitur **Register** untuk membuat akun perusahaan baru.

| ID       | Nama                 | Perusahaan                  | Data Terkait                         |
|----------|----------------------|-----------------------------|--------------------------------------|
| user-02  | Sarah Jenkins        | TechCorp Solutions          | Lowongan: PM, UI/UX Designer         |
| user-03  | Budi Santoso         | Nusantara Tech Startup      | Lowongan: Full-Stack Dev, CSS        |
| user-04  | Alex Rivera          | Global Innovations Ltd      | Lowongan: Digital Marketing Mgr      |
| user-05  | *(nama bebas)*       | Fintech Prima Indonesia     | *(Tidak ada lowongan terkait)*       |

---

### ➕ Membuat Akun Klien Baru (Tenant Baru)
1. Buka halaman Register di aplikasi.
2. Daftarkan akun dengan email dan perusahaan baru.
3. Login — dashboard akan **kosong dan terisolasi** dari klien lain secara otomatis.

---

## 🌐 Environment Variables

Berikut variabel yang wajib dikonfigurasi (jangan commit nilai aslinya ke Git):

### Frontend (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (`backend/.env`)
```env
APP_NAME=TalentStream
APP_ENV=local
APP_KEY=          # Di-generate otomatis via: php artisan key:generate
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

| Layer     | Teknologi                                          |
|-----------|----------------------------------------------------|
| Frontend  | React 18, TypeScript, Tailwind CSS, Vite, Framer Motion |
| Backend   | Laravel 11, PHP 8.2, Laravel Sanctum (Auth Token) |
| Database  | MySQL (Aiven Cloud atau lokal)                     |
| AI        | Google Gemini API (Sourcing, CV Parsing, Job Description) |
| Storage   | Cloudinary (Upload CV/File)                        |

---

*Dikembangkan sebagai proyek KP (Kerja Praktik). Lisensi MIT.*
