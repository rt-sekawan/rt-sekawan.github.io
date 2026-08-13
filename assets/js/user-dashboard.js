// user-dashboard.js
async function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('namaUser').textContent = user.username || '';
  
  // Ambil saldo deposit & hutang
  const deposit = await callApi('getDeposit', { warga_id: user.warga_id });
  if (deposit.success) {
    document.getElementById('saldoDeposit').textContent = 'Rp' + deposit.saldo_deposit.toLocaleString();
  }
  const hutang = await callApi('getHutang', { warga_id: user.warga_id });
  if (hutang.success) {
    document.getElementById('totalHutang').textContent = 'Rp' + hutang.total_hutang.toLocaleString();
  }
  
  // Ambil jadwal 10 terdekat
  const jadwal = await callApi('getJadwal', {});
  if (jadwal.success) {
    const list = document.getElementById('jadwalList');
    list.innerHTML = '';
    const today = new Date();
    const upcoming = jadwal.data.filter(j => new Date(j.tanggal) >= today).slice(0, 10);
    for (const j of upcoming) {
      const li = document.createElement('li');
      li.textContent = `${formatTanggal(j.tanggal)} - ${j.nama_snapshot} (${j.status})`;
      list.appendChild(li);
    }
  }
}
loadDashboard();