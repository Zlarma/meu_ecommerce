let res = document.getElementById("res");

const cadastrar = document.getElementById("cadastrar");

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

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  let nome = document.getElementById("nome").value;
  let email = document.getElementById("email").value;
  let cpf = document.getElementById("cpf").value;
  let identidade = document.getElementById("identidade").value;
  let telefone = document.getElementById("telefone").value;
  let senha = document.getElementById("senha").value;
  let tipo_usuario = document.getElementById("tipo_usuario").value;

  const valores = {
    nome: nome,
    email: email,
    identidade: identidade,
    tipo_usuario: tipo_usuario,
    cpf: cpf,
    telefone: telefone,
    senha: senha,
  };

  res.innerHTML = ``;

  fetch(`http://localhost:3000/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valores),
  })
    .then((resp) => resp.json())
    .then((dados) => {
      console.log(dados);
      res.innerHTML += `Nome: ${dados.nome} <br>`;
      res.innerHTML += `Email: ${dados.email} <br>`;
      res.innerHTML += `Identidade: ${dados.identidade} <br>`;
      res.innerHTML += `Tipo Usuario: ${dados.tipo_usuario} <br>`;
      res.innerHTML += `CPF: ${dados.cpf} <br>`;
      res.innerHTML += `Telefone: ${dados.telefone} <br>`;
      res.innerHTML += `Senha: ${dados.senha} <br>`;
    })
    .catch((err) => {
      console.error("Erro ao cadastrar o usuario", err);
    });
});
