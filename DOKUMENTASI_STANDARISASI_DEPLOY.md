# Dokumentasi Standarisasi Deploy Tools — TalentStream

Dokumen ini memuat rangkuman lengkap implementasi standarisasi, konfigurasi cloud (*Aiven MySQL, Cloudinary, Gemini AI*), **seluruh daftar akun aktif di database lengkap dengan email & password yang siap dicoba untuk login**, serta panduan menjalankan aplikasi.

---

## 1. Konsep & Arsitektur Peran (Role Model B2B SaaS)

Platform TalentStream mengadopsi model bisnis B2B SaaS dengan 2 tingkatan peran:

1. **Super Admin (`SUPER_ADMIN`)**
   * Pemilik / Pengelola Utama Platform TalentStream.
   * Mengontrol seluruh klien perusahaan yang terdaftar, memantau server, mengatur paket langganan, dan memantau masukan/feedback.
2. **Client Admin (`CLIENT_ADMIN`)**
   * Pimpinan atau perwakilan tim rekrutmen dari setiap **perusahaan klien yang membeli/berlangganan tools TalentStream**.
   * Mengelola ruang kerja rekrutmen perusahaannya sendiri (*posting lowongan, screening CV pelamar, wawancara, dan penawaran kerja*).
   * Fitur dan kuotanya disesuaikan otomatis dengan paket yang dibeli (*Free, Pro, atau Enterprise*).

---

## 2. Daftar Lengkap Akun Pengguna di Database (Siap Dicoba Login)

Seluruh akun di bawah ini telah **100% tersimpan di database Aiven MySQL (`talentstream_db.ts_users`)**. Silakan gunakan kredensial berikut untuk menguji login:

---

### 1. Super Administrator (Pemilik / Pengelola Platform)
* **Email / Username :** `superadmin@talentstream.com`
* **Password         :** `admin123`
* **Role             :** `super_admin` (Super Admin)
* **Paket Langganan  :** Enterprise Plan
* **Nomor HP / WA    :** `+62 811-9999-0000`
* **Tab Login        :** Tab **"Super Admin"** (ikon perisai ungu di form login)
* **Hak Akses        :** Memiliki akses ke menu *Manajemen Pengguna* (melihat daftar Client Admin dari berbagai perusahaan, mengubah paket langganan, dan menghapus akun) serta menu *Metrik Sistem*.

---

> [!NOTE]
> **Akun Demo Di-nonaktifkan / Dihapus:** Akun demo (`demo@talentstream.com`) telah dihapus secara permanen dari database produksi untuk menjaga kebersihan data dan keamanan sistem SaaS.

---

### 2. Hana Kusuma (Client Admin)
* **Email / Username :** `hana.kusuma@techcorp.com`
* **Password         :** `password`
* **Role             :** `admin` (Client Admin)
* **Paket Langganan  :** Pro Plan (Kuota: 20 lowongan, 500 pelamar)
* **Nomor HP / WA    :** `+62 812-3456-7891`
* **Tab Login        :** Tab **"Recruiter"**
* **Hak Akses        :** Client Admin dengan akses alur rekrutmen lengkap.

---

### 3. Rizal Firmansyah (Client Admin)
* **Email / Username :** `rizal.firmansyah@startup.id`
* **Password         :** `password`
* **Role             :** `admin` (Client Admin)
* **Paket Langganan  :** Pro Plan (Kuota: 10 lowongan, 300 pelamar)
* **Nomor HP / WA    :** `+62 813-8822-1144`
* **Tab Login        :** Tab **"Recruiter"**
* **Hak Akses        :** Client Admin dengan akses alur rekrutmen lengkap.

---

### 4. Kevin Pratama (Client Admin)
* **Email / Username :** `kevin.pratama@global.io`
* **Password         :** `password`
* **Role             :** `admin` (Client Admin)
* **Paket Langganan  :** Free Plan (Kuota: 3 lowongan, 100 pelamar)
* **Nomor HP / WA    :** `+62 819-5566-7788`
* **Tab Login        :** Tab **"Recruiter"**
* **Hak Akses        :** Client Admin paket gratis.

---

### 5. Tiara Dewi (Client Admin)
* **Email / Username :** `tiara.dewi@fintech.co.id`
* **Password         :** `password`
* **Role             :** `admin` (Client Admin)
* **Paket Langganan  :** Enterprise Plan (Kuota tak terbatas)
* **Nomor HP / WA    :** `+62 821-4455-6677`
* **Tab Login        :** Tab **"Recruiter"**
* **Hak Akses        :** Client Admin paket korporat enterprise.

