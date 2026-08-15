// catat-jimpitan.js
let mode = 'READ_ONLY';
let dataWarga = [];
let selectedTanggal = '';
let tarifHariIni = 0;
let sudahSelesai = false;
const user = JSON.parse(localStorage.getItem('user'));

function kembaliDashboard() {
  const role = (user && user.role || '').toUpperCase();
  if (role === 'ADMIN') location.href = '../admin/dashboard.html';
  else if (role === 'BENDAHARA') location.href = '../bendahara/dashboard.html';
  else location.href = '../user/dashboard.html';
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('kembaliBtn').addEventListener('click', kembaliDashboard);
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('tanggal').value = today;
  // Warga (role USER) tidak boleh pilih tanggal masa depan di date-picker.
  if (user.role === 'USER') {
    document.getElementById('tanggal').max = today;
  }
  document.getElementById('tanggal').addEventListener('change', loadData);
  document.getElementById('checkAll').addEventListener('click', () => { setAllCheckboxes(true); hitungRingkasan(); });
  document.getElementById('uncheckAll').addEventListener('click', () => { setAllCheckboxes(false); hitungRingkasan(); });
  document.getElementById('selesaiBtn').addEventListener('click', saveJimpitan);
  document.getElementById('search').addEventListener('input', filterTable);
  document.getElementById('unduhBuktiBtn').addEventListener('click', unduhBuktiTugas);
  loadData();
});

function loadData() {
  const tanggal = document.getElementById('tanggal').value;
  selectedTanggal = tanggal;
  sudahSelesai = false;
  document.getElementById('unduhBuktiBtn').style.display = 'none';
  // Cek draft lokal dulu
  getDraftsByTanggal(tanggal).then(drafts => {
    if (drafts.length > 0) {
      // restore draft
      dataWarga = drafts[0].data;
      renderTable();
      document.getElementById('modeInfo').textContent = 'Draft ditemukan. Lanjutkan?';
      return;
    }
    // Fetch dari server
    callApi('getJimpitan', { tanggal }).then(res => {
      if (res.success) {
        dataWarga = res.data;
        tarifHariIni = res.tarif || 0;
        document.getElementById('petugas').textContent = res.petugas ? res.petugas.nama : '(belum ada jadwal)';
        checkMode(res.petugas, res.izin);
        renderTable();
        hitungRingkasan();
      } else {
        showAlert(res.message || 'Gagal memuat data', 'error');
      }
    });
  });
}

function checkMode(petugas, izin) {
  mode = 'READ_ONLY';
  const roleUpper = (user.role || '').toUpperCase();

  if (roleUpper === 'ADMIN' || roleUpper === 'BENDAHARA') {
    // Admin & Bendahara: selalu bisa catat/edit (kecuali tanggal masa depan,
    // sudah dicegah backend & juga izin.boleh di sini).
    mode = izin && izin.boleh ? 'EDIT' : 'READ_ONLY';
    document.getElementById('modeInfo').textContent = mode === 'EDIT'
      ? 'Mode Admin/Bendahara — bisa catat & edit mewakili warga'
      : 'Tidak bisa mencatat untuk tanggal ini';
  } else {
    // Role WARGA: harus jadi petugas terjadwal hari itu.
    const petugasCocok = petugas && user.warga_id === petugas.warga_id;
    if (!petugasCocok) {
      mode = 'READ_ONLY';
      document.getElementById('modeInfo').textContent = 'Anda bukan petugas terjadwal pada tanggal ini (Mode Lihat Saja)';
    } else if (!izin || !izin.boleh) {
      mode = 'READ_ONLY';
      document.getElementById('modeInfo').textContent = 'Tidak bisa diedit lagi';
      showContactAdminModal(izin ? izin.alasan : 'Sudah melewati masa edit yang diizinkan.');
    } else {
      mode = 'EDIT';
      document.getElementById('modeInfo').textContent = izin.hanyaUpdate
        ? 'Mode Edit — hanya bisa UPDATE catatan yang sudah ada (tidak bisa catat baru untuk hari yang terlewat)'
        : 'Mode Bisa Diedit';
    }
  }
  toggleInputs(mode === 'EDIT');
}

