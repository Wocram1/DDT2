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
