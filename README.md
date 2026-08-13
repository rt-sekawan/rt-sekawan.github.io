# rt-sekawan.github.io
Website RT 04 Dusun Kebonsalak Desa Purwosari

# Sistem Digital Jimpitan Desa

<div align="center">

![Version](https://img.shields.io/badge/version-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-orange.svg)

**Sistem pencatatan jimpitan, hutang, deposit, jadwal petugas, kas, dan laporan keuangan desa**

</div>

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Role Pengguna](#role-pengguna)
- [Struktur Database](#struktur-database)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
- [Aturan Bisnis](#aturan-bisnis)
- [Keamanan](#keamanan)
- [Offline Mode](#offline-mode)
- [Pengembangan](#pengembangan)
- [Lisensi](#lisensi)

---

## 🏠 Tentang Aplikasi

Sistem Digital Jimpitan Desa adalah aplikasi web progresif (PWA) yang dirancang untuk mengotomatisasi proses pencatatan jimpitan (iuran rutin warga desa). Aplikasi ini menggantikan metode manual menggunakan buku dengan sistem digital yang terintegrasi.

### Latar Belakang

Program jimpitan merupakan kegiatan pengumpulan iuran rutin warga desa. Setiap rumah warga memiliki kewajiban membayar jimpitan berdasarkan tarif yang berlaku (misalnya Rp500 per hari). Sistem manual memiliki banyak permasalahan:

- Pencatatan manual rawan salah
- Petugas berbeda setiap hari
- Sulit mengetahui hutang setiap warga
- Deposit warga harus dihitung manual
- Perubahan tarif berpotensi merusak histori
- Laporan harus direkap manual
- Histori tahunan sulit dikelola

Aplikasi ini hadir untuk menyelesaikan semua permasalahan tersebut.

---

## ✨ Fitur Utama

### 1. Manajemen Warga
- CRUD data warga
- Nomor rumah unik
- Status aktif/nonaktif
- Histori tetap tersimpan

### 2. Jadwal Otomatis
- Generate jadwal satu tahun penuh
- Sistem rotasi round-robin
- Regenerate jadwal dari tanggal tertentu
- Jadwal permanen per tahun

### 3. Pencatatan Jimpitan
- Validasi petugas berdasarkan jadwal
- Centang semua / hapus semua
- Live search warga
- Read-only mode untuk bukan petugas
- Validasi backend (bukan hanya frontend)

### 4. Hutang
- Pencatatan hutang otomatis
- Pembayaran hutang dengan metode FIFO
- Pembayaran sebagian
- Hutang lintas tahun (carry forward)

### 5. Deposit
- Pencatatan deposit masuk
- Penggunaan deposit otomatis
- Saldo deposit real-time
- Tidak bisa negatif

### 6. Tarif
- Tarif berdasarkan tanggal aktif
- Snapshot tarif per transaksi
- Perubahan tarif tidak merusak histori

### 7. Kas & Penarikan
- Saldo kas otomatis dari transaksi
- Penarikan kas oleh bendahara/admin
- Penerima harus dari database warga
- Validasi saldo cukup

### 8. Laporan
- Laporan bulanan, tahunan, custom range
- Ringkasan keuangan
- Laporan hutang & deposit
- Cetak PDF

### 9. Offline Mode
- Draft tersimpan di IndexedDB
- Retensi 48 jam
- Recovery setelah HP mati
- Sinkronisasi otomatis

### 10. Audit Trail
- Pencatatan semua aktivitas penting
- Log koreksi
- Riwayat login
- Tidak bisa dihapus

### 11. Multi-Tahun
- Sheet terpisah per tahun
- Opening balance otomatis
- Histori tidak berubah
- Saldo carry forward

### 12. Keamanan
- Password hashing (PBKDF2-style)
- Session token
- Rate limiting login
- Role-based access control
- HTTPS

---

## 🏗 Arsitektur Sistem

```mermaid
graph TD
    A[User Smartphone] --> B[Browser/PWA]
    B --> C[GitHub Pages]
    C --> D[Google Apps Script]
    D --> E[Google Sheets]
    B --> F[IndexedDB]
    F --> C
