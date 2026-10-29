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

// Validasi elemen agar tidak membuat script crash jika ID tidak ditemukan di HTML
if ($("coverBride")) $("coverBride").textContent = WEDDING.bride;
if ($("coverGroom")) $("coverGroom").textContent = WEDDING.groom;
if ($("brandNames")) $("brandNames").innerHTML = `${WEDDING.bride.charAt(0)} <span>&</span> ${WEDDING.groom.charAt(0)}`;
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
if ($("rsvpForm")) {
  $("rsvpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("rsvpName").value.trim();
    const attendance = $("attendance").value;
    const guestCount = $("guestCount").value;
    const message = $("message").value.trim();
    const text = `RSVP Pernikahan ${WEDDING.bride} & ${WEDDING.groom}%0A` +
      `Nama: ${encodeURIComponent(name)}%0A` +
      `Kehadiran: ${encodeURIComponent(attendance)}%0A` +
      `Jumlah tamu: ${encodeURIComponent(guestCount)}%0A` +
      `Ucapan: ${encodeURIComponent(message || "-")}`;
    window.open(`https://wa.me/${WEDDING.whatsappNumber}?text=${text}`, "_blank", "noopener");
  });
}
