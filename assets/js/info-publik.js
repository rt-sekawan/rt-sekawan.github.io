// info-publik.js
document.addEventListener('DOMContentLoaded', () => {
  const tabMasukBtn = document.getElementById('tabMasukBtn');
  const tabInfoBtn = document.getElementById('tabInfoBtn');
  const tabMasuk = document.getElementById('tabMasuk');
  const tabInfo = document.getElementById('tabInfo');

  let infoSudahDimuat = false;

  tabMasukBtn.addEventListener('click', () => {
    tabMasukBtn.classList.add('active');
    tabInfoBtn.classList.remove('active');
    tabMasuk.style.display = 'block';
    tabInfo.style.display = 'none';
  });

  tabInfoBtn.addEventListener('click', () => {
    tabInfoBtn.classList.add('active');
    tabMasukBtn.classList.remove('active');
    tabInfo.style.display = 'block';
    tabMasuk.style.display = 'none';
    if (!infoSudahDimuat) {
      infoSudahDimuat = true;
      loadInfoPublik();
    }
  });
});

async function loadInfoPublik() {
  const res = await callApi('getInfoPublik', {});
  if (!res.success) {
    document.getElementById('infoTotalWarga').textContent = '-';
    document.getElementById('infoJadwalHariIni').textContent = '-';
    document.getElementById('infoKehadiran').textContent = '-';
    document.querySelector('#infoJadwalTable tbody').innerHTML =
      `<tr><td colspan="2">${res.message || 'Gagal memuat info'}</td></tr>`;
    return;
  }

  document.getElementById('infoTotalWarga').textContent = res.total_warga;
  document.getElementById('infoJadwalHariIni').textContent = res.jadwal_hari_ini || 'Belum ada jadwal';
  document.getElementById('infoKehadiran').textContent =
    res.persen_kehadiran_bulan_ini === null ? '-' : `${res.persen_kehadiran_bulan_ini}%`;

  const tbody = document.querySelector('#infoJadwalTable tbody');
  tbody.innerHTML = '';
  if (!res.jadwal_10_hari || res.jadwal_10_hari.length === 0) {
    tbody.innerHTML = '<tr><td colspan="2">Belum ada jadwal mendatang</td></tr>';
    return;
  }
  res.jadwal_10_hari.forEach(j => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${formatTanggal(j.tanggal)}</td><td>${j.nama}</td>`;
    tbody.appendChild(tr);
  });
}
