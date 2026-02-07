import { api } from "./api.js";

/* ======== ELEMENT REFERENCES ======== */
const app = document.getElementById("app");

/* ======== UI TEMPLATES ======== */
const loginUI = `
  <div class="login-container">
    <h2>Login</h2>
    <input id="username" placeholder="Name" type="text" />
    <input id="password" placeholder="Passwort" type="password" />
    <button id="btnLogin">Login</button>

    <h2>Registrieren</h2>
    <input id="reg_username" placeholder="Name" type="text" />
    <input id="reg_password" placeholder="Passwort" type="password" />
    <input id="invite" placeholder="Einladungs-Code" type="text" />
    <button id="btnRegister">Register</button>
  </div>
`;

const menuUI = `
  <div class="menu">
    <button id="btnGames" class="glass">Games</button>
    <button id="btnStats" class="glass">Stats</button>
    <button id="btnQuickplay" class="glass">Quickplay</button>
  </div>
`;

/* ======== RENDER LOGIN ======== */
function renderLogin() {
  app.innerHTML = loginUI;

  document.getElementById("btnLogin").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await api("login", { username, password });
    if (res.success) {
      sessionStorage.setItem("token", res.token);
      renderMenu();
    } else {
      alert(res.error);
    }
  });

  document.getElementById("btnRegister").addEventListener("click", async () => {
    const username = document.getElementById("reg_username").value;
    const password = document.getElementById("reg_password").value;
    const inviteCode = document.getElementById("invite").value;

    const res = await api("register", { username, password, inviteCode });
    if (res.success) {
      sessionStorage.setItem("token", res.token);
      renderMenu();
    } else {
      alert(res.error);
    }
  });
}

/* ======== RENDER MENU ======== */
function renderMenu() {
  app.innerHTML = menuUI;

  document.getElementById("btnQuickplay").addEventListener("click", () => {
    startQuickplay();
  });

  // später: btnGames, btnStats ergänzen
}

/* ======== QUICKPLAY ======== */
async function startQuickplay() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Bitte einloggen!");
    renderLogin();
    return;
  }

  const res = await api("startGame", { token });
  if (res.success) {
    alert("Spiel gestartet!");
    // hier später Scoring anzeigen
  } else {
    alert(res.error);
  }
}

/* ======== INITIALIZE ======== */
const token = sessionStorage.getItem("token");
if (token) {
  renderMenu();
} else {
  renderLogin();
}
