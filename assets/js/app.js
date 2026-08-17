// app.js - Utilitas umum frontend
function generateUUID() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatRupiah(angka) {
  return 'Rp' + angka.toLocaleString('id-ID');
}

function formatTanggal(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Format lengkap dengan nama hari, mis. "Sabtu, 15 Agustus 2026" — dipakai di
// bukti tugas selesai.
function formatTanggalLengkap(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatJamSekarang() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

// Popup notifikasi (sukses/error/peringatan) — tampil sebagai MODAL dengan
// tombol tutup, dan otomatis hilang sendiri setelah 5 detik kalau tidak
// ditutup manual. Dipakai oleh SEMUA pesan di aplikasi (bukan alert() bawaan
// browser), supaya tampilannya konsisten.
function showAlert(message, type = 'success') {
  const existing = document.getElementById('appAlertOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'appAlertOverlay';
  overlay.className = 'modal-overlay alert-overlay';
  overlay.innerHTML = `
    <div class="modal-box alert-box alert-box-${type}">
      <button type="button" class="alert-close-btn" aria-label="Tutup">×</button>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const remove = () => overlay.remove();
  overlay.querySelector('.alert-close-btn').addEventListener('click', remove);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) remove(); });
  setTimeout(remove, 5000);
}

// Label peran untuk TAMPILAN saja. Nilai role di database TETAP 'USER'
// (supaya tidak perlu migrasi data & logika permission di seluruh sistem),
// tapi di layar selalu ditampilkan sebagai "WARGA" sesuai istilah yang
// dipakai warga sehari-hari.
function roleLabel(role) {
  const map = { USER: 'WARGA', ADMIN: 'ADMIN', BENDAHARA: 'BENDAHARA' };
  return map[role] || role;
}

// Popup "Hubungi Admin/Bendahara" — dipakai saat warga tidak bisa lagi
// mengedit catatan jimpitan (di luar masa edit / tanggal masa depan).
// Sederhana dulu (overlay + tombol tutup); akan dirapikan lagi jadi modal
// standar di tahap perbaikan UX berikutnya.
function showContactAdminModal(message) {
  const existing = document.getElementById('contactAdminModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'contactAdminModalOverlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Tidak Bisa Diedit</h3>
      <p>${message}</p>
      <p>Silakan hubungi <strong>Admin</strong> atau <strong>Bendahara</strong> RT untuk mengedit data ini.</p>
      <button type="button" id="contactAdminModalClose">Tutup</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('contactAdminModalClose').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || !user.user_id) {
    window.location.href = '../../index.html';
    return null;
  }
  return user;
}

function logout() {
  const token = localStorage.getItem('token');
  if (token) {
    callApi('logout', { token }, 'POST').finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '../../index.html';
    });
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../../index.html';
  }
}

// Toggle dark mode
function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  document.body.setAttribute('data-theme', newTheme);
}

// Init theme
document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', theme);
});

// Register service worker (PWA offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = window.location.pathname.includes('/pages/') ? '../../service-worker.js' : 'service-worker.js';
    navigator.serviceWorker.register(swPath).catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}