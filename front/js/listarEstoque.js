let res = document.getElementById("res");

let statusLog = localStorage.getItem("statusLog");
console.log(statusLog);

if (statusLog === "true") {
  onload = () => {
    fetch(`http://localhost:3000/estoque?statusLog=${statusLog}`)
      .then((resp) => resp.json())
      .then((dados) => {
        listar.innerHTML = ``;
        listar.innerHTML += `<table>${gerarTabela(dados)}</table>`;
      })
      .catch((err) => {
        console.error("Erro ao listar os dados", err);
      });
  };
} else {
  location.href = "../index.html";
}

function gerarTabela(dados) {
  console.log("-----------------");
  console.log(dados);
  let tab = `
        <thead>
            <th>cod Produto</th>
            <th>cod Usuario</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>qtdeMovimento</th>
        </thead>`;

  tab += `<tbody>`;
  dados.forEach((dad) => {
    tab += `
            <tr>
                <td>${dad.idProduto}</td>
                <td>${dad.idUsuario}</td>
                <td>${dad.data}</td>
                <td>${dad.tipo}</td>
                <td>${dad.qtdeMovimento}</td>
            </tr> 
        `;
  });

  tab += `</tbody>`;

  return tab;
}
