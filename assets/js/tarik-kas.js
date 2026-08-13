// tarik-kas.js
let allWarga = [];

async function loadSaldo() {
  const res = await callApi('getCashBalance', {});
  if (res.success) {
    document.getElementById('saldoKas').textContent = formatRupiah(res.saldo_kas);
  }
}

async function loadWarga() {
  const res = await callApi('getWarga', {});
  if (res.success) {
    allWarga = res.data.filter(w => w.status === 'ACTIVE');
    populateSelect(allWarga);
  }
}

function populateSelect(wargaList) {
  const select = document.getElementById('wargaSelect');
  select.innerHTML = '<option value="">Pilih Warga</option>';
  wargaList.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.warga_id;
    opt.textContent = `${w.nama} (Rumah ${w.nomor_rumah})`;
    select.appendChild(opt);
  });
}

function searchWarga() {
  const keyword = document.getElementById('searchWarga').value.toLowerCase();
  const filtered = allWarga.filter(w => 
    w.nama.toLowerCase().includes(keyword) || 
    w.nomor_rumah.includes(keyword)
  );
  populateSelect(filtered);
}

async function loadRiwayat() {
  const res = await callApi('getCashWithdrawals', {});
  if (res.success) {
    const tbody = document.querySelector('#riwayatTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(t => {
      const warga = allWarga.find(w => w.warga_id === t.warga_id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatTanggal(t.tanggal)}</td>
        <td>${warga ? warga.nama : t.warga_id}</td>
        <td>${t.keterangan || '-'}</td>
        <td>${formatRupiah(t.nominal)}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

document.getElementById('tarikKasForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = {
    tanggal: document.getElementById('tanggal').value,
    warga_id: document.getElementById('wargaSelect').value,
    deskripsi: document.getElementById('deskripsi').value,
    jumlah: parseFloat(document.getElementById('jumlah').value),
    idempotency_key: generateUUID()
  };
  
  try {
    const res = await callApi('saveCashWithdrawal', data, 'POST');
    if (res.success) {
      showAlert(res.message, 'success');
      this.reset();
      loadSaldo();
      loadRiwayat();
    } else {
      showAlert(res.message, 'error');
    }
  } catch (err) {
    showAlert('Gagal menyimpan', 'error');
  }
});

// Init
document.getElementById('tanggal').value = new Date().toISOString().slice(0,10);
loadSaldo();
loadWarga();
loadRiwayat();