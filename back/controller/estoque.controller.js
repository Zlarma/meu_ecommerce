const Estoque = require("../models/Estoque");
const Produto = require("../models/Produto");

// listar estoques
const listar = async (req, res) => {
  try {
    const estoques = await Estoque.findAll({
      include: [{ model: Produto, as: "produtoEstoque" }]
    });
    res.status(200).json(estoques);
  } catch (err) {
    console.error("Erro listar estoques:", err);
    res.status(500).json({ message: "Erro ao listar estoques." });
  }
};

// ver estoque por produto
const buscarPorProduto = async (req, res) => {
  const { idProduto } = req.params;
  try {
    const estoque = await Estoque.findOne({ where: { idProduto } });
    if (!estoque) return res.status(404).json({ message: "Estoque não encontrado." });
    res.status(200).json(estoque);
  } catch (err) {
    console.error("Erro buscar estoque:", err);
    res.status(500).json({ message: "Erro ao buscar estoque." });
  }
};

// alterar quantidades (incrementa/decrementa)
const atualizarQuantidade = async (req, res) => {
  const { idProduto } = req.params;
  const { delta } = req.body; // delta pode ser positivo ou negativo
  try {
    const estoque = await Estoque.findOne({ where: { idProduto } });
    if (!estoque) return res.status(404).json({ message: "Estoque não encontrado." });

    const nova = (estoque.quantidade_atual || 0) + Number(delta || 0);
    if (nova < 0) return res.status(400).json({ message: "Quantidade não pode ficar negativa." });

    estoque.quantidade_atual = nova;
    await estoque.save();

    res.status(200).json(estoque);
  } catch (err) {
    console.error("Erro atualizar estoque:", err);
    res.status(500).json({ message: "Erro ao atualizar estoque." });
  }
};

module.exports = { listar, buscarPorProduto, atualizarQuantidade };