---

## 3. Panduan Langkah Menguji Login

### A. Untuk Login sebagai Super Admin:
1. Buka browser di `http://localhost:3000/` lalu klik **"Masuk"** di navbar.
2. Di atas form login, pilih tab **"Super Admin"** (warna ungu).
3. Masukkan:
   * **Email:** `superadmin@talentstream.com`
   * **Password:** `admin123`
   *(Atau klik tombol cepat **"Gunakan Demo Super Admin"**)*.
4. Klik tombol **"Masuk sebagai Super Admin"**.
5. Pada sidebar kiri akan muncul menu **Menu Super Admin**:
   * **Manajemen Pengguna**: Menampilkan tabel seluruh Client Admin di atas, dapat mengganti paket langganan (*Free/Pro/Enterprise*), mengubah role, atau menghapus akun.
   * **Metrik Sistem**: Memantau koneksi database Aiven MySQL, Cloudinary, Gemini AI, dan riwayat umpan balik pengguna.

### B. Untuk Login sebagai Client Admin (Perusahaan Klien):
1. Buka halaman login di `http://localhost:3000/`.
2. Pastikan tab yang aktif adalah tab **"Recruiter"** (default).
3. Masukkan salah satu akun di atas, misalnya:
   * **Email:** `hana.kusuma@techcorp.com` (atau `rizal.firmansyah@startup.id` / `kevin.pratama@global.io` / `tiara.dewi@fintech.co.id`)
   * **Password:** `password`
4. Klik **"Sign In"**.
5. Anda akan masuk ke workspace alur rekrutmen (*Requisition, Sourcing, Screening, Selection, Hire*). Menu Super Admin tidak akan ditampilkan.

---

## 4. Konfigurasi Cloud & Backend

* **Database Aiven MySQL :** 
  * Database: `talentstream_db`
  * Host/Port: `mysql-8eb152f-anggi-9a46.f.aivencloud.com:27694`
  * Keamanan: TLS v1.3 SSL Enkripsi aktif
  * Status: **Online & Terkoneksi**
* **Penyimpanan Cloudinary CDN :** 
  * Cloud Name: `dphdphw2c`
  * Folder Penyimpanan: `talentstream_uploads/`
  * Penggunaan: Upload foto profil avatar dan berkas CV pelamar
  * Status: **Aktif**
* **AI Engine Google Gemini :** 
  * Model: `gemini-3.6-flash`
  * Fitur: AI Sourcing, CV Parser, Job Assistant, Offer Letter
  * Status: **Aktif & Terverifikasi**
* **Backend API Laravel 12 :** 
  * Host: `http://127.0.0.1:8000/api`
  * Status: **Aktif**
* **Frontend Vite + React :** 
  * Host: `http://localhost:3000/`
  * Status: **Aktif**

---

## 5. Rekapitulasi 10 Fitur Standarisasi Deploy Tools (100% Selesai)

1. **Free / Pro Bulanan & Tahunan (Landing Page)**
   * Toggle sakelar bulanan vs tahunan dengan diskon 20% otomatis di section Pricing.
   * *File: `components/LandingPage.tsx`*

2. **Dokumen Legalitas & Copyright Contech ID**
   * Modal popup resmi Disclaimer, Terms of Service, Privacy Policy.
   * Copyright resmi: `© 2024 TalentStream. Dibuat oleh Contech ID. All rights reserved.` dengan tautan aktif ke `https://contech.id`.
   * *File: `components/LandingPage.tsx`*

3. **Autentikasi Register & Login Lengkap**
   * Form register dengan Nama Lengkap, Email, No. HP/WhatsApp, dan Password.
   * *File: `components/AuthPage.tsx`*

4. **Edit Profile Lengkap**
   * Modal ganti foto profil terhubung upload Cloudinary, ganti nama, ganti email, ganti password, dan no. HP.
   * *File: `components/EditProfileModal.tsx`, `components/Header.tsx`, `components/SettingsTab.tsx`*

5. **Responsive Mobile, Dark/Light Mode, dan Multi-Bahasa**
   * Toggle tema Dark/Light, toggle Bahasa Indonesia (ID) & English (EN), dan drawer mobile navigasi.
   * *File: `components/Header.tsx`, `components/Sidebar.tsx`*

6. **Auto-Scale Layar Laptop (~80% - 85% Scale)**
   * CSS media query otomatis menyesuaikan skala tampilan ke ~85% pada laptop layar 1024px–1440px agar muat proporsional.
   * *File: `index.css`*

