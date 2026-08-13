// admin-warga.js
let allWargaData = [];

async function loadWarga() {
  const res = await callApi('getWarga', {});
  if (res.success) {
    allWargaData = res.data;
    const tbody = document.querySelector('#wargaTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${w.warga_id}</td>
        <td>${w.nama}</td>
        <td>${w.nomor_rumah}</td>
        <td>${w.status}</td>
        <td><button type="button" onclick="editWarga('${w.warga_id}')">Edit</button></td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    showAlert(res.message || 'Gagal memuat data warga', 'error');
  }
}

function editWarga(warga_id) {
  const warga = allWargaData.find(w => w.warga_id === warga_id);
  if (!warga) return;
  document.getElementById('warga_id').value = warga.warga_id;
  document.getElementById('nama').value = warga.nama || '';
  document.getElementById('nomor_rumah').value = warga.nomor_rumah || '';
  document.getElementById('user_id').value = warga.user_id || '';
  document.getElementById('status').value = warga.status || 'ACTIVE';
  window.scrollTo(0, 0);
}

function resetWargaForm() {
  document.getElementById('wargaForm').reset();
  document.getElementById('warga_id').value = '';
}

document.getElementById('wargaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    warga_id: document.getElementById('warga_id').value,
    nama: document.getElementById('nama').value,
    nomor_rumah: document.getElementById('nomor_rumah').value,
    user_id: document.getElementById('user_id').value,
    status: document.getElementById('status').value
  };
  let res;
  if (data.warga_id) {
    res = await callApi('updateWarga', data, 'POST');
  } else {
    res = await callApi('createWarga', data, 'POST');
  }
  if (res.success) {
    showAlert('Data warga tersimpan', 'success');
    resetWargaForm();
  } else {
    showAlert(res.message || 'Gagal menyimpan data warga', 'error');
  }
  loadWarga();
});

loadWarga();