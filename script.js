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

// ---------- Tic Tac Toe ----------
const PIG = "🐷";
const DINO = "🦖";
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const cells = [...document.querySelectorAll(".cell")];
const gameStatus = document.getElementById("gameStatus");
const difficulty = document.getElementById("difficulty");
const tally = { pig: 0, dino: 0, draw: 0 };
let board, gameOver;

function newGame() {
  board = Array(9).fill(null);
  gameOver = false;
  cells.forEach((c) => {
    c.textContent = "";
    c.disabled = false;
    c.classList.remove("win", "placed");
  });
  gameStatus.textContent = "Your turn, Pepa! Tap a square.";
}

function winner(b) {
  for (const line of LINES) {
    const [a, x, y] = line;
    if (b[a] && b[a] === b[x] && b[a] === b[y]) return { mark: b[a], line };
  }
  return b.every(Boolean) ? { mark: "draw" } : null;
}

function place(i, mark) {
  board[i] = mark;
  cells[i].textContent = mark;
  cells[i].disabled = true;
  cells[i].classList.add("placed");
}

function finish(result) {
  gameOver = true;
  cells.forEach((c) => (c.disabled = true));
  if (result.mark === "draw") {
    tally.draw++;
    gameStatus.textContent = "It's a draw! Let's jump in a puddle instead 💦";
  } else {
    result.line.forEach((i) => cells[i].classList.add("win"));
    if (result.mark === PIG) {
      tally.pig++;
      gameStatus.textContent = "Hooray! Pepa wins! 🎉 Oink oink!";
      say("I won! Hee hee! 🎉");
      playOink();
      splash();
    } else {
      tally.dino++;
      gameStatus.textContent = "Grrr! The dinosaur wins this time 🦖";
      say("Oh no! Rematch? 🥺");
    }
  }
  document.getElementById("winsPig").textContent = tally.pig;
  document.getElementById("winsDino").textContent = tally.dino;
  document.getElementById("draws").textContent = tally.draw;
}

// Minimax: score from the dinosaur's point of view
function minimax(b, turn) {
  const r = winner(b);
  if (r) return r.mark === DINO ? 1 : r.mark === PIG ? -1 : 0;
  const scores = [];
  b.forEach((v, i) => {
    if (v) return;
    b[i] = turn;
    scores.push(minimax(b, turn === DINO ? PIG : DINO));
    b[i] = null;
  });
  return turn === DINO ? Math.max(...scores) : Math.min(...scores);
}

function bestMove() {
  let best = -Infinity, move = null;
  board.forEach((v, i) => {
    if (v) return;
    board[i] = DINO;
    const s = minimax(board, PIG);
    board[i] = null;
    if (s > best) { best = s; move = i; }
  });
  return move;
}

function randomMove() {
  const free = board.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  return free[Math.floor(Math.random() * free.length)];
}

function dinoMove() {
  const level = difficulty.value;
  const smartChance = level === "hard" ? 1 : level === "medium" ? 0.6 : 0.15;
  return Math.random() < smartChance ? bestMove() : randomMove();
}

cells.forEach((cell) =>
  cell.addEventListener("click", () => {
    const i = +cell.dataset.i;
    if (gameOver || board[i]) return;
    place(i, PIG);
    let r = winner(board);
    if (r) return finish(r);

    gameOver = true; // lock board while dino thinks
    cells.forEach((c) => (c.disabled = true));
    gameStatus.textContent = "Dinosaur is thinking... 🦖💭";
    setTimeout(() => {
      gameOver = false;
      board.forEach((v, j) => (cells[j].disabled = !!v));
      place(dinoMove(), DINO);
      r = winner(board);
      if (r) return finish(r);
      gameStatus.textContent = "Your turn, Pepa!";
    }, 600);
  })
);

document.getElementById("resetGame").addEventListener("click", newGame);
difficulty.addEventListener("change", newGame);
newGame();

pig.addEventListener("click", oink);
document.getElementById("oinkBtn").addEventListener("click", oink);
document.getElementById("jumpBtn").addEventListener("click", jump);
document.getElementById("rainBtn").addEventListener("click", makeRain);
