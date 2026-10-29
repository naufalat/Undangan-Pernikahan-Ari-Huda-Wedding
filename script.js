/*
  PENGATURAN CEPAT:
  1) Ganti nama pasangan, tanggal, dan detail acara di objek WEDDING.
  2) Ganti whatsappNumber dengan nomor WhatsApp tujuan, format internasional tanpa + atau spasi.
  3) Ganti foto demo dengan foto milik sendiri.
*/
const WEDDING = {
  bride: "Prawindukasih Yogiswari",
  groom: "Achmad Huda",
  dateISO: "2026-11-20T15:30:00+07:00",
  dateText: "Jumat, 20 November 2026",
  whatsappNumber: "628155046625"
};

const $ = (id) => document.getElementById(id);
$("coverBride").textContent = WEDDING.bride;
$("coverGroom").textContent = WEDDING.groom;
$("brandNames").innerHTML = `${WEDDING.bride.charAt(0)} <span>&</span> ${WEDDING.groom.charAt(0)}`;
$("coverDate").textContent = WEDDING.dateText;
$("heroDate").textContent = WEDDING.dateText;
$("akadDate").textContent = WEDDING.dateText;
$("receptionDate").textContent = WEDDING.dateText;
$("brideName").textContent = `${WEDDING.bride}`;
$("groomName").textContent = `${WEDDING.groom}`;

// Personalize the greeting from a URL such as ?to=Bapak%20Budi
const params = new URLSearchParams(window.location.search);
const recipient = params.get("to");
if (recipient) $("guestName").textContent = recipient.replace(/\+/g, " ").trim();

// Fungsi ketika tombol "Buka Undangan" diklik
$("openInvitation").addEventListener("click", async () => {
  $("cover").classList.add("hidden");
  $("mainContent").classList.remove("hidden");
  document.body.classList.remove("locked");
  window.scrollTo({top: 0, behavior: "smooth"});

  // Otomatis memutar musik jika elemen audio ada
  const music = document.getElementById("weddingMusic");
  if (music) {
    try {
      await music.play();
      const toggle = document.getElementById("musicToggle");
      if (toggle) toggle.innerHTML = "♫ <span>Musik: ON</span>";
    } catch (error) {
      console.log("Musik diblokir oleh kebijakan browser sebelum interaksi penuh.");
    }
  }
});

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
const toggleBtn = document.getElementById("musicToggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", async () => {
    const music = document.getElementById("weddingMusic");
    if (!music) return;
    try {
      if (music.paused) {
        await music.play();
        toggleBtn.innerHTML = "♫ <span>Musik: ON</span>";
      } else {
        music.pause();
        toggleBtn.innerHTML = "♫ <span>Musik: OFF</span>";
      }
    } catch (error) {
      alert("Gagal memutar audio.");
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
    window.open(`https://wa.me{WEDDING.whatsappNumber}?text=${text}`, "_blank", "noopener");
  });
}
