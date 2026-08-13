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

function showAlert(message, type = 'success') {
  const div = document.createElement('div');
  div.className = `alert alert-${type}`;
  div.textContent = message;
  document.body.insertBefore(div, document.body.firstChild);
  setTimeout(() => div.remove(), 5000);
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