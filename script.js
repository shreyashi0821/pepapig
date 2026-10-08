const pig = document.getElementById("pig");
const speech = document.getElementById("speech");
const splashCount = document.getElementById("splashCount");
const rain = document.getElementById("rain");

const phrases = [
  "Oink oink! 🐽",
  "I love muddy puddles!",
  "Hee hee hee! 😄",
  "Let's play outside!",
  "Where's my teddy? 🧸",
  "Snort! That tickles!",
  "Daddy, look at me jump!",
];

let splashes = 0;

function say(text) {
  speech.textContent = text;
  speech.animate(
    [{ transform: "scale(.6)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }],
    { duration: 300 }
  );
}

function oink() {
  say(phrases[Math.floor(Math.random() * phrases.length)]);
  pig.classList.remove("wave");
  void pig.offsetWidth;
  pig.classList.add("wave");
  playOink();
}

function jump() {
  pig.classList.remove("jump");
  void pig.offsetWidth;
  pig.classList.add("jump");
  say("Wheee! SPLASH! 💦");
  setTimeout(splash, 350);
}

function splash() {
  splashes++;
  splashCount.textContent = splashes;
  const rect = pig.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.bottom;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("div");
    s.className = "splash";
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", (Math.random() - 0.5) * 260 + "px");
    s.style.setProperty("--dy", -Math.random() * 160 + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

function makeRain() {
  say("Yay, rain means more puddles! ☔");
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const d = document.createElement("div");
      d.className = "drop";
      d.style.left = Math.random() * 100 + "vw";
      d.style.animationDuration = 0.6 + Math.random() * 0.6 + "s";
      rain.appendChild(d);
      setTimeout(() => d.remove(), 1300);
    }, i * 25);
  }
}

// Tiny synthesized "oink" so no audio files are needed
let audioCtx;
function playOink() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18].forEach((delay) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const t = audioCtx.currentTime + delay;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.15);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.17);
    });
  } catch (e) {
    /* audio not available */
  }
}

pig.addEventListener("click", oink);
document.getElementById("oinkBtn").addEventListener("click", oink);
document.getElementById("jumpBtn").addEventListener("click", jump);
document.getElementById("rainBtn").addEventListener("click", makeRain);
