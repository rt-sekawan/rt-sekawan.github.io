// bukti-tugas.js
// Membuat gambar "Bukti Tugas Selesai" (JPG, portrait 1080x1920 - pas untuk
// story WhatsApp/Instagram) dari data ringkasan tugas hari itu, lalu
// langsung diunduh ke perangkat.

function loadImagePromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Menggambar teks yang otomatis pindah baris (word-wrap) di dalam lebar
// maksimum tertentu. Mengembalikan posisi Y setelah baris terakhir.
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight;
}

// Fungsi untuk menggambar logo dengan aspect ratio yang benar dan background
async function drawLogoWithBackground(ctx, logoPath, centerX, centerY, maxWidth, maxHeight) {
  try {
    const logo = await loadImagePromise(logoPath);
    
    // Resolusi asli logo: 405x150
    const aspectRatio = logo.width / logo.height; // 405/150 = 2.7
    
    // Tentukan ukuran logo dengan menjaga aspect ratio
    let logoWidth, logoHeight;
    
    if (maxWidth / maxHeight > aspectRatio) {
      // Batasan oleh tinggi
      logoHeight = maxHeight;
      logoWidth = maxHeight * aspectRatio;
    } else {
      // Batasan oleh lebar
      logoWidth = maxWidth;
      logoHeight = maxWidth / aspectRatio;
    }
    
    // Tambahkan padding untuk background
    const padding = 20;
    const bgWidth = logoWidth + padding * 2;
    const bgHeight = logoHeight + padding * 2;
    const bgX = centerX - bgWidth / 2;
    const bgY = centerY - bgHeight / 2;
    
    // Gambar background putih dengan border radius
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, bgX, bgY, bgWidth, bgHeight, 10);
    ctx.fill();
    
    // Tambahkan border subtle
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, bgX, bgY, bgWidth, bgHeight, 10);
    ctx.stroke();
    
    // Gambar logo dengan ukuran yang sudah disesuaikan
    const logoX = centerX - logoWidth / 2;
    const logoY = centerY - logoHeight / 2;
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    
  } catch (e) {
    // Kalau logo gagal dimuat, lanjut tanpa logo (jangan sampai gagal total)
    console.warn('Logo gagal dimuat:', e);
  }
}

/**
 * info = {
 *   namaPetugas, tanggalLengkap, jam,
 *   jumlahWarga, tarif, tambahanDeposit, yangTidakBayar, totalSetoran,
 *   logoPath
 * }
 */
async function generateBuktiTugasImage(info) {
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Latar belakang gradasi hijau, senada tema aplikasi
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#4CAF50');
  grad.addColorStop(1, '#1B5E20');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Logo (di posisi tengah/center atas) dengan aspect ratio yang benar
  await drawLogoWithBackground(
    ctx, 
    info.logoPath, 
    W / 2, // centerX
    180,   // centerY (posisi vertikal tengah logo)
    300,   // maxWidth
    120    // maxHeight
  );

  // Kartu putih besar di tengah, tempat semua teks rincian
  const cardX = 70, cardY = 320, cardW = W - 140, cardH = 1380;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 36);
  ctx.fill();

  // Judul ucapan terima kasih
  ctx.fillStyle = '#1B5E20';
  ctx.textAlign = 'center';
  ctx.font = 'bold 58px sans-serif';
  let y = cardY + 100;
  y = drawWrappedText(ctx, `Terima kasih banyak ${info.namaPetugas}!`, W / 2, y, cardW - 80, 68);

  // Sub-judul: kapan bertugas
  ctx.fillStyle = '#555555';
  ctx.font = '32px sans-serif';
  y += 20;
  y = drawWrappedText(ctx, `Telah bertugas pada`, W / 2, y, cardW - 80, 42);
  ctx.font = 'bold 34px sans-serif';
  ctx.fillStyle = '#333333';
  y = drawWrappedText(ctx, `${info.tanggalLengkap}, ${info.jam}`, W / 2, y, cardW - 80, 44);

  // Garis pemisah
  y += 24;
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, y);
  ctx.lineTo(cardX + cardW - 60, y);
  ctx.stroke();
  y += 56;

  // Judul rincian
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1B5E20';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('Dengan rincian:', cardX + 60, y);
  y += 64;

  const rincian = [
    ['Jumlah Warga', `${info.jumlahWarga} warga`],
    ['Tarif per Warga', formatRupiah(info.tarif)],
    ['Tambahan Deposit', formatRupiah(info.tambahanDeposit)],
    ['Yang Tidak Bayar', formatRupiah(info.yangTidakBayar)],
  ];

  ctx.font = '34px sans-serif';
  rincian.forEach(([label, value]) => {
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'left';
    ctx.fillText(label, cardX + 60, y);
    ctx.fillStyle = '#222222';
    ctx.textAlign = 'right';
    ctx.fillText(value, cardX + cardW - 60, y);
    y += 62;
  });

  // Total setoran, ditonjolkan
  y += 20;
  ctx.strokeStyle = '#e0e0e0';
  ctx.beginPath();
  ctx.moveTo(cardX + 60, y);
  ctx.lineTo(cardX + cardW - 60, y);
  ctx.stroke();
  y += 56;

  ctx.font = 'bold 38px sans-serif';
  ctx.fillStyle = '#1B5E20';
  ctx.textAlign = 'left';
  ctx.fillText('Total Setoran', cardX + 60, y);
  ctx.textAlign = 'right';
  ctx.fillText(formatRupiah(info.totalSetoran), cardX + cardW - 60, y);

  // Pesan penutup di luar kartu (di atas dasar hijau)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 36px sans-serif';
  ctx.textAlign = 'center';
  drawWrappedText(ctx, 'Semoga kegiatan ini menjadi amal jariyah anda!', W / 2, cardY + cardH + 110, W - 200, 48);

  // Unduh sebagai JPG
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bukti-tugas-${info.namaPetugas.replace(/\s+/g, '-')}-${info.tanggalFileName}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, 'image/jpeg', 0.92);
}
