const Entrega = require("../models/Entrega");
const Pedido = require("../models/Pedido");

// listar entregas, buscar por id, atualizar status/dados
const listar = async (req, res) => {
  try {
    const entregas = await Entrega.findAll({
      include: [{ model: Pedido, as: "pedidoEntrega" }]
    });
    res.status(200).json(entregas);
  } catch (err) {
    console.error("Erro listar entregas:", err);
    res.status(500).json({ message: "Erro ao listar entregas." });
  }
};

const buscarPorId = async (req, res) => {
  try {
    const entrega = await Entrega.findByPk(req.params.id, {
      include: [{ model: Pedido, as: "pedidoEntrega" }]
    });
    if (!entrega) return res.status(404).json({ message: "Entrega não encontrada." });
    res.status(200).json(entrega);
  } catch (err) {
    console.error("Erro buscar entrega:", err);
    res.status(500).json({ message: "Erro ao buscar entrega." });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    await Entrega.update(req.body, { where: { codEntrega: id } });
    res.status(200).json({ message: "Entrega atualizada." });
  } catch (err) {
    console.error("Erro atualizar entrega:", err);
    res.status(500).json({ message: "Erro ao atualizar entrega." });
  }
};

module.exports = { listar, buscarPorId, atualizar };
