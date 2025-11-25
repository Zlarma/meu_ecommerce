const Produto = require("../models/Produto");
const Estoque = require("../models/Estoque");

const cadastrar = async (req, res) => {
  try {
    const { nome, descricao, modelo, preco, imagem_url, ativo } = req.body;
    if (!nome || preco == null) return res.status(400).json({ message: "Nome e preço são obrigatórios." });

    const produto = await Produto.create({ nome, descricao, modelo, preco, imagem_url, ativo });

    // cria estoque inicial (quantidade 0)
    await Estoque.create({
      idProduto: produto.codProduto,
      quantidade_atual: 0,
      quantidade_minima: 0
    });

    res.status(201).json(produto);
  } catch (err) {
    console.error("Erro cadastrar produto:", err);
    res.status(500).json({ message: "Erro ao cadastrar produto." });
  }
};

const listar = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [{ model: Estoque, as: "estoqueProduto" }]
    });
    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro listar produtos:", err);
    res.status(500).json({ message: "Erro ao listar produtos." });
  }
};

const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findByPk(id, {
      include: [{ model: Estoque, as: "estoqueProduto" }]
    });
    if (!produto) return res.status(404).json({ message: "Produto não encontrado." });
    res.status(200).json(produto);
  } catch (err) {
    console.error("Erro buscar produto:", err);
    res.status(500).json({ message: "Erro ao buscar produto." });
  }
};

const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    await Produto.update(req.body, { where: { codProduto: id } });
    res.status(200).json({ message: "Produto atualizado." });
  } catch (err) {
    console.error("Erro atualizar produto:", err);
    res.status(500).json({ message: "Erro ao atualizar produto." });
  }
};

const excluir = async (req, res) => {
  const { id } = req.params;
  try {
    await Produto.destroy({ where: { codProduto: id } });
    res.status(200).json({ message: "Produto excluído." });
  } catch (err) {
    console.error("Erro excluir produto:", err);
    res.status(500).json({ message: "Erro ao excluir produto." });
  }
};

module.exports = { cadastrar, listar, buscarPorId, atualizar, excluir };