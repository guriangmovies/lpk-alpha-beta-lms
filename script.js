const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjwekeycSiY5_PWgDvjPVmDza7TTlhy8cHh29QHdUAP8GVsgsysTLJoMM3dzdKHieW/exec";

// ================= LOGIN =================
async function login(){
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if(!email || !password){
    document.getElementById("msg").innerText = "Email & Password wajib diisi";
    return;
  }

  try{
    const res = await fetch(
      WEB_APP_URL + `?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );

    const data = await res.json();

    if(data.status === "success"){
      localStorage.setItem("email", email);
      localStorage.setItem("nama", data.nama);
      localStorage.setItem("kelas", data.kelas);
      window.location.href = "dashboard.html";
    }else{
      document.getElementById("msg").innerText = "Login gagal";
    }

  }catch(err){
    document.getElementById("msg").innerText = "Server error";
  }
}


// ================= CEK SERTIFIKAT =================
async function cekSertifikat(){
  const email = localStorage.getItem("email");
  if(!email){
    alert("Silakan login ulang");
    return;
  }

  const res = await fetch(
    WEB_APP_URL + `?action=certificate&email=${encodeURIComponent(email)}`
  );

  const data = await res.json();

  if(data.link){
    window.open(data.link, "_blank");
  }else{
    alert("Belum lulus atau sertifikat belum tersedia");
  }
}


// ================= VALIDASI =================
async function validasi(){
  const kode = document.getElementById("kode").value.trim();

  if(!kode){
    alert("Masukkan kode sertifikat");
    return;
  }

  const res = await fetch(
    WEB_APP_URL + `?action=validate&kode=${encodeURIComponent(kode)}`
  );

  const data = await res.json();

  if(data.status === "valid"){
    document.getElementById("hasil").innerHTML =
      `<h3>Sertifikat Valid</h3>
       <p>Nama: ${data.nama}<br>
       Kelas: ${data.kelas}<br>
       Nilai: ${data.nilai}</p>`;
  }else{
    document.getElementById("hasil").innerHTML =
      "<h3 style='color:red'>Sertifikat Tidak Valid</h3>";
  }
}
