/*
  PENGATURAN CEPAT:
  1) Ganti nama pasangan, tanggal, dan detail acara di objek WEDDING.
  2) Ganti whatsappNumber dengan nomor WhatsApp tujuan, format internasional tanpa + atau spasi.
  3) Ganti foto demo dengan foto milik sendiri.
*/
const WEDDING = {
  bride: "Prawindukasih Yogiswari",
  groom: "Achmad Huda",
  dateISO: "2026-11-20T15:30:00+07:00", // Sesuaikan dengan tanggal pernikahan Anda sendiri
  dateText: "Jumat, 20 November 2026", // Sesuaikan dengan tanggal pernikahan Anda sendiri
  whatsappNumber: "628155046625"    // Ganti dengan nomor WhatsApp Anda
};

const $ = (id) => document.getElementById(id);

// Mengatur nama mempelai dan inisial navbar
if ($("coverBride")) {
  $("coverBride").textContent = WEDDING.bride;
}

if ($("coverGroom")) {
  $("coverGroom").textContent = WEDDING.groom;
}

if ($("brandNames")) {
  $("brandNames").innerHTML = 'A <span>&amp;</span> H';
}
if ($("coverDate")) $("coverDate").textContent = WEDDING.dateText;
if ($("heroDate")) $("heroDate").textContent = WEDDING.dateText;
if ($("akadDate")) $("akadDate").textContent = WEDDING.dateText;

// Perbaikan nama lengkap agar murni menggunakan nama Anda berdua tanpa embel-embel template
if ($("brideName")) $("brideName").textContent = WEDDING.bride;
if ($("groomName")) $("groomName").textContent = WEDDING.groom;

// Personalize the greeting from a URL such as ?to=Bapak%20Budi
const params = new URLSearchParams(window.location.search);
const recipient = params.get("to");
if (recipient && $("guestName")) $("guestName").textContent = recipient.replace(/\+/g, " ").trim();

const music = $("weddingMusic");

// Fungsi ketika tombol "Buka Undangan" diklik
if ($("openInvitation")) {
  $("openInvitation").addEventListener("click", async () => {
    $("cover").classList.add("hidden");
    $("mainContent").classList.remove("hidden");
    document.body.classList.remove("locked");
    window.scrollTo({top: 0, behavior: "smooth"});

    // Otomatis memutar musik begitu undangan terbuka
    if (music) {
      try {
        await music.play();
        if ($("musicToggle")) $("musicToggle").innerHTML = "♫ <span>Musik: ON</span>";
      } catch (error) {
        console.log("Musik gagal berputar otomatis karena file music.mp3 belum ada atau diblokir browser.");
      }
    }
  });
}

// Countdown
const targetDate = new Date(WEDDING.dateISO).getTime();
function updateCountdown() {
  let diff = Math.max(0, targetDate - Date.now());
  const days = Math.floor(diff / 86400000); diff %= 86400000;
  const hours = Math.floor(diff / 3600000); diff %= 3600000;
  const minutes = Math.floor(diff / 60000); diff %= 60000;
  const seconds = Math.floor(diff / 1000);
  
  if ($("days")) $("days").textContent = String(days).padStart(3, "0");
  if ($("hours")) $("hours").textContent = String(hours).padStart(2, "0");
  if ($("minutes")) $("minutes").textContent = String(minutes).padStart(2, "0");
  if ($("seconds")) $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Kontrol manual tombol musik (ON/OFF) di dalam website
if ($("musicToggle")) {
  $("musicToggle").addEventListener("click", async () => {
    if (!music) return;
    try {
      if (music.paused) {
        await music.play();
        $("musicToggle").innerHTML = "♫ <span>Musik: ON</span>";
      } else {
        music.pause();
        $("musicToggle").innerHTML = "♫ <span>Musik: OFF</span>";
      }
    } catch (error) {
      alert("Tambahkan file music.mp3 ke folder website terlebih dahulu, lalu coba lagi.");
    }
  });
}

// Demo RSVP: opens WhatsApp with a prefilled message. No database is used.


// ========================================
// WEDDING RSVP & GOOGLE SHEETS
// ========================================

const RSVP_API =
  "https://script.google.com/macros/s/AKfycbxr9FcIor7-vo_R4rqpNDtM_GcdQH75rSwhwvuSf9TUCCH2zx7GlrVL2R92LHyJnJd6OA/exec";

const rsvpForm = $("rsvpForm");
const attendanceInput = $("attendance");
const guestCountInput = $("guestCount");
const rsvpStatus = $("rsvpStatus");
const submitRSVP = $("submitRSVP");
const wishesList = $("wishesList");

// Mengatur jumlah tamu berdasarkan kehadiran
if (attendanceInput && guestCountInput) {
  attendanceInput.addEventListener("change", () => {
    if (attendanceInput.value === "Tidak Hadir") {
      guestCountInput.value = "1";
      guestCountInput.disabled = true;
    } else {
      guestCountInput.disabled = false;
    }
  });
}

// Menampilkan daftar ucapan dengan aman
function renderWishes(data) {
  if (!wishesList) return;

  wishesList.replaceChildren();

  if (!data || data.length === 0) {
    const empty = document.createElement("p");
    empty.className = "wishes-empty";
    empty.textContent = "Belum ada ucapan. Jadilah yang pertama memberikan doa!";
    wishesList.appendChild(empty);
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("article");
    card.className = "wish-card";

    const header = document.createElement("div");
    header.className = "wish-card-header";

    const name = document.createElement("strong");
    name.className = "wish-card-name";
    name.textContent = item.nama;

    const meta = document.createElement("span");
    meta.className = "wish-card-meta";

    const jumlah = item.kehadiran === "Hadir"
      ? `${item.jumlahTamu} tamu`
      : "Tidak hadir";

    meta.textContent = `${item.kehadiran} · ${jumlah}`;

    const message = document.createElement("p");
    message.className = "wish-card-message";
    message.textContent = item.ucapan;

    header.append(name, meta);
    card.append(header, message);
    wishesList.appendChild(card);
  });
}

