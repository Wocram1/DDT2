import { api } from "./api.js";

window.login = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await api("login", {
    username,
    password
  });

  if (res.success) {
    // ✅ HIER wird das Token gespeichert
    sessionStorage.setItem("token", res.token);

    showMainMenu();
  } else {
    alert(res.error);
  }
};
window.addEventListener("load", () => {
  const token = sessionStorage.getItem("token");

  if (token) {
    showMainMenu();
  }
});
const token = sessionStorage.getItem("token");

await api("startGame", { token });
/* ===== SCORING STATE ===== */
let currentMultiplier = 1; // 1 = Single, 2 = Double, 3 = Triple
let dartNr = 1;            // 1, 2 oder 3
let currentGameId = null;
window.setMultiplier = function (m) {
  currentMultiplier = m;
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

  if (dartNr > 3) {
    dartNr = 1;
    // hier später: Spielerwechsel / nächste Runde
  }
};
window.startQuickplay = async function () {
  const token = sessionStorage.getItem("token");

  const res = await api("startGame", { token });
  if (res.success) {
    currentGameId = res.gameId;
    dartNr = 1;
    currentMultiplier = 1;
    showScoringUI();
  }
};
const app = document.getElementById("app");

app.innerHTML = `
  <div class="menu">
    <button class="glass">Games</button>
    <button class="glass">Stats</button>
    <button class="glass" onclick="startQuickplay()">Quickplay</button>
  </div>

  <div class="xp-bar">
    <div class="xp-fill" style="width: 40%"></div>
  </div>

  <div id="scoring">
    <div class="mode">
      <button data-m="1">S-1</button>
      <button data-m="2">D-1</button>
      <button data-m="3">T-1</button>
    </div>
    <div class="numbers">
      <button data-n="1">1</button>
      ...
      <button data-n="20">20</button>
    </div>
    <div class="special">
      <button data-bull="25">BULL</button>
      <button data-bull="50">BULL</button>
      <button data-miss>MISS</button>
    </div>
  </div>

  <button onclick="setMultiplier(1)">S</button>
  <button onclick="setMultiplier(2)">D</button>
  <button onclick="setMultiplier(3)">T</button>
`;
