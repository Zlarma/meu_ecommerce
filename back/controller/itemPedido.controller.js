const ItemPedido = require("../models/ItemPedido");
const Produto = require("../models/Produto");

// Expor só operações básicas (na prática criação é controlada via pedido.controller)
const listar = async (req, res) => {
  try {
    const itens = await ItemPedido.findAll({
      include: [{ model: Produto, as: "produtoItem" }]
    });
    res.status(200).json(itens);
  } catch (err) {
    console.error("Erro listar itens:", err);
    res.status(500).json({ message: "Erro ao listar itens de pedido." });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const item = await ItemPedido.findByPk(req.params.id, {
      include: [{ model: Produto, as: "produtoItem" }]
    });
    if (!item) return res.status(404).json({ message: "Item não encontrado." });
    res.status(200).json(item);
  } catch (err) {
    console.error("Erro buscar item:", err);
    res.status(500).json({ message: "Erro ao buscar item de pedido." });
  }
};

module.exports = { listar, buscarPorId };
