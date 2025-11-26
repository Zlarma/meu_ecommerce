let res = document.getElementById("res");


const nomeUsuario = document.getElementById("nomeUsuario");
const logout = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  const nome = localStorage.getItem("nome");
  if (nome) {
    nomeUsuario.textContent = nome;
  }
});

logout.addEventListener("click", () => {
  localStorage.clear();
  nomeUsuario.textContent = "";
  alert("Você deslogou.");
});
