// user-akun.js
async function loadAkun() {
  const user = checkAuth();
  if (!user) return;
  
  document.getElementById('namaUser').textContent = user.username || '-';
  document.getElementById('roleUser').textContent = roleLabel(user.role) || '-';
  
  // Ambil data warga (diri sendiri)
  const wargaResult = await callApi('getWarga', {});
  if (wargaResult.success) {
    const warga = wargaResult.data.find(w => w.warga_id === user.warga_id);
    if (warga) {
      document.getElementById('nomorRumah').textContent = warga.nomor_rumah;
    }
  }
  
  // Saldo deposit
  const deposit = await callApi('getDeposit', { warga_id: user.warga_id });
  if (deposit.success) {
    document.getElementById('saldoDeposit').textContent = formatRupiah(deposit.saldo_deposit);
  }
  
  // Total hutang
  const hutang = await callApi('getHutang', { warga_id: user.warga_id });
  if (hutang.success) {
    document.getElementById('totalHutang').textContent = formatRupiah(hutang.total_hutang);
  }
  
  // Riwayat tugas (dari jadwal)
  const jadwal = await callApi('getJadwal', {});
  if (jadwal.success) {
    const tbody = document.querySelector('#riwayatTable tbody');
    tbody.innerHTML = '';
    const userJadwal = jadwal.data
      .filter(j => j.warga_id === user.warga_id)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 50);
    
    for (const j of userJadwal) {
      const tr = document.createElement('tr');
      // Nilai status jadwal yang sebenarnya: TERJADWAL / TERLAKSANA / ABSEN
      // (bug lama: kode ini cek 'COMPLETED'/'SELESAI'/'ABSENT' yang tidak
      // pernah cocok, jadi riwayat selalu tampil "Terjadwal").
      const statusText = j.status === 'TERLAKSANA' ? 'Berhasil' :
                         j.status === 'ABSEN' ? 'Absen' : 'Terjadwal';
      // Highlight baris sesuai status: kuning=terjadwal, merah=absen, hijau=berhasil
      const rowClass = j.status === 'TERLAKSANA' ? 'row-berhasil' :
                        j.status === 'ABSEN' ? 'row-absen' : 'row-terjadwal';
      tr.className = rowClass;
      tr.innerHTML = `<td>${formatTanggal(j.tanggal)}</td><td>${statusText}</td>`;
      tbody.appendChild(tr);
    }
  }
}

loadAkun();