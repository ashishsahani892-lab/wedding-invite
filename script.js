/* =========================
   OPEN WEDDING INVITATION
========================= */

const openButton = document.getElementById("openInvitation");
const openingScreen = document.getElementById("opening");
const invitation = document.getElementById("invitation");

openButton.addEventListener("click", function () {

  // Hide opening screen
  openingScreen.style.opacity = "0";
  openingScreen.style.transform = "scale(1.1)";
  openingScreen.style.transition = "all 1s ease";

  // Small delay before showing invitation
  setTimeout(function () {

    openingScreen.style.display = "none";
    invitation.classList.remove("hidden");

    window.scrollTo(0, 0);

    startCelebration();
    startAmbientPetals();
    revealAnimations();
    startPopText();

    if (musicToggle) {
      musicToggle.style.display = "flex";
    }
    tryPlayMusic();

  }, 900);

});


/* =========================
   BACKGROUND MUSIC
========================= */

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

let musicPlaying = false;

function tryPlayMusic() {

  if (!bgMusic) return;

  bgMusic.volume = 0.5;

  bgMusic.play()
    .then(function () {
      musicPlaying = true;
      if (musicToggle) musicToggle.textContent = "🔊";
    })
    .catch(function () {
      // Autoplay was blocked by the browser; the toggle button lets
      // the guest start the music with a tap instead.
      musicPlaying = false;
      if (musicToggle) musicToggle.textContent = "🔈";
    });

}

if (musicToggle) {

  musicToggle.addEventListener("click", function () {

    if (!bgMusic) return;

    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicToggle.textContent = "🔈";
    } else {
      bgMusic.play();
      musicPlaying = true;
      musicToggle.textContent = "🔊";
    }

  });

}


/* =========================
   WEDDING COUNTDOWN
========================= */

/*
   Wedding Date:
   25 November 2026
   6:00 PM India Time
*/

const weddingDate = new Date("2026-11-25T18:00:00+05:30").getTime();

let hasArrived = false;

function updateCountdown() {

  const now = new Date().getTime();
  const difference = weddingDate - now;

  // Wedding moment has arrived
  if (difference <= 0) {

    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";

    if (!hasArrived) {
      hasArrived = true;
      const countdownBox = document.querySelector(".countdown");
      if (countdownBox) {
        countdownBox.outerHTML =
          '<p class="countdown-arrived">🎉 शुभ मुहूर्त आ गया है! 🎉</p>';
      }
      startCelebration();
    }

    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").innerText = String(days).padStart(2, "0");
  document.getElementById("hours").innerText = String(hours).padStart(2, "0");
  document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
  document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");

}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================
   SCROLL ANIMATION
========================= */

function revealAnimations() {

  const elements = document.querySelectorAll(
    ".event-card, .section, .contact-section"
  );

  const observer = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }

      });

    },
    { threshold: 0.15 }
  );

  elements.forEach(function (element) {

    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = "all 1s ease";

    observer.observe(element);

  });

}


/* =========================
   CELEBRATION EFFECT (burst)
========================= */

function startCelebration() {

  for (let i = 0; i < 35; i++) {
    createPetal();
  }

}


function createPetal() {

  const petal = document.createElement("div");

  petal.innerHTML = Math.random() > 0.7 ? "❀" : "✦";

  petal.style.position = "fixed";
  petal.style.top = "-20px";
  petal.style.left = Math.random() * 100 + "vw";

  petal.style.color =
    Math.random() > 0.5 ? "#d8aa58" : "#e7a6a6";

  petal.style.fontSize = (8 + Math.random() * 15) + "px";
  petal.style.zIndex = "999";
  petal.style.pointerEvents = "none";

  const duration = 3 + Math.random() * 4;

  petal.style.animation = `fallPetal ${duration}s linear`;

  document.body.appendChild(petal);

  setTimeout(function () {
    petal.remove();
  }, duration * 1000);

}


/* =========================
   AMBIENT PETALS (continuous, gentle)
========================= */

let ambientInterval = null;

function startAmbientPetals() {

  if (ambientInterval) return;

  ambientInterval = setInterval(function () {
    createPetal();
  }, 2600);

}