// Mengambil data ucapan menggunakan JSONP
function loadWishes(expected = null) {
  if (!wishesList) return;

  const oldScript = document.getElementById("wishesDataScript");
  if (oldScript) oldScript.remove();

  wishesList.textContent = "Memuat ucapan...";

  const script = document.createElement("script");
  script.id = "wishesDataScript";

  window.handleWeddingWishes = function(result) {
    script.remove();

    if (!result || !result.success) {
      wishesList.textContent = "Ucapan belum dapat dimuat. Silakan coba lagi.";
      return;
    }

    renderWishes(result.data);

    // Verifikasi apakah ucapan yang baru dikirim sudah masuk
    if (expected && rsvpStatus) {
      const found = result.data.some(item =>
        item.nama === expected.nama &&
        item.ucapan === expected.ucapan
      );

      if (found) {
        rsvpStatus.textContent = "Ucapan berhasil dikirim. Terima kasih!";
        if (rsvpForm) rsvpForm.reset();
        if (guestCountInput) guestCountInput.disabled = false;
      } else {
        rsvpStatus.textContent =
          "Data belum terlihat di rekap. Silakan periksa Google Sheets.";
      }

      if (submitRSVP) submitRSVP.disabled = false;
    }
  };

  script.onerror = function() {
    script.remove();
    wishesList.textContent = "Gagal memuat ucapan. Periksa koneksi internet.";
  };

  script.src =
    RSVP_API +
    "?callback=handleWeddingWishes&t=" +
    Date.now();

  document.body.appendChild(script);
}

// Mengirim RSVP ke Google Sheets
if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nama = $("rsvpName").value.trim();
    const kehadiran = attendanceInput.value;
    const jumlahTamu = kehadiran === "Hadir"
      ? Number(guestCountInput.value)
      : 0;
    const ucapan = $("message").value.trim();

    if (!nama || !kehadiran || !ucapan) {
      rsvpStatus.textContent = "Mohon lengkapi semua formulir.";
      return;
    }

    if (kehadiran === "Hadir" &&
        (!Number.isInteger(jumlahTamu) ||
         jumlahTamu < 1 || jumlahTamu > 4)) {
      rsvpStatus.textContent = "Jumlah tamu tidak valid.";
      return;
    }

    const formData = new URLSearchParams();
    formData.append("nama", nama);
    formData.append("kehadiran", kehadiran);
    formData.append("jumlahTamu", String(jumlahTamu));
    formData.append("ucapan", ucapan);

    submitRSVP.disabled = true;
    submitRSVP.textContent = "Mengirim...";
    rsvpStatus.textContent = "Sedang mengirim ucapan...";

    try {
      await fetch(RSVP_API, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      rsvpStatus.textContent = "Memeriksa data yang tersimpan...";

      // Tunggu Google Sheets memperbarui data
      setTimeout(() => {
        submitRSVP.textContent = "Kirim Ucapan";
        loadWishes({ nama, ucapan });
      }, 2000);

    } catch (error) {
      console.error("Gagal mengirim RSVP:", error);

      rsvpStatus.textContent =
        "Pengiriman gagal. Periksa koneksi internet dan coba lagi.";

      submitRSVP.disabled = false;
      submitRSVP.textContent = "Kirim Ucapan";
    }
  });
}

// Memuat rekap ucapan saat website dibuka
loadWishes();