7. **Fitur Backup & Restore Data (di Pengaturan)**
   * Tombol unduh file cadangan JSON dan tombol unggah pemulihan data aplikasi di menu Settings.
   * *File: `components/SettingsTab.tsx`*

8. **Pemisahan Menu & Login Super Admin**
   * Tab login Super Admin terpisah dengan hak akses menu khusus *Manajemen Pengguna* & *Metrik Sistem*.
   * *File: `components/AuthPage.tsx`, `components/Sidebar.tsx`, `components/SuperAdminUserManagement.tsx`*

9. **Feedback di Setiap Tools**
   * Tombol melayang *Beri Masukan* di pojok kanan bawah dengan rating 5 bintang & kategori pesan, tersimpan ke Aiven MySQL.
   * *File: `components/FeedbackWidget.tsx`*

10. **Finishing & Verifikasi**
    * Data dummy siklus rekrutmen lengkap di database dan build TypeScript bersih tanpa error.

---

## 6. Keamanan & Isolasi Data Multi-Tenant (Perusahaan Klien)

TalentStream menerapkan arsitektur **Multi-Tenant Data Isolation** tingkat SaaS Enterprise:

1. **Isolasi Alur Pelamar per Perusahaan (`company_id`)**:
   * Setiap lowongan pekerjaan memiliki tautan publik unik (misal: `http://localhost:3000/?jobId=fsd01`).
   * Ketika seorang kandidat melamar melalui tautan tersebut dan mengunggah CV, data lamarannya otomatis terasosiasi dengan `company_id` milik perusahaan pemilik lowongan.
   * **Jaminan Keamanan**: Perusahaan B tidak akan pernah bisa melihat kandidat, CV, atau riwayat wawancara yang masuk ke lowongan milik Perusahaan A.

2. **Isolasi Backup & Restore Data**:
   * Ketika seorang Client Admin mengunduh berkas cadangan melalui menu *Settings > Backup Data*, sistem hanya mengekspor lowongan, pelamar, dan riwayat yang dimiliki perusahaannya sendiri.
   * Berkas cadangan JSON dilengkapi metadata perusahaan (`company_id`, `company_name`, `exported_at`, `exported_by`).
   * Super Admin memiliki hak istimewa mengekspor cadangan sistem secara menyeluruh.

---

## 7. Kebijakan Penghapusan Akun: Opsi B — Soft Delete / Pengarsipan (Enterprise Standard)

Sesuai standar SaaS Enterprise (ISO 27001 & regulasi kepatuhan ketenagakerjaan), TalentStream mengimplementasikan **Opsi B (Soft Delete / Arsip)** ketika Super Admin menghapus akun Client Admin perusahaan:

* **Tidak Menghapus Data Pelamar**:
  * Data pelamar, CV di Cloudinary, hasil asesmen AI, dan riwayat wawancara **tetap utuh dan aman** di database Aiven MySQL.
  * Hal ini penting agar riwayat lamaran pencari kerja tidak rusak atau hilang mendadak (*data integrity*).
* **Penonaktifan Akses & Lowongan**:
  * Status akun Client Admin diubah menjadi `archived`. Akun tersebut tidak dapat lagi login ke sistem.
  * Seluruh lowongan aktif milik perusahaan otomatis ditutup (`Closed`) sehingga pencari kerja baru tidak dapat melamar ke perusahaan yang sudah tidak aktif.
* **Fitur Pemulihan (Restore) Sekali Klik**:
  * Super Admin dapat membatalkan pengarsipan kapan saja dengan menekan tombol **"Pulihkan"** di panel Manajemen Pengguna Super Admin.
  * Setelah dipulihkan, akun kembali aktif dan lowongannya otomatis dibuka kembali (`Open`).

---

## 8. Cara Menjalankan Aplikasi Secara Lokal

Jika Anda menyalakan ulang komputer:

### 1. Jalankan Backend Laravel:
```powershell
cd "d:\3. Software\Programming\Antigravity\Tugas KP\Tugas 28 Agustus Tools\TalentStream-main\backend"
php artisan serve --port=8000
```

### 2. Jalankan Frontend React:
```powershell
cd "d:\3. Software\Programming\Antigravity\Tugas KP\Tugas 28 Agustus Tools\TalentStream-main"
npm run dev
```

Buka aplikasi di peramban browser Anda: **`http://localhost:3000`**

---
*Dokumen ini merupakan dokumentasi resmi dari proyek standarisasi deployment TalentStream.*
