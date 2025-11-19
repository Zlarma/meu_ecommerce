let res = document.getElementById("res");
let nomeUsuario = document.getElementById("nomeUsuario");

const logout = document.getElementById("logout");

const login = document.getElementById("login");

login.addEventListener("click", (e) => {
  e.preventDefault();

  let cpf = document.getElementById("cpf").value;
  let senha = document.getElementById("senha").value;

  const valores = {
    cpf: cpf,
    senha: senha,
  };

  fetch(`http://localhost:3000/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valores),
  })
    .then((resp) => resp.json())
    .then((dados) => {
      console.log(dados);

      localStorage.setItem("nome", dados.nome);
      localStorage.setItem("statusLog", dados.statusLog);

      nomeUsuario.innerHTML = dados.nome;

      res.innerHTML = "";
      res.innerHTML += dados.message;
    })
    .catch((err) => {
      console.error("Erro ao fazer o login!", err);
    });
});

logout.addEventListener("click", () => {
  localStorage.clear();
});
