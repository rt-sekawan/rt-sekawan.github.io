// bendahara-dashboard.js
async function loadDashboard() {
  const saldo = await callApi('getCashBalance', {});
  if (saldo.success) document.getElementById('saldoKas').textContent = 'Rp' + saldo.saldo_kas.toLocaleString();
  
  // Hitung total hutang semua warga
  const wargaList = await callApi('getWarga', {});
  let totalHutang = 0;
  let totalDeposit = 0;
  if (wargaList.success) {
    for (const w of wargaList.data) {
      const hutang = await callApi('getHutang', { warga_id: w.warga_id });
      if (hutang.success) totalHutang += hutang.total_hutang;
      const deposit = await callApi('getDeposit', { warga_id: w.warga_id });
      if (deposit.success) totalDeposit += deposit.saldo_deposit;
    }
  }
  document.getElementById('totalHutang').textContent = 'Rp' + totalHutang.toLocaleString();
  document.getElementById('totalDeposit').textContent = 'Rp' + totalDeposit.toLocaleString();
}
loadDashboard();