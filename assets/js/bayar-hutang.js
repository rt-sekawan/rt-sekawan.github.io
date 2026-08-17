// bayar-hutang.js
const user = checkAuth();

let selectedWargaId = '';
let riwayatData = [];
let searchDebounceTimer = null;

document.getElementById('tanggal').value = new Date().toISOString().slice(0, 10);

async function loadRiwayat() {
  const res = await callApi('getRiwayatBayarHutang', {});
  if (res.success) {
    riwayatData = res.data;
    renderRiwayat(riwayatData);
  } else {
    showAlert(res.message || 'Gagal memuat riwayat', 'error');
  }
}

function renderRiwayat(list) {
  const tbody = document.querySelector('#riwayatTable tbody');
  tbody.innerHTML = '';
  list.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatTanggal(r.tanggal)}</td>
      <td>${r.nama || '-'}</td>
      <td>${r.nomor_rumah || '-'}</td>
      <td>${formatRupiah(r.nominal)}</td>
      <td>${r.keterangan || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('riwayatFilter').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  renderRiwayat(riwayatData.filter(r => (r.nama || '').toLowerCase().includes(keyword)));
});

// Live search warga (dropdown, bukan input manual)
document.getElementById('wargaSearch').addEventListener('input', (e) => {
  const keyword = e.target.value.trim();
  selectedWargaId = '';
  document.getElementById('warga_id_field').value = '';
  document.getElementById('idWargaDisplay').value = '';
  document.getElementById('nomorRumahDisplay').value = '';
  document.getElementById('sisaHutangInfo').style.display = 'none';
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

async function selectWarga(w) {
  selectedWargaId = w.warga_id;
  document.getElementById('wargaSearch').value = w.nama;
  document.getElementById('warga_id_field').value = w.warga_id;
  document.getElementById('idWargaDisplay').value = w.warga_id;
  document.getElementById('nomorRumahDisplay').value = w.nomor_rumah;
  document.getElementById('wargaSearchResults').innerHTML = '';
  document.getElementById('wargaSearchResults').classList.remove('active');

  const res = await callApi('getHutang', { warga_id: w.warga_id });
  if (res.success) {
    document.getElementById('sisaHutangInfo').style.display = 'block';
    document.getElementById('sisaHutangValue').textContent = formatRupiah(res.total_hutang);
  }
}

document.addEventListener('click', (e) => {
  const box = document.getElementById('wargaSearchResults');
  const input = document.getElementById('wargaSearch');
  if (e.target !== input && !box.contains(e.target)) {
    box.innerHTML = '';
    box.classList.remove('active');
  }
});

function resetHutangForm() {
  document.getElementById('hutangForm').reset();
  document.getElementById('tanggal').value = new Date().toISOString().slice(0, 10);
  document.getElementById('warga_id_field').value = '';
  document.getElementById('idWargaDisplay').value = '';
  document.getElementById('nomorRumahDisplay').value = '';
  document.getElementById('sisaHutangInfo').style.display = 'none';
  selectedWargaId = '';
}

document.getElementById('hutangForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const wargaId = document.getElementById('warga_id_field').value;
  if (!wargaId) {
    showAlert('Pilih warga dari hasil pencarian terlebih dahulu', 'error');
    return;
  }
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const data = {
    tanggal: document.getElementById('tanggal').value,
    warga_id: wargaId,
    diterima_oleh: document.getElementById('diterimaOleh').value,
    jumlah: parseFloat(document.getElementById('jumlah').value),
    idempotency_key: generateUUID()
  };

  try {
    const res = await callApi('payDebt', data, 'POST');
    if (res.success) {
      showAlert(res.message || 'Pembayaran hutang berhasil disimpan', 'success');
      resetHutangForm();
      await loadRiwayat();
    } else {
      showAlert(res.message || 'Gagal menyimpan pembayaran', 'error');
    }
  } finally {
    submitBtn.disabled = false;
  }
});

loadRiwayat();
