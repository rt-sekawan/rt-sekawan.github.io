// admin-audit.js
async function loadAuditLog() {
  const tahun = document.getElementById('tahun').value;
  const res = await callApi('getAuditLog', { tahun });
  if (res.success) {
    const tbody = document.querySelector('#auditTable tbody');
    tbody.innerHTML = '';
    res.data.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(a.timestamp).toLocaleString('id-ID')}</td>
        <td>${a.user_id}</td>
        <td>${a.action}</td>
        <td>${a.object_type} ${a.object_id || ''}</td>
        <td>${a.reason || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

loadAuditLog();