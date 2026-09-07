<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TalentStream - Multi-Tenant ATS & Recruitment Platform

TalentStream adalah platform rekrutmen berbasis SaaS yang dilengkapi dengan fitur *Applicant Tracking System* (ATS), integrasi *Artificial Intelligence* (Gemini AI) untuk otomatisasi *sourcing* dan penyaringan kandidat, serta sistem multi-tenant yang aman.

## Menjalankan Aplikasi Lokal

**Prasyarat:** Node.js, PHP, Composer, dan MySQL.

1. **Frontend (React/Vite):**
   `ash
   npm install
   npm run dev
   `
   *(Pastikan variabel VITE_GEMINI_API_KEY diatur di .env.local untuk mengaktifkan fitur AI)*

2. **Backend (Laravel):**
   `ash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate:fresh --seed
   php artisan serve
   `

## Akun Demo untuk Pengujian (Login)

Gunakan kredensial berikut untuk menguji sistem. Selain akun di bawah ini, Anda juga dapat membuat akun perusahaan (klien) baru melalui halaman **Register**.

### 1. Super Admin
Dapat mengelola semua klien, paket langganan (Pro/Enterprise), serta melakukan arsip akun klien (Soft Delete).
- **Email:** superadmin@talentstream.com
- **Password:** dmin123 atau password

### 2. Client Admin (Recruiter Demo)
Akses ke dashboard perusahaan (klien), manajamen lowongan, papan Kanban pelamar, dan integrasi AI Sourcing.
- **Email:** demo@talentstream.com
- **Password:** password

### 3. Akun Klien Lainnya (Multi-Tenant Test)
Untuk menguji isolasi data multi-tenant secara menyeluruh, Anda dapat:
1. Masuk ke halaman **Register**.
2. Daftarkan akun baru (contoh: hr@startup.com dengan password password).
3. Login dan Anda akan melihat dashboard yang sepenuhnya kosong dan terisolasi dari klien lain (Demo).

---
*Proyek dikembangkan dengan React, TypeScript, Tailwind CSS, dan Laravel (MySQL).*
