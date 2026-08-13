// laporan.js
document.getElementById('startDate').value = new Date().toISOString().slice(0,7) + '-01';
document.getElementById('endDate').value = new Date().toISOString().slice(0,10);

async function loadLaporan() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  
  if (!start || !end) {
    showAlert('Pilih tanggal terlebih dahulu', 'warning');
    return;
  }
  
  const res = await callApi('getReports', { start, end });
  if (res.success) {
    // Summary
    document.getElementById('saldoAwal').textContent = formatRupiah(res.summary.saldo_awal || 0);
    document.getElementById('totalJimpitan').textContent = formatRupiah(res.summary.total_jimpitan || 0);
    document.getElementById('totalPembayaranHutang').textContent = formatRupiah(res.summary.total_pembayaran_hutang || 0);
    document.getElementById('totalDepositMasuk').textContent = formatRupiah(res.summary.total_deposit_masuk || 0);
    document.getElementById('totalTarikKas').textContent = formatRupiah(res.summary.total_tarik_kas || 0);
    document.getElementById('saldoAkhir').textContent = formatRupiah(res.summary.saldo_akhir || 0);
    
    // Detail table
    const tbody = document.querySelector('#detailTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatTanggal(t.tanggal)}</td>
        <td>${t.jenis}</td>
        <td>${formatRupiah(t.nominal)}</td>
        <td>${t.keterangan || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}