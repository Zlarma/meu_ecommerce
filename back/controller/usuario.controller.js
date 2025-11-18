const Usuario = require('../models/Usuario')

const cadastrar = async (req,res)=>{
    const valores = req.body
    
    if( !valores.nome || !valores.senha){
        return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    try{
        const dados = await Usuario.create(valores)
        res.status(201).json(dados)
    }catch(err){
        console.error('Erro ao cadastrar os dados',err)
        res.status(500).json({message: "Erro ao cadastrar os dados!"})
    }
}

module.exports = { cadastrar }