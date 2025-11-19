let res = document.getElementById("res");


let statusLog = localStorage.getItem('statusLog')
console.log(statusLog)

if(statusLog === "true"){
    onload = ()=>{
        fetch(`http://localhost:3000/usuario?statusLog=${statusLog}`)
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
            <th>Usuario</th>
            <th>CPF</th>
        </thead>`

    tab += `<tbody>`
    dados.forEach(dad => {
        tab += `
            <tr>
                <td>${dad.nome}</td>
                <td>${dad.cpf}</td>
            </tr> 
        `
    })

    tab += `</tbody>`

    return tab
}



