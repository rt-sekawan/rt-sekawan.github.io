// admin-warga.js
async function loadWarga() {
  const res = await callApi('getWarga', {});
  if (res.success) {
    const tbody = document.querySelector('#wargaTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${w.warga_id}</td>
        <td>${w.nama}</td>
        <td>${w.nomor_rumah}</td>
        <td>${w.status}</td>
        <td><button onclick="editWarga('${w.warga_id}')">Edit</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

document.getElementById('wargaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    warga_id: document.getElementById('warga_id').value,
    nama: document.getElementById('nama').value,
    nomor_rumah: document.getElementById('nomor_rumah').value,
    user_id: document.getElementById('user_id').value
  };
  if (data.warga_id) {
    await callApi('updateWarga', data, 'POST');
  } else {
    await callApi('createWarga', data, 'POST');
  }
  loadWarga();
});