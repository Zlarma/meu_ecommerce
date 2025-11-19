let res = document.getElementById("res");

const cadastrar = document.getElementById("cadastrar");

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  let nome = document.getElementById("nome").value;
  let cpf = document.getElementById("cpf").value;
  let telefone = document.getElementById("telefone").value;
  let senha = document.getElementById("senha").value;

  const valores = {
    nome: nome,
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
      res.innerHTML += `CPF: ${dados.cpf} <br>`;
      res.innerHTML += `Telefone: ${dados.telefone} <br>`;
      res.innerHTML += `Senha: ${dados.senha} <br>`;
    })
    .catch((err) => {
      console.error("Erro ao cadastrar o usuario", err);
    });
});
