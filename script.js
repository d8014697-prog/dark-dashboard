// ==========================================
// 1. FUNGSI GLOBAL & NAVIGASI
// ==========================================
function switchPage(pageId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    localStorage.setItem('halamanAktif', pageId); 
  }
  const menuOverlay = document.getElementById('menuOverlay');
  if (menuOverlay) menuOverlay.classList.remove('active');
}

function showToast(pesan, tipe = 'success') {
  const toast = document.getElementById('toastBox');
  if (!toast) return;
  const symbol = tipe === 'success' ? '✓' : '✕';
  toast.innerHTML = `<span style="color: ${tipe === 'success' ? 'var(--success)' : 'var(--danger)'}; font-size: 15px; font-weight: bold;">${symbol}</span> ${pesan}`;
  toast.className = `toast-msg show ${tipe}`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==========================================
// 2. LOGIKA UTAMA & PROTEKSI SESI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const isLogged = localStorage.getItem('sudahMasuk') === 'true';
  const isOnDashboard = document.getElementById('pageLobby') !== null;
  const isOnLogin = document.getElementById('loginForm') !== null;

  if (isOnDashboard && !isLogged) window.location.replace('index.html');
  if (isOnLogin && isLogged) window.location.replace('dashboard.html');
  if (isOnDashboard) {
    const lastPage = localStorage.getItem('halamanAktif') || 'pageLobby';
    switchPage(lastPage);
  }

  // --- HALAMAN LOGIN ---
  const splash = document.getElementById('splashScreen');
  if (splash) {
    const closeIntro = () => splash.classList.add('hide');
    setTimeout(closeIntro, 2500);
    document.getElementById('btnSkipIntro')?.addEventListener('click', closeIntro);
  }

  document.getElementById('btnShowRegister')?.addEventListener('click', () => {
    document.getElementById('loginForm')?.classList.add('hide');
    document.getElementById('registerForm')?.classList.remove('hide');
  });
  document.getElementById('btnShowLogin')?.addEventListener('click', () => {
    document.getElementById('registerForm')?.classList.add('hide');
    document.getElementById('loginForm')?.classList.remove('hide');
  });

  const prosesLogin = (inputId) => {
    const user = document.getElementById(inputId)?.value || 'Pengguna';
    localStorage.setItem('sudahMasuk', 'true');
    localStorage.setItem('namaUser', user);
    window.location.href = 'dashboard.html';
  };
  
  document.getElementById('btnLoginSubmit')?.addEventListener('click', () => prosesLogin('loginUsername'));
  document.getElementById('btnRegisterSubmit')?.addEventListener('click', () => prosesLogin('regUsername'));

  // --- DASHBOARD SETUP ---
  const welcomeText = document.getElementById('welcomeNameText');
  if (welcomeText) welcomeText.innerText = localStorage.getItem('namaUser') || 'Pengguna';

  const menuOverlay = document.getElementById('menuOverlay');
  document.getElementById('btnOpenMenu')?.addEventListener('click', () => menuOverlay?.classList.add('active'));
  document.getElementById('btnCloseMenu')?.addEventListener('click', () => menuOverlay?.classList.remove('active'));

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.replace('index.html');
  });

  // ==========================================
  // 3. LOGIKA ALIGHT MOTION API (AXZYEDEV V1)
  // ==========================================
  const API_BASE = "https://axzyedev.biz.id/api/v1";
  const API_KEY = "AzaGanteng-UXRvnfELcX9YXhuHJQKBVKIoOTLiG9TR";
  const HEADERS = { "Content-Type": "application/json", "X-API-Key": API_KEY };

  const cardStep1 = document.getElementById('cardStep1');
  const cardStep2 = document.getElementById('cardStep2');

  const btnKirimAM = document.getElementById('btnKirimAM');
  const amEmailInput = document.getElementById('amEmailInput');
  const termStatus1 = document.getElementById('termStatus1');
  const termBody1 = document.getElementById('termBody1');

  const btnVerifyAM = document.getElementById('btnVerifyAM');
  const btnGantiEmail = document.getElementById('btnGantiEmail');
  const amLinkInput = document.getElementById('amLinkInput');
  const targetEmailText = document.getElementById('targetEmailText');
  const termStatus2 = document.getElementById('termStatus2');
  const termBody2 = document.getElementById('termBody2');
  const termSuccessLine = document.getElementById('termSuccessLine');

  let activeEmail = "";

  btnKirimAM?.addEventListener('click', async function() {
    const email = amEmailInput?.value.trim();
    if (!email) return showToast("Harap masukkan email target!", "error");

    activeEmail = email;
    this.innerText = "⏳ Meminta akses ke server...";
    this.disabled = true;

    termStatus1.innerText = "RUNNING";
    termBody1.innerHTML = `
      <div class="log-line">> Inisialisasi sesi...</div>
      <div class="log-line">> Dark sedang meminta akses ke server...</div>
      <div class="log-line text-muted">> Mengirim magic link ke ${email}...</div>
    `;

    try {
      const res = await fetch(`${API_BASE}/send-magic-link`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        showToast("Magic link terkirim! Cek kotak masuk atau spam.", "success");

        cardStep1.style.display = "none";
        cardStep2.style.display = "block";
        targetEmailText.innerText = email;

        termStatus2.innerText = "WAITING";
        termSuccessLine.innerText = `✓ Magic link terkirim ke ${email}`;
        termBody2.innerHTML = `
          <div class="log-line success">✓ Magic link terkirim ke ${email}</div>
          <div class="log-line text-muted">Menunggu link verifikasi di-paste...</div>
        `;

        amLinkInput.value = "";
        amLinkInput.focus();
      } else {
        throw new Error(data.message || "Gagal meminta akses ke server");
      }
    } catch (err) {
      termStatus1.innerText = "ERROR";
      termBody1.innerHTML = `<div class="log-line danger">✕ ${err.message}</div>`;
      showToast(err.message, "error");
    } finally {
      this.innerText = "Kirim Magic Link ➔";
      this.disabled = false;
    }
  });

  btnVerifyAM?.addEventListener('click', async function() {
    const rawLink = amLinkInput?.value.trim();
    if (!rawLink) return showToast("Tempel link verifikasi dari email terlebih dahulu!", "error");

    this.innerText = "⏳ Meminta akses ke server...";
    this.disabled = true;

    termStatus2.innerText = "RUNNING";
    termBody2.innerHTML = `
      <div class="log-line">> Dark sedang meminta akses ke server...</div>
      <div class="log-line">> Memverifikasi token oobCode...</div>
    `;

    try {
      const resVerify = await fetch(`${API_BASE}/verify-account`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email: activeEmail, rawLink })
      });
      const v = await resVerify.json().catch(() => ({}));
      if (!v.success) throw new Error(v.message || "Verifikasi link akun gagal");

      termBody2.innerHTML += `<div class="log-line success">✓ Akun terverifikasi. UID: ${v.uid || '-'}</div>`;
      termBody2.innerHTML += `<div class="log-line">> Menerapkan status premium...</div>`;

      const resPremium = await fetch(`${API_BASE}/apply-premium`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ idToken: v.idToken, email: activeEmail })
      });
      const p = await resPremium.json().catch(() => ({}));
      if (!p.success) throw new Error(p.message || "Gagal menerapkan premium");

      termStatus2.innerText = "SUCCESS";
      termBody2.innerHTML += `
        <div class="log-line success">✓ Premium aktif! OrderID: ${p.orderId || '-'}</div>
        <div class="log-line text-muted">Sisa Kuota: ${p.quota?.remaining || '-'} / ${p.quota?.limit || '-'}</div>
      `;
      showToast("Aktivasi Premium Berhasil!", "success");
      this.innerText = "Aktivasi Berhasil ✓";
    } catch (err) {
      termStatus2.innerText = "ERROR";
      termBody2.innerHTML += `<div class="log-line danger">✕ ${err.message}</div>`;
      showToast(err.message, "error");
      this.innerText = "Verifikasi & Premium ✓";
      this.disabled = false;
    }
  });

  btnGantiEmail?.addEventListener('click', () => {
    cardStep2.style.display = "none";
    cardStep1.style.display = "block";
    termStatus1.innerText = "IDLE";
    termBody1.innerHTML = `<div class="log-line text-muted">Aplikasi siap. Silakan masukkan email target...</div>`;
    amEmailInput.focus();
  });
});
