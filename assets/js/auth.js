// auth.js
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const data = await callApi('login', { username, password }, 'POST');
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
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