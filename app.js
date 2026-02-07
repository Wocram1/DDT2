import { api } from "./api.js";

/* ======== UI HELPERS ======== */
function showLogin() {
  document.getElementById("login").style.display = "block";
  document.querySelector(".menu").style.display = "none";
  document.getElementById("scoring").style.display = "none";
}

function showMainMenu() {
  document.getElementById("login").style.display = "none";
  document.querySelector(".menu").style.display = "flex";
  document.getElementById("scoring").style.display = "none";
}

function showScoringUI() {
  document.getElementById("login").style.display = "none";
  document.querySelector(".menu").style.display = "none";
  document.getElementById("scoring").style.display = "block";
}

/* ======== LOGIN ======== */
window.login = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await api("login", { username, password });

  if (res.success) {
    sessionStorage.setItem("token", res.token);
    showMainMenu();
  } else {
    alert(res.error);
  }
};

window.register = async function () {
  const username = document.getElementById("reg_username").value;
  const password = document.getElementById("reg_password").value;
  const inviteCode = document.getElementById("invite").value;

  const res = await api("register", { username, password, inviteCode });

  if (res.success) {
    sessionStorage.setItem("token", res.token);
    showMainMenu();
  } else {
    alert(res.error);
  }
};

/* ======== QUICKPLAY ======== */
let currentMultiplier = 1;
let dartNr = 1;
let currentGameId = null;

window.setMultiplier = function (m) {
  currentMultiplier = m;
};

window.startQuickplay = async function () {
  const token = sessionStorage.getItem("token");
  const res = await api("startGame", { token });

  if (res.success) {
    currentGameId = res.gameId;
    dartNr = 1;
    currentMultiplier = 1;
    showScoringUI();
  } else {
    alert(res.error);
  }
};

window.registerHit = async function (value) {
  const token = sessionStorage.getItem("token");
  const points = value * currentMultiplier;

  await api("throw", {
    token,
    gameId: currentGameId,
    dartNr,
    target: value,
    multiplier: currentMultiplier,
    points
  });

  dartNr++;
  if (dartNr > 3) dartNr = 1;
};

/* ======== UI RENDER ======== */
const app = document.getElementById("app");

const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
const numberButtons = numbers.map(n => `<button onclick="registerHit(${n})">${n}</button>`).join("");

app.innerHTML = `
  <div id="login">
    <h2>Login</h2>
    <input id="username" placeholder="Name" />
    <input id="password" placeholder="Password" type="password" />
    <button onclick="login()">Login</button>

    <h2>Register</h2>
    <input id="reg_username" placeholder="Name" />
    <input id="reg_password" placeholder="Password" type="password" />
    <input id="invite" placeholder="Invite Code" />
    <button onclick="register()">Register</button>
  </div>

  <div class="menu" style="display:none;">
    <button class="glass">Games</button>
    <button class="glass">Stats</button>
    <button class="glass" onclick="startQuickplay()">Quickplay</button>
  </div>

  <div class="xp-bar">
    <div class="xp-fill" style="width: 40%"></div>
  </div>

  <div id="scoring" style="display:none;">
    <div class="mode">
      <button onclick="setMultiplier(1)">S-1</button>
      <button onclick="setMultiplier(2)">D-1</button>
      <button onclick="setMultiplier(3)">T-1</button>
    </div>

    <div class="numbers">
      ${numberButtons}
    </div>

    <div class="special">
      <button onclick="registerHit(25)">BULL</button>
      <button onclick="registerHit(50)">BULL</button>
      <button onclick="registerHit(0)">MISS</button>
    </div>
  </div>
`;

/* ======== INIT ======== */
const token = sessionStorage.getItem("token");
if (token) showMainMenu();
else showLogin();
