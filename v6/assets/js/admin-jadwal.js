// admin-jadwal.js
async function generateJadwal() {
  const tahun = document.getElementById('tahun').value;
  const res = await callApi('generateJadwal', { tahun }, 'POST');
  if (res.success) {
    showAlert(`Jadwal berhasil dibuat: ${res.count} hari`, 'success');
    loadJadwal();
  } else {
    showAlert(res.message, 'error');
  }
}

async function regenerateJadwal() {
  const tahun = document.getElementById('tahun').value;
  const mulaiTanggal = document.getElementById('mulaiTanggal').value;
  if (!mulaiTanggal) {
    showAlert('Pilih tanggal mulai', 'warning');
    return;
  }
  const res = await callApi('regenerateJadwal', { tahun, mulai_tanggal: mulaiTanggal }, 'POST');
  if (res.success) {
    showAlert(`Jadwal berhasil di-regenerate: ${res.count} hari`, 'success');
    loadJadwal();
  } else {
    showAlert(res.message, 'error');
  }
}

async function loadJadwal() {
  const tanggal = document.getElementById('tanggalFilter').value;
  const params = {};
  if (tanggal) params.tanggal = tanggal;
  
  const res = await callApi('getJadwal', params);
  if (res.success) {
    const tbody = document.querySelector('#jadwalTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(j => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatTanggal(j.tanggal)}</td>
        <td>${j.nama_snapshot}</td>
        <td>${j.status}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Init
loadJadwal();