// Pause the ambient effect when the tab isn't visible, to be kind to battery
document.addEventListener("visibilitychange", function () {

  if (document.hidden) {

    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }

  } else if (!invitation.classList.contains("hidden")) {

    startAmbientPetals();

  }

});


/* =========================
   PETAL ANIMATION KEYFRAMES
========================= */

const injectedStyle = document.createElement("style");

injectedStyle.innerHTML = `
@keyframes fallPetal {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}
`;

document.head.appendChild(injectedStyle);


/* =========================
   TOAST NOTIFICATIONS
========================= */

function showToast(msg) {

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;

  document.body.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("show");
  }, 10);

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 2500);

}


/* =========================
   PREVENT BROKEN COUNTDOWN ON RELOAD
========================= */

window.addEventListener("load", function () {
  updateCountdown();
});


/* =========================
   SEND WISHES (via WhatsApp)
========================= */

function sendWishTo(number) {

  const nameField = document.getElementById("wishName");
  const messageField = document.getElementById("wishMessage");

  const name = nameField ? nameField.value.trim() : "";
  const message = messageField ? messageField.value.trim() : "";

  if (!message) {
    showToast("कृपया अपनी शुभकामनाएं लिखें 🙏");
    if (messageField) messageField.focus();
    return;
  }

  const greeting = name ? `नमस्ते! मैं ${name} हूं।` : "नमस्ते!";

  const text =
    `${greeting} मनीष ❤️ प्रियंका को मेरी हार्दिक शुभकामनाएं:\n\n${message}`;

  const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);

  window.open(url, "_blank");

  showToast("शुभकामनाएं भेजी जा रही हैं 💬");

}

const sendWishBtn = document.getElementById("sendWish");

if (sendWishBtn) {
  sendWishBtn.addEventListener("click", function () {
    sendWishTo("919792091604");
  });
}


/* =========================
   GUEST NAME PERSONALISATION
   (share a link like ?to=Sharma%20Parivar and the
   opening screen greets that guest by name)
========================= */

(function personaliseGreeting() {

  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");

  if (!guest) return;

  const greetingEl = document.getElementById("guestGreeting");

  if (greetingEl) {
    greetingEl.textContent = "🌸 स्नेह सहित आमंत्रण: " + guest;
    greetingEl.classList.remove("hidden");
  }

})();


/* =========================
   POP TEXT (the verse pops in
   word by word, then stays fully visible)
========================= */

const popLines = [
  ["ढोल", "ताशे", "हुए", "पुराने,"],
  ["डी.जे.", "का", "ज़माना", "है।"],
  ["मामू", "की", "शादी", "में"],
  ["जुलूल", "से", "जुलूल", "आना", "है।।"]
];

function startPopText() {

  const popTextEl = document.getElementById("popText");

  if (!popTextEl) return;

  // Avoid re-running if the invitation is opened more than once
  if (popTextEl.dataset.started === "true") return;
  popTextEl.dataset.started = "true";

  let lineIndex = 0;
  let wordIndex = 0;
  let globalIndex = 0;

  function showNextWord() {

    if (lineIndex >= popLines.length) return;

    const word = popLines[lineIndex][wordIndex];

    const span = document.createElement("span");
    span.textContent = word;

    // A little random tilt and bounce on each word, and alternating
    // colour, so the verse feels like it's being blurted out by a kid
    const tilt = (Math.random() * 16 - 8).toFixed(1) + "deg";
    const ty = (Math.random() * 8 - 4).toFixed(1) + "px";
    span.style.setProperty("--tilt", tilt);
    span.style.setProperty("--ty", ty);
    span.style.color = globalIndex % 2 === 0 ? "var(--ink)" : "var(--cream)";

    popTextEl.appendChild(span);
    popTextEl.appendChild(document.createTextNode(" "));

    // Force reflow so the pop animation reliably re-triggers
    void span.offsetWidth;
    span.classList.add("pop");

    wordIndex++;
    globalIndex++;

    if (wordIndex >= popLines[lineIndex].length) {
      popTextEl.appendChild(document.createElement("br"));
      lineIndex++;
      wordIndex = 0;
    }

    if (lineIndex < popLines.length) {
      setTimeout(showNextWord, 500);
    }

  }

  showNextWord();

}
