const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjwekeycSiY5_PWgDvjPVmDza7TTlhy8cHh29QHdUAP8GVsgsysTLJoMM3dzdKHieW/exec";

// ... (Biarkan fungsi kirimOTP, verifikasiOTP, uploadTugas, cekSertifikat, validasi tetap sama seperti sebelumnya) ...

// ==========================================
// FUNGSI BARU: Mengubah JSON menjadi Tabel
// ==========================================
function createTableFromJSON(data) {
  // Jika data kosong atau bukan array
  if (!data || data.length === 0) {
    return "<p style='text-align:center; padding:20px;'>Tidak ada data yang ditemukan.</p>";
  }

  // Bungkus dengan div agar responsif di HP
  let html = '<div class="table-responsive"><table class="data-table"><thead><tr>';
  
  // Ambil judul kolom (header) dari object pertama
  const headers = Object.keys(data[0]);
  headers.forEach(header => {
    // Ubah huruf pertama jadi kapital agar rapi
    const cleanHeader = header.charAt(0).toUpperCase() + header.slice(1);
    html += `<th>${cleanHeader}</th>`;
  });
  html += '</tr></thead><tbody>';

  // Isi baris data
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      html += `<td>${row[header] || '-'}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  return html;
}

// ==========================================
// PERBARUAN: Load Users & Leaderboard
// ==========================================
async function loadUsers(){
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "<p>Memuat data siswa...</p>"; // Loading state
  
  try {
    const res = await fetch(WEB_APP_URL+"?action=users");
    const data = await res.json();
    usersDiv.innerHTML = createTableFromJSON(data);
  } catch (error) {
    usersDiv.innerHTML = "<p style='color:red;'>Gagal memuat data. Periksa koneksi atau URL Apps Script.</p>";
  }
}

async function loadLeaderboard(){
  const leaderboardDiv = document.getElementById("leaderboard");
  leaderboardDiv.innerHTML = "<p>Memuat leaderboard...</p>"; // Loading state
  
  try {
    const res = await fetch(WEB_APP_URL+"?action=leaderboard");
    const data = await res.json();
    leaderboardDiv.innerHTML = createTableFromJSON(data);
  } catch (error) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Gagal memuat data. Periksa koneksi atau URL Apps Script.</p>";
  }
}

// Panggil leaderboard saat halaman dimuat
if(document.getElementById("leaderboard")) {
  loadLeaderboard();
}
