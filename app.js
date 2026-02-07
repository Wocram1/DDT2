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
