let res = document.getElementById("res");


let statusLog = localStorage.getItem('statusLog')
console.log(statusLog)

if(statusLog === "true"){
    onload = ()=>{
        fetch(`http://localhost:3000/produto?statusLog=${statusLog}`)
            .then(resp => resp.json())
            .then(dados => {
    
                listar.innerHTML = ``
                listar.innerHTML += `<table>${gerarTabela(dados)}</table>`
            })
            .catch((err) => {
                console.error('Erro ao listar os dados', err)
            })
    }

}else{
    location.href = '../index.html'
}

function gerarTabela(dados) {
    console.log('-----------------')
    console.log(dados)
    let tab = `
        <thead>
            <th>Produtos</th>
            <th>Marca</th>
            <th>Quantidade</th>
            <th>Preço</th>
        </thead>`

    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `
            <tr>
                <td>${dad.nome}</td>
                <td>${dad.marca}</td>
                <td>${dad.quantidade}</td>
                <td>${dad.preco}</td>
            </tr> 
        `
    })

    tab += `</tbody>`

    return tab
}



