const Usuario = require("../models/Usuario");
const Pedido = require("../models/Pedido");
const { hashSenha } = require("../service/bcrypt.service");

// cadastrar, listar, buscar por id, atualizar, deletar
const cadastrar = async (req, res) => {
  const valores = req.body;
  if (!valores.nome || !valores.email || !valores.senha || !valores.telefone || !valores.cpf) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes." });
  }

  try {
    if (valores.senha) valores.senha = await hashSenha(valores.senha);

    const usuario = await Usuario.create(valores);
    res.status(201).json(usuario);
  } catch (err) {
    console.error("Erro cadastrar usuario:", err);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
};

const listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Pedido, as: "pedidosUsuario" }]
    });
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Erro listar usuarios:", err);
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
};

const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Pedido, as: "pedidosUsuario" }]
    });
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
    res.status(200).json(usuario);
  } catch (err) {
    console.error("Erro buscar usuario:", err);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
};

const atualizar = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  try {
    if (dados.senha) dados.senha = await hashSenha(dados.senha);
    await Usuario.update(dados, { where: { codUsuario: id } });
    res.status(200).json({ message: "Usuário atualizado." });
  } catch (err) {
    console.error("Erro atualizar usuario:", err);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

const deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.destroy({ where: { codUsuario: id } });
    res.status(200).json({ message: "Usuário removido." });
  } catch (err) {
    console.error("Erro deletar usuario:", err);
    res.status(500).json({ message: "Erro ao deletar usuário." });
  }
};

module.exports = { cadastrar, listar, buscarPorId, atualizar, deletar };
