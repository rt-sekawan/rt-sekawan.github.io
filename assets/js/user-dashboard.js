// user-dashboard.js
async function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('namaUser').textContent = user.username || '';
  
  // Ambil saldo deposit & hutang
  const deposit = await callApi('getDeposit', { warga_id: user.warga_id });
  if (deposit.success) {
    document.getElementById('saldoDeposit').textContent = formatRupiah(deposit.saldo_deposit);
  }
  const hutang = await callApi('getHutang', { warga_id: user.warga_id });
  if (hutang.success) {
    document.getElementById('totalHutang').textContent = formatRupiah(hutang.total_hutang);
  }
  
  // Ambil jadwal 10 terdekat
  const jadwal = await callApi('getJadwal', {});
  const list = document.getElementById('jadwalList');
  list.innerHTML = '';
  if (jadwal.success) {
    // PENTING - fix bug "Jadwal Terdekat tidak muncul": jangan bandingkan
    // Date lengkap dengan jam-menit-detik (new Date() = sekarang, mis. jam
    // 14:30), karena jadwal hari ini sendiri tersimpan sebagai jam 00:00 dan
    // jadi selalu gugur dianggap "sudah lewat". Nolkan jam-nya dulu sebelum
    // dibandingkan supaya jadwal HARI INI tetap ikut tampil.
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const upcoming = jadwal.data
      .filter(j => {
        const tgl = new Date(j.tanggal);
        tgl.setHours(0, 0, 0, 0);
        return tgl >= todayMidnight;
      })
      .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
      .slice(0, 10);
    if (upcoming.length === 0) {
      list.innerHTML = '<li>Belum ada jadwal mendatang.</li>';
    } else {
      for (const j of upcoming) {
        const li = document.createElement('li');
        const statusLabel = j.status === 'TERLAKSANA' ? 'Terlaksana' : j.status === 'ABSEN' ? 'Absen' : 'Terjadwal';
        li.textContent = `${formatTanggal(j.tanggal)} - ${j.nama_snapshot} (${statusLabel})`;
        list.appendChild(li);
      }
    }
  } else {
    list.innerHTML = `<li>${jadwal.message || 'Gagal memuat jadwal'}</li>`;
  }
}
loadDashboard();