let res = document.getElementById("res");

const cadastrar = document.getElementById("cadastrar");

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  let idProduto = document.getElementById("idProduto").value;
  let idUsuario = document.getElementById("idUsuario").value;
  let data = document.getElementById("data").value;
  let tipo = document.getElementById("tipo").value;
  let qtdeMovimento = document.getElementById("qtdeMovimento").value;

  const valores = {
    idProduto: idProduto,
    idUsuario: idUsuario,
    data: data,
    tipo: tipo,
    qtdeMovimento: qtdeMovimento,
  };

  res.innerHTML = ``;

  fetch(`http://localhost:3000/estoque`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valores),
  })
    .then((resp) => resp.json())
    .then((dados) => {
      console.log(dados);
      res.innerHTML += `Marca: ${dados.idProduto} <br>`;
      res.innerHTML += `Nome: ${dados.idUsuario} <br>`;
      res.innerHTML += `Quantidade: ${dados.data} <br>`;
      res.innerHTML += `Preço: ${dados.tipo} <br>`;
      res.innerHTML += `Preço: ${dados.qtdeMovimento} <br>`;
    })
    .catch((err) => {
      console.error("Erro ao cadastrar o produto", err);
    });
});
