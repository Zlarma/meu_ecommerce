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
  alert("Você deslogou.")
});

const cadastrar = document.getElementById("cadastrar");

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  let nome = document.getElementById("nome").value;
  let marca = document.getElementById("marca").value;
  let quantidade = document.getElementById("quantidade").value;
  let preco = document.getElementById("preco").value;

  const valores = {
    nome: nome,
    marca: marca,
    quantidade: quantidade,
    preco: preco,
  };

  res.innerHTML = ``;

  fetch(`http://localhost:3000/produto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valores),
  })
    .then((resp) => resp.json())
    .then((dados) => {
      console.log(dados);
      res.innerHTML += `Nome: ${dados.nome} <br>`;
      res.innerHTML += `Marca: ${dados.marca} <br>`;
      res.innerHTML += `Quantidade: ${dados.quantidade} <br>`;
      res.innerHTML += `Preço: ${dados.preco} <br>`;
    })
    .catch((err) => {
      console.error("Erro ao cadastrar o produto", err);
    });
});
