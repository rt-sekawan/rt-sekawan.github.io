// catat-jimpitan.js
let mode = 'READ_ONLY';
let dataWarga = [];
let selectedTanggal = '';
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('tanggal').value = today;
  document.getElementById('tanggal').addEventListener('change', loadData);
  document.getElementById('checkAll').addEventListener('click', () => setAllCheckboxes(true));
  document.getElementById('uncheckAll').addEventListener('click', () => setAllCheckboxes(false));
  document.getElementById('selesaiBtn').addEventListener('click', saveJimpitan);
  document.getElementById('search').addEventListener('input', filterTable);
  loadData();
});

function loadData() {
  const tanggal = document.getElementById('tanggal').value;
  selectedTanggal = tanggal;
  // Cek draft lokal dulu
  getDraftsByTanggal(tanggal).then(drafts => {
    if (drafts.length > 0) {
      // restore draft
      dataWarga = drafts[0].data;
      renderTable();
      document.getElementById('modeInfo').textContent = 'Draft ditemukan. Lanjutkan?';
      return;
    }
    // Fetch dari server
    callApi('getJimpitan', { tanggal }).then(res => {
      if (res.success) {
        dataWarga = res.data;
        document.getElementById('petugas').textContent = res.petugas.nama;
        checkMode(res.petugas);
        renderTable();
      }
    });
  });
}

function checkMode(petugas) {
  mode = 'READ_ONLY';
  if (user.role === 'ADMIN' || user.role === 'BENDAHARA') {
    mode = 'EDIT';
  } else if (user.role === 'USER' && user.warga_id === petugas.warga_id) {
    if (new Date(selectedTanggal).toDateString() === new Date().toDateString()) {
      mode = 'EDIT';
    }
  }
  document.getElementById('modeInfo').textContent = mode === 'READ_ONLY' ? 'Read Only' : 'Mode Edit';
  toggleInputs(mode === 'EDIT');
}

function toggleInputs(enabled) {
  document.querySelectorAll('#wargaTable input').forEach(input => input.disabled = !enabled);
  document.getElementById('selesaiBtn').disabled = !enabled;
}

function renderTable() {
  const tbody = document.querySelector('#wargaTable tbody');
  tbody.innerHTML = '';
  dataWarga.forEach((w, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${w.nama} (${w.nomor_rumah})</td>
      <td><input type="checkbox" ${w.status_pembayaran === 'PAID' ? 'checked' : ''}></td>
      <td><input type="number" value="${w.deposit}" min="0"></td>
    `;
    tbody.appendChild(tr);
  });
  filterTable();
}

function filterTable() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const rows = document.querySelectorAll('#wargaTable tbody tr');
  rows.forEach(tr => {
    const nama = tr.children[1].textContent.toLowerCase();
    tr.style.display = nama.includes(keyword) ? '' : 'none';
  });
}

function setAllCheckboxes(value) {
  document.querySelectorAll('#wargaTable tbody input[type="checkbox"]').forEach(cb => cb.checked = value);
}

function saveJimpitan() {
  if (mode !== 'EDIT') return;
  const tbody = document.querySelector('#wargaTable tbody');
  const rows = tbody.querySelectorAll('tr');
  const payload = [];
  rows.forEach((tr, i) => {
    const checkbox = tr.querySelector('input[type="checkbox"]');
    const depositInput = tr.querySelector('input[type="number"]');
    const warga = dataWarga[i];
    payload.push({
      warga_id: warga.warga_id,
      status: checkbox.checked ? 'PAID' : 'HUTANG',
      deposit: parseFloat(depositInput.value) || 0
    });
  });
  
  const idempotency_key = generateUUID();
  const dataToSend = {
    tanggal: selectedTanggal,
    data: payload,
    idempotency_key
  };
  
  // Coba kirim ke server
  callApi('saveJimpitan', dataToSend, 'POST').then(res => {
    if (res.success) {
      alert('Data tersimpan');
      // Hapus draft jika ada
    } else {
      alert(res.message || 'Gagal menyimpan');
    }
  }).catch(err => {
    // Simpan ke draft offline
    saveDraft({
      tanggal: selectedTanggal,
      data: payload,
      idempotency_key
    }).then(() => {
      alert('Koneksi gagal. Data disimpan sebagai draft offline.');
    });
  });
}