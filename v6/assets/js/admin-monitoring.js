// admin-monitoring.js
async function loadMonitoring() {
  const res = await callApi('getMonitoring', {});
  if (res.success) {
    // Petugas table
    const petugasTbody = document.querySelector('#petugasTable tbody');
    petugasTbody.innerHTML = '';
    res.petugas.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nama}</td>
        <td>${p.total}</td>
        <td>${p.berhasil}</td>
        <td>${p.absen}</td>
      `;
      petugasTbody.appendChild(tr);
    });
    
    // Warga stats table
    const wargaTbody = document.querySelector('#wargaStatsTable tbody');
    wargaTbody.innerHTML = '';
    res.warga.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${w.nama}</td>
        <td>${formatRupiah(w.bayar)}</td>
        <td>${formatRupiah(w.hutang)}</td>
        <td>${formatRupiah(w.deposit)}</td>
      `;
      wargaTbody.appendChild(tr);
    });
  }
}

loadMonitoring();