// admin-users.js
const user = checkAuth();

let allUsersData = [];
let selectedWargaId = '';
let searchDebounceTimer = null;

async function loadUsers() {
  const res = await callApi('getUserList', {});
  if (res.success) {
    allUsersData = res.data;
    renderUserTable(allUsersData);
  } else {
    showAlert(res.message || 'Gagal memuat data user', 'error');
  }
}

function renderUserTable(list) {
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';
  list.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.warga_nama || '-'}</td>
      <td>${roleLabel(u.role)}</td>
      <td>${u.status}</td>
      <td>${u.last_login ? formatTanggal(u.last_login) : '-'}</td>
      <td><button type="button" onclick="editUserById('${u.user_id}')">Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('userTableFilter').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allUsersData.filter(u =>
    (u.username || '').toLowerCase().includes(keyword) ||
    (u.warga_nama || '').toLowerCase().includes(keyword)
  );
  renderUserTable(filtered);
});

function editUserById(user_id) {
  const u = allUsersData.find(x => x.user_id === user_id);
  if (!u) return;
  fillFormFromUser(u);
  document.getElementById('wargaSearch').value = u.warga_nama || '';
  document.getElementById('wargaSelectedInfo').textContent =
    `Rumah No. ${u.warga_nomor_rumah || '-'} — mode edit user yang sudah ada.`;
  window.scrollTo(0, 0);
}

function fillFormFromUser(u) {
  selectedWargaId = u.warga_id || '';
  document.getElementById('user_id_field').value = u.user_id || '';
  document.getElementById('warga_id_field').value = u.warga_id || '';
  document.getElementById('username').value = u.username || '';
  document.getElementById('role').value = u.role || 'USER';
  document.getElementById('status').value = u.status || 'ACTIVE';
  document.getElementById('password').value = '';
  document.getElementById('password').required = false;
  document.getElementById('password').placeholder = 'Kosongkan jika tidak ganti password';
}

function resetUserForm() {
  document.getElementById('userForm').reset();
  document.getElementById('user_id_field').value = '';
  document.getElementById('warga_id_field').value = '';
  document.getElementById('wargaSearch').value = '';
  document.getElementById('wargaSearchResults').innerHTML = '';
  document.getElementById('wargaSearchResults').classList.remove('active');
  document.getElementById('wargaSelectedInfo').textContent = 'Ketik minimal 1 huruf untuk mencari warga.';
  document.getElementById('password').required = true;
  document.getElementById('password').placeholder = 'Password';
  selectedWargaId = '';
}

// Live search warga (dropdown, bukan input manual)
document.getElementById('wargaSearch').addEventListener('input', (e) => {
  const keyword = e.target.value.trim();
  document.getElementById('warga_id_field').value = '';
  selectedWargaId = '';
  document.getElementById('wargaSelectedInfo').textContent = 'Ketik minimal 1 huruf untuk mencari warga.';
  clearTimeout(searchDebounceTimer);

  const resultsBox = document.getElementById('wargaSearchResults');
  if (!keyword) {
    resultsBox.innerHTML = '';
    resultsBox.classList.remove('active');
    return;
  }

  searchDebounceTimer = setTimeout(async () => {
    const res = await callApi('searchWarga', { keyword });
    resultsBox.innerHTML = '';
    if (res.success && res.data.length > 0) {
      res.data.forEach(w => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.textContent = `${w.nama} — Rumah No. ${w.nomor_rumah}`;
        item.addEventListener('click', () => selectWarga(w));
        resultsBox.appendChild(item);
      });
      resultsBox.classList.add('active');
    } else {
      resultsBox.innerHTML = '<div class="search-result-empty">Warga tidak ditemukan</div>';
      resultsBox.classList.add('active');
    }
  }, 300);
});

function selectWarga(w) {
  selectedWargaId = w.warga_id;
  document.getElementById('wargaSearch').value = w.nama;
  document.getElementById('warga_id_field').value = w.warga_id;
  document.getElementById('wargaSearchResults').innerHTML = '';
  document.getElementById('wargaSearchResults').classList.remove('active');

  // Kalau warga ini sudah punya akun user, otomatis masuk mode edit
  const existingUser = allUsersData.find(u => u.warga_id === w.warga_id);
  if (existingUser) {
    fillFormFromUser(existingUser);
    document.getElementById('wargaSelectedInfo').textContent =
      `Rumah No. ${w.nomor_rumah} — akun untuk warga ini sudah ada, data otomatis terisi (mode edit).`;
  } else {
    document.getElementById('user_id_field').value = '';
    document.getElementById('username').value = '';
    document.getElementById('role').value = 'USER';
    document.getElementById('status').value = 'ACTIVE';
    document.getElementById('password').value = '';
    document.getElementById('password').required = true;
    document.getElementById('password').placeholder = 'Password';
    document.getElementById('wargaSelectedInfo').textContent =
      `Rumah No. ${w.nomor_rumah} — belum punya akun, akan dibuat baru.`;
  }
}

// Tutup dropdown pencarian saat klik di luar area
document.addEventListener('click', (e) => {
  const box = document.getElementById('wargaSearchResults');
  const input = document.getElementById('wargaSearch');
  if (e.target !== input && !box.contains(e.target)) {
    box.innerHTML = '';
    box.classList.remove('active');
  }
});

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const wargaId = document.getElementById('warga_id_field').value;
  if (!wargaId) {
    showAlert('Pilih warga dari hasil pencarian terlebih dahulu', 'error');
    return;
  }

  const userId = document.getElementById('user_id_field').value;
  const data = {
    username: document.getElementById('username').value,
    role: document.getElementById('role').value,
    status: document.getElementById('status').value,
    warga_id: wargaId
  };

  let res;
  if (userId) {
    data.user_id = userId;
    const newPassword = document.getElementById('password').value;
    if (newPassword) data.new_password = newPassword;
    res = await callApi('updateUser', data, 'POST');
  } else {
    data.password = document.getElementById('password').value;
    res = await callApi('createUser', data, 'POST');
  }

  if (res.success) {
    showAlert('Data user tersimpan', 'success');
    resetUserForm();
    await loadUsers();
  } else {
    showAlert(res.message || 'Gagal menyimpan data user', 'error');
  }
});

loadUsers();
