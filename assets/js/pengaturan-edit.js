// pengaturan-edit.js
const user = checkAuth();

function tampilkanFormSesuaiTipe(tipe) {
  document.getElementById('formHari').style.display = tipe === 'HARI' ? 'block' : 'none';
  document.getElementById('formBulan').style.display = tipe === 'BULANAN' ? 'block' : 'none';
  document.getElementById('infoSelamanya').style.display = tipe === 'SELAMANYA' ? 'block' : 'none';
}

document.getElementById('tipe').addEventListener('change', (e) => {
  tampilkanFormSesuaiTipe(e.target.value);
});

async function loadPengaturan() {
  const res = await callApi('getPengaturanEdit', {});
  if (res.success) {
    document.getElementById('tipe').value = res.tipe;
    tampilkanFormSesuaiTipe(res.tipe);
    if (res.tipe === 'HARI') document.getElementById('nilaiHari').value = res.nilai;
    if (res.tipe === 'BULANAN') document.getElementById('nilaiBulan').value = res.nilai;
  } else {
    showAlert(res.message || 'Gagal memuat pengaturan', 'error');
  }
}

document.getElementById('pengaturanForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tipe = document.getElementById('tipe').value;
  let nilai = '';
  if (tipe === 'HARI') {
    nilai = document.getElementById('nilaiHari').value;
    if (!nilai || nilai < 1) {
      showAlert('Jumlah hari wajib diisi (minimal 1)', 'error');
      return;
    }
  } else if (tipe === 'BULANAN') {
    nilai = document.getElementById('nilaiBulan').value;
    if (!nilai || nilai < 1 || nilai > 12) {
      showAlert('Jumlah bulan harus antara 1-12', 'error');
      return;
    }
  }

  const res = await callApi('updatePengaturanEdit', { tipe, nilai }, 'POST');
  if (res.success) {
    showAlert(res.message || 'Pengaturan tersimpan', 'success');
  } else {
    showAlert(res.message || 'Gagal menyimpan pengaturan', 'error');
  }
});

loadPengaturan();
