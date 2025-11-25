const res = document.getElementById("res");
const nomeUsuario = document.getElementById("nomeUsuario");
const logout = document.getElementById("logout");
const loginBtn = document.getElementById("login");

// se já tem usuário logado, mostra o nome (ao carregar a página)
document.addEventListener('DOMContentLoaded', () => {
  const nome = localStorage.getItem('nome');
  if (nome) {
    nomeUsuario.textContent = nome;
  }
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const valores = { email, senha };

  try {
    const resp = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valores),
    });

    const dados = await resp.json();

    if (!resp.ok) {
      // mostra a mensagem de erro enviada pelo backend (error ou message)
      res.innerText = dados.error || dados.message || "Erro no login";
      return;
    }

    // sucesso: salva token + info do usuário
    localStorage.setItem("token", dados.token);
    localStorage.setItem("nome", dados.user.nome);
    localStorage.setItem("tipo_usuario", dados.user.tipo_usuario);
    localStorage.setItem("codUsuario", dados.user.codUsuario);

    // atualiza a UI
    nomeUsuario.textContent = dados.user.nome;
    res.innerText = dados.message || "Logado com sucesso!";

  } catch (err) {
    console.error("Erro ao fazer o login!", err);
    res.innerText = "Erro de rede ao conectar ao servidor.";
  }
});

logout.addEventListener("click", () => {
  localStorage.clear();
  nomeUsuario.textContent = "";
});
