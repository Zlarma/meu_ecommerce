const jwt = require('jsonwebtoken')
const SEGREDO = 'minha_chave_super_secreta_do_sistema'

function gerarToken(payload){
    return jwt.sign(payload, SEGREDO, { expiresIn: '3h'})
}

function verificarToken(token){
    try{
        return jwt.verify(token,SEGREDO)
    }catch(error){
        console.error('Erro ao verificar o token', error)
        return null
    }
}

module.exports = { gerarToken, verificarToken }
