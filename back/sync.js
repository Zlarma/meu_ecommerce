const db = require('./db/conn') 

const { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido, 
    Entrega, 
    Estoque 
} = require('./models/rel') 

async function syncDataBase(){
    try{
        await db.sync({ force: true }) 
        
        console.log('----------------------------')
        console.log('Banco de Dados sincronizado!')
        console.log('----------------------------')

    }catch(error){
        console.error('ERRO: Não foi possível sincronizar o banco de dados!', error)
    } finally {
        await db.close()
        console.log('Conexão com o banco de dados fechada.')
    }
}

// Chamar a função para sincronizar o banco de dados
syncDataBase()
