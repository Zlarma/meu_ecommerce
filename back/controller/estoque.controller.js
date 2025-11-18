const Usuario = require("../models/Usuario");
const Estoque = require("../models/Estoque");
const Produto = require("../models/Produto");

const cadastrar = async (req, res) => {
  const valores = req.body;
  if (
    !valores.idUsuario ||
    !valores.idProduto ||
    !valores.data ||
    !valores.tipo ||
    !valores.qtdeMovimento
  ) {
    req.status(400).json({ message: "TODOS os campos devem ser preenchidos" });
  }

  try {
    const produto = await Produto.findByPk(valores.idProduto);
    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado!" });
    }
    const usuario = await Usuario.findByPk(valores.idUsuario);
    if (!usuario) {
      res.status(404).json({ message: "Produto não encontrado!" });
    }

    let novaQuantidade = produto.quantidade;
    if (valores.tipo === "ENTRADA") {
      novaQuantidade += valores.qtdeMovimento;
    } else if (valores.tipo === "SAIDA") {
      if (produto.quantidade < valores.qtdeMovimento) {
        return res.status(400).json({ message: "Estoque insuficiente!" });
      }
      novaQuantidade -= valores.qtdeMovimento;
    } else {
      return res.status(400).json({ message: "Tipo de movimentação invalida" });
    }
    await produto.update({ quantidade: novaQuantidade });

    const movimento = await Estoque.create({
      idUsuario: valores.idUsuario,
      idProduto: valores.idProduto,
      data: valores.data,
      tipo: valores.tipo,
      qtdeMovimento: valores.qtdeMovimento,
    });

    res.status(201).json({
      message: "Registro realizado com sucesso. . . ",
      novaQuantidade,
      movimento,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar os dados" });
    console.error("Erro ao cadastrar os dados!", error);
  }
};

const listar = async (req, res) => {
  try {
    const dados = await Estoque.findAll();
    res.status(200).json(dados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar os dados" });
    console.error("Erro ao listar os dados!", error);
  }
};

module.exports = { cadastrar, listar };
