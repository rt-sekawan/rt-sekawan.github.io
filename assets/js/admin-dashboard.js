// admin-dashboard.js
async function load() {
  const warga = await callApi('getWarga', {});
  if (warga.success) document.getElementById('totalWarga').textContent = warga.data.length;
  
  const kas = await callApi('getCashBalance', {});
  if (kas.success) document.getElementById('saldoKas').textContent = 'Rp' + kas.saldo_kas.toLocaleString();
  
  // Total hutang & deposit (loop warga)
  let totalHutang = 0, totalDeposit = 0;
  for (const w of warga.data) {
    const h = await callApi('getHutang', { warga_id: w.warga_id });
    if (h.success) totalHutang += h.total_hutang;
    const d = await callApi('getDeposit', { warga_id: w.warga_id });
    if (d.success) totalDeposit += d.saldo_deposit;
  }
  document.getElementById('totalHutang').textContent = 'Rp' + totalHutang.toLocaleString();
  document.getElementById('totalDeposit').textContent = 'Rp' + totalDeposit.toLocaleString();
  
  // Petugas hari ini
  const today = new Date().toISOString().slice(0,10);
  const jadwal = await callApi('getJadwal', { tanggal: today });
  if (jadwal.success && jadwal.data.length > 0) {
    document.getElementById('petugasHariIni').textContent = jadwal.data[0].nama_snapshot;
  }
}
load();