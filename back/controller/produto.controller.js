const Produto = require('../models/Produto')

const cadastrar = async (req,res)=>{
    const valores = req.body
    console.log(valores)

    if(!valores.nome || !valores.marca || !valores.preco){
        return res.status(400).json({message: 'Campos Obrigatórios'})
    }

    try{
        let dados = await Produto.create(valores)
        res.status(201).json({message: 'Produto cadastrado com sucesso!', dados})
    }catch(err){
        console.log('Erro ao cadastrar produto!',err)
        res.status(500).json({message: 'Erro ao cadastrar produto!'})
    }
}
const listar = async (req,res)=>{

    try{
        let dados = await Produto.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.log('Erro ao listar produtos!',err)
        res.status(500).json({message: 'Erro ao listar produtos!'})
    }
}
const atualizar = async (req,res)=>{
    const id = req.params.id
    const valores = req.body
    console.log('id: ',id)
    console.log(valores)

    if(!valores.nome || !valores.marca || !valores.preco){
        return res.status(400).json({message: 'Campos Obrigatórios'})
    }

    try{
        let dados = await Produto.findByPk(id)

        if(!dados){
            return res.status(404).json({message: 'Produto não encontrado'})
        }else{
            await Produto.update(valores, {where: { codProduto: id }})
            dados = await Produto.findByPk(id)
            res.status(200).json({message: 'Produto atualizado com sucesso!'})
        }

        
    }catch(err){
        console.log('Erro ao atualizar produto!',err)
        res.status(500).json({message: 'Erro ao atualizar produto!'})
    }
}
const apagar = async (req,res)=>{
    const id = req.params.id
    console.log('id: ',id)

    try{
        let dados = await Produto.findByPk(id)

        if(!dados){
            return res.status(404).json({message: 'Produto não encontrado'})
        }else{
            await Produto.destroy({where: { codProduto: id }})
            res.status(204).json({message: 'Produto excluído com sucesso!'})
        }
        
    }catch(err){
        console.log('Erro ao excluir produto!',err)
        res.status(500).json({message: 'Erro ao excluir produto!'})
    }
}
const consultar = async (req,res)=>{
    const valores = req.body
    console.log(valores)

    if(!valores.nome){
        return res.status(400).json({message: 'Campos Obrigatórios'})
    }

    try{
        let dados = await Produto.findOne({where: { nome: valores.nome}})
        if(!dados){
            return res.status(404).json({message: 'Produto não encontrado!'})
        }else{
            res.status(200).json(dados)
        }
    }catch(err){
        console.log('Erro ao consultar produto!',err)
        res.status(500).json({message: 'Erro ao consultar produto!'})
    }
}




module.exports = { cadastrar, listar, atualizar, apagar, consultar }