function toggleInputs(enabled) {
  // Kalau mode Lihat Saja (read only), tombol Centang Semua/Hapus Semua juga
  // ikut dinonaktifkan supaya tidak menyesatkan (kelihatan bisa dipakai
  // padahal perubahannya tidak akan tersimpan).
  document.querySelectorAll('#wargaTable input').forEach(input => input.disabled = !enabled);
  document.getElementById('selesaiBtn').disabled = !enabled;
  document.getElementById('checkAll').disabled = !enabled;
  document.getElementById('uncheckAll').disabled = !enabled;
}

function renderTable() {
  const tbody = document.querySelector('#wargaTable tbody');
  tbody.innerHTML = '';
  dataWarga.forEach((w, index) => {
    const tr = document.createElement('tr');
    // Otomatis centang "Bayar" kalau warga belum tercatat hari ini TAPI saldo
    // depositnya sudah cukup buat nutup tarif hari ini (backend otomatis
    // memakai saldo deposit itu saat data disimpan).
    const sudahTercatat = w.status_pembayaran !== 'BELUM';
    const otomatisCentang = !sudahTercatat && w.bisa_bayar_pakai_deposit;
    const tercentang = w.status_pembayaran === 'PAID' || otomatisCentang;
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${w.nama} (${w.nomor_rumah})</td>
      <td><input type="checkbox" ${tercentang ? 'checked' : ''}></td>
      <td>${formatRupiah(w.saldo_deposit || 0)}${otomatisCentang ? ' <span title="Otomatis dibayar pakai saldo deposit">✅ pakai deposit</span>' : ''}</td>
      <td><input type="number" value="0" min="0" placeholder="0"></td>
    `;
    tbody.appendChild(tr);
  });
  filterTable();

  // Ringkasan ikut update REAL-TIME setiap kali centang/isian deposit diubah
  tbody.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', hitungRingkasan));
  tbody.querySelectorAll('input[type="number"]').forEach(inp => inp.addEventListener('input', hitungRingkasan));
}

function filterTable() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const rows = document.querySelectorAll('#wargaTable tbody tr');
  rows.forEach(tr => {
    const nama = tr.children[1].textContent.toLowerCase();
    tr.style.display = nama.includes(keyword) ? '' : 'none';
  });
}

function setAllCheckboxes(value) {
  document.querySelectorAll('#wargaTable tbody input[type="checkbox"]').forEach(cb => cb.checked = value);
}

// Menghitung & menampilkan bagian Ringkasan di bawah tabel, sesuai rumus:
//   Total Seharusnya Didapat = Tarif x Total Semua Warga
//   Total Hutang Jimpitan    = (Total Warga Bayar - Total Semua Warga) x Tarif
//   Total Setoran Jimpitan   = Total Seharusnya Didapat + Deposit + Total Hutang Jimpitan
function hitungRingkasan() {
  const rows = document.querySelectorAll('#wargaTable tbody tr');
  if (rows.length === 0) return;

  const totalSemuaWarga = rows.length;
  let totalBayar = 0;
  let totalDeposit = 0;
  rows.forEach(tr => {
    const cb = tr.querySelector('input[type="checkbox"]');
    const depositInput = tr.querySelector('input[type="number"]');
    if (cb && cb.checked) totalBayar++;
    if (depositInput) totalDeposit += (parseFloat(depositInput.value) || 0);
  });

  const totalSeharusnya = tarifHariIni * totalSemuaWarga;
  const totalHutangJimpitan = (totalBayar - totalSemuaWarga) * tarifHariIni; // <= 0
  const totalSetoran = totalSeharusnya + totalDeposit + totalHutangJimpitan;

  document.getElementById('ringkasanCard').style.display = 'block';
  document.getElementById('rgTotalWarga').textContent = totalSemuaWarga;
  document.getElementById('rgTotalBayar').textContent = totalBayar;
  document.getElementById('rgSeharusnya').textContent = formatRupiah(totalSeharusnya);
  document.getElementById('rgDeposit').textContent = formatRupiah(totalDeposit);
  document.getElementById('rgHutang').textContent = formatRupiah(totalHutangJimpitan);
  document.getElementById('rgSetoran').textContent = formatRupiah(totalSetoran);

  return { totalSemuaWarga, totalBayar, totalSeharusnya, totalDeposit, totalHutangJimpitan, totalSetoran };
}

function saveJimpitan() {
  if (mode !== 'EDIT') return;
  const selesaiBtn = document.getElementById('selesaiBtn');
  // Cegah klik dobel: langsung nonaktifkan tombol begitu diklik, supaya
  // tidak terjadi 2 request tersimpan dobel kalau tombolnya kepencet 2x.
  if (selesaiBtn.disabled) return;
  selesaiBtn.disabled = true;

  const tbody = document.querySelector('#wargaTable tbody');
  const rows = tbody.querySelectorAll('tr');
  const payload = [];
  rows.forEach((tr, i) => {
    const checkbox = tr.querySelector('input[type="checkbox"]');
    const depositInput = tr.querySelector('input[type="number"]');
    const warga = dataWarga[i];
    payload.push({
      warga_id: warga.warga_id,
      status: checkbox.checked ? 'PAID' : 'HUTANG',
      deposit: parseFloat(depositInput.value) || 0
    });
  });

  const ringkasan = hitungRingkasan();
  const idempotency_key = generateUUID();
  const dataToSend = {
    tanggal: selectedTanggal,
    data: payload,
    idempotency_key
  };

  // Coba kirim ke server
  callApi('saveJimpitan', dataToSend, 'POST').then(res => {
    if (res.success) {
      showAlert('Data jimpitan berhasil disimpan', 'success');
      sudahSelesai = true;
      document.getElementById('unduhBuktiBtn').style.display = 'inline-block';
      loadData(); // reload supaya saldo deposit & status terbaru ikut tampil
    } else {
      if (res.message && res.message.toLowerCase().includes('masa edit')) {
        showContactAdminModal(res.message);
      } else {
        showAlert(res.message || 'Gagal menyimpan', 'error');
      }
      selesaiBtn.disabled = false;
    }
  }).catch(err => {
    // Simpan ke draft offline
    saveDraft({
      tanggal: selectedTanggal,
      data: payload,
      idempotency_key
    }).then(() => {
      showAlert('Koneksi gagal. Data disimpan sebagai draft offline.', 'warning');
      selesaiBtn.disabled = false;
    });
  });
}

async function unduhBuktiTugas() {
  const ringkasan = hitungRingkasan();
  if (!ringkasan) return;

  const namaPetugas = user.username || 'Petugas';
  const tanggalObj = new Date(selectedTanggal);

  showAlert('Sedang membuat gambar bukti tugas...', 'success');
  try {
    await generateBuktiTugasImage({
      namaPetugas,
      tanggalLengkap: formatTanggalLengkap(tanggalObj),
      tanggalFileName: selectedTanggal,
      jam: formatJamSekarang(),
      jumlahWarga: ringkasan.totalSemuaWarga,
      tarif: tarifHariIni,
      tambahanDeposit: ringkasan.totalDeposit,
      yangTidakBayar: Math.abs(ringkasan.totalHutangJimpitan),
      totalSetoran: ringkasan.totalSetoran,
      logoPath: '../../assets/icons/icon-512x512.png'
    });
  } catch (e) {
    showAlert('Gagal membuat gambar bukti tugas', 'error');
  }
}
