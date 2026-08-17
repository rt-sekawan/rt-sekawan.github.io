// auth.js

// Ingat Saya: kalau dicentang, USERNAME (bukan password, demi keamanan)
// disimpan supaya otomatis terisi lagi lain kali. Isi ulang saat halaman dibuka.
document.addEventListener('DOMContentLoaded', () => {
  const rememberedUsername = localStorage.getItem('remembered_username');
  if (rememberedUsername) {
    document.getElementById('username').value = rememberedUsername;
    document.getElementById('rememberMe').checked = true;
  }
});

// Tombol lihat/sembunyikan password
document.getElementById('togglePassword').addEventListener('click', () => {
  const passwordInput = document.getElementById('password');
  const btn = document.getElementById('togglePassword');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    btn.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    btn.textContent = '👁';
  }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  try {
    const data = await callApi('login', { username, password }, 'POST');
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (rememberMe) {
        localStorage.setItem('remembered_username', username);
      } else {
        localStorage.removeItem('remembered_username');
      }
      const role = data.user.role;
      if (role === 'ADMIN') window.location.href = 'pages/admin/dashboard.html';
      else if (role === 'BENDAHARA') window.location.href = 'pages/bendahara/dashboard.html';
      else window.location.href = 'pages/user/dashboard.html';
    } else {
      document.getElementById('error').textContent = data.message;
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Gagal terhubung ke server';
  }
});
