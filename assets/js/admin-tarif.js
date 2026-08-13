// admin-tarif.js
async function createTarif() {
  const data = {
    tanggal_aktif: document.getElementById('tanggalAktif').value,
    nominal: parseFloat(document.getElementById('nominal').value)
  };
  
  if (!data.tanggal_aktif || isNaN(data.nominal) || data.nominal < 0) {
    showAlert('Isi tanggal dan nominal', 'warning');
    return;
  }
  
  const res = await callApi('createTarif', data, 'POST');
  if (res.success) {
    showAlert('Tarif berhasil disimpan', 'success');
    document.getElementById('tanggalAktif').value = '';
    document.getElementById('nominal').value = '';
    loadTarif();
  } else {
    showAlert(res.message, 'error');
  }
}

async function loadTarif() {
  const res = await callApi('getTarif', {});
  if (res.success) {
    const tbody = document.querySelector('#tarifTable tbody');
    tbody.innerHTML = '';
    res.data.sort((a, b) => new Date(b.tanggal_aktif) - new Date(a.tanggal_aktif));
    res.data.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatTanggal(t.tanggal_aktif)}</td>
        <td>${formatRupiah(t.nominal)}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

loadTarif();