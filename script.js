const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbybhwLikQLQ_DFo3lqFgSn7pzsxdXBzrAMjGOvcqvo3RAZz_96X0cmHJpIrrdm5mbM/exec";

// =====================================
// 1. FITUR UI MODERN (LOADER & TOAST)
// =====================================
function showLoader() {
  let loader = document.getElementById("loader-overlay");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader-overlay";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }
  loader.classList.add("active");
}

function hideLoader() {
  const loader = document.getElementById("loader-overlay");
  if (loader) loader.classList.remove("active");
}

function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  // Hapus toast setelah 3 detik
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =====================================
// 2. SISTEM PROTEKSI & LOGOUT
// =====================================
function checkAuth() {
  const email = localStorage.getItem("email");
  const isLoginPage = window.location.pathname.includes("index.html") || window.location.pathname === "/";
  
  if (!email && !isLoginPage && !window.location.pathname.includes("certificate.html") && !window.location.pathname.includes("admin.html")) {
    showToast("Anda harus login terlebih dahulu", "error");
    setTimeout(() => { window.location.href = "index.html"; }, 1500);
  }

  if (email && isLoginPage) {
    window.location.href = "dashboard.html";
  }

  // Tampilkan email di dashboard jika ada elemennya
  const userEmailDisplay = document.getElementById("user-email-display");
  if (userEmailDisplay && email) {
    userEmailDisplay.innerText = email;
  }
}

function logout() {
  localStorage.removeItem("email");
  showToast("Berhasil logout", "success");
  setTimeout(() => { window.location.href = "index.html"; }, 1000);
}

// Jalankan cek auth saat halaman dimuat
window.onload = checkAuth;

// =====================================
// 3. FUNGSI UTAMA (API CALLS)
// =====================================
async function kirimOTP() {
  const email = document.getElementById("email").value;
  if (!email) return showToast("Harap masukkan email", "error");

  showLoader();
  try {
    await fetch(WEB_APP_URL + "?action=sendOTP&email=" + email);
    showToast("OTP berhasil dikirim ke email", "success");
    document.getElementById("msg").innerText = "Cek kotak masuk email Anda.";
  } catch (error) {
    showToast("Gagal mengirim OTP", "error");
  }
  hideLoader();
}

async function verifikasiOTP() {
  const email = document.getElementById("email").value;
  const kode = document.getElementById("kode").value;
  
  if (!email || !kode) return showToast("Lengkapi Email dan OTP", "error");

  showLoader();
  try {
    const res = await fetch(WEB_APP_URL + "?action=verifyOTP&email=" + email + "&kode=" + kode);
    const data = await res.json();

    if (data.status === "valid") {
      localStorage.setItem("email", email);
      showToast("Login berhasil!", "success");
      setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
    } else {
      showToast("Kode OTP salah atau kedaluwarsa", "error");
    }
  } catch (error) {
    showToast("Terjadi kesalahan sistem", "error");
  }
  hideLoader();
}

async function uploadTugas() {
  const email = localStorage.getItem("email");
  const link = document.getElementById("linkfile").value;

  if (!link) return showToast("Masukkan link tugas!", "error");

  showLoader();
  try {
    await fetch(WEB_APP_URL + "?action=uploadTugas&email=" + email + "&link=" + link);
    showToast("Tugas berhasil dikirim!", "success");
    document.getElementById("linkfile").value = ""; // Reset input
  } catch (error) {
    showToast("Gagal mengirim tugas", "error");
  }
  hideLoader();
}

async function cekSertifikat() {
  const email = localStorage.getItem("email");
  showLoader();
  try {
    const res = await fetch(WEB_APP_URL + "?action=certificate&email=" + email);
    const data = await res.json();

    if (data.link) {
      showToast("Sertifikat ditemukan!", "success");
      window.open(data.link, "_blank");
    } else {
      showToast("Sertifikat belum tersedia / Anda belum lulus", "info");
    }
  } catch (error) {
    showToast("Gagal mengecek sertifikat", "error");
  }
  hideLoader();
}

async function validasi() {
  const kode = document.getElementById("kode").value;
  if (!kode) return showToast("Masukkan kode sertifikat", "error");

  showLoader();
  try {
    const res = await fetch(WEB_APP_URL + "?action=validate&kode=" + kode);
    const data = await res.json();
    
    const hasilDiv = document.getElementById("hasil");
    if (data.status === "valid") {
      showToast("Sertifikat Asli!", "success");
      hasilDiv.innerHTML = `
        <div style="background:#e8f5e9; padding:15px; border-left:4px solid #2ecc71; border-radius:4px;">
          <h3 style="color:#27ae60; margin-bottom:5px;">SERTIFIKAT VALID ✓</h3>
          <p style="margin:0;"><strong>Nama:</strong> ${data.nama}</p>
          <p style="margin:0;"><strong>Program:</strong> ${data.kelas || '-'}</p>
          <p style="margin:0;"><strong>Nilai Akhir:</strong> ${data.nilai}</p>
        </div>`;
    } else {
      showToast("Sertifikat Tidak Valid", "error");
      hasilDiv.innerHTML = `<div style="background:#ffebee; padding:15px; border-left:4px solid #e74c3c; border-radius:4px; color:#c0392b;"><b>✘ TIDAK VALID:</b> Data sertifikat tidak ditemukan di database kami.</div>`;
    }
  } catch (error) {
    showToast("Gagal memvalidasi data", "error");
  }
  hideLoader();
}

// =====================================
// 4. PEMBUAT TABEL OTOMATIS (JSON ke HTML)
// =====================================
function createTableFromJSON(data) {
  if (!data || data.length === 0) return "<p style='text-align:center; padding:20px;'>Tidak ada data.</p>";

  let html = '<div class="table-responsive"><table class="data-table"><thead><tr>';
  const headers = Object.keys(data[0]);
  headers.forEach(header => {
    html += `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`;
  });
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => { html += `<td>${row[header] || '-'}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

async function loadUsers() {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "<div class='spinner' style='margin:20px auto;'></div>"; 
  try {
    const res = await fetch(WEB_APP_URL + "?action=users");
    const data = await res.json();
    usersDiv.innerHTML = createTableFromJSON(data);
  } catch (error) {
    usersDiv.innerHTML = "<p style='color:red;'>Gagal memuat data.</p>";
  }
}

async function loadLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  leaderboardDiv.innerHTML = "<div class='spinner' style='margin:20px auto;'></div>"; 
  try {
    const res = await fetch(WEB_APP_URL + "?action=leaderboard");
    const data = await res.json();
    leaderboardDiv.innerHTML = createTableFromJSON(data);
  } catch (error) {
    leaderboardDiv.innerHTML = "<p style='color:red;'>Gagal memuat data.</p>";
  }
}

// Auto-load leaderboard di dashboard & admin
if (document.getElementById("leaderboard")) {
  loadLeaderboard();
}
