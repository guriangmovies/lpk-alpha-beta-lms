const WEB_APP_URL = "PASTE_WEB_APP_URL_DI_SINI";

async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(WEB_APP_URL+"?action=users");
  const data = await res.json();

  const user = data.find(u => u.Email === email && u.Password === password);

  if(user){
    localStorage.setItem("email", email);
    window.location.href = "dashboard.html";
  }else{
    document.getElementById("msg").innerText="Login gagal";
  }
}

async function cekSertifikat(){
  const email = localStorage.getItem("email");
  const res = await fetch(WEB_APP_URL+"?action=certificate&email="+email);
  const data = await res.json();

  if(data.link){
    window.open(data.link,"_blank");
  }else{
    alert("Belum lulus atau belum tersedia");
  }
}

async function validasi(){
  const kode = document.getElementById("kode").value;
  const res = await fetch(WEB_APP_URL+"?action=validate&kode="+kode);
  const data = await res.json();

  if(data.status==="valid"){
    document.getElementById("hasil").innerHTML=
    "<h3>Sertifikat Valid</h3><p>Nama: "+data.nama+
    "<br>Nilai: "+data.nilai+"</p>";
  }else{
    document.getElementById("hasil").innerHTML="<h3>Tidak Valid</h3>";
  }
}
