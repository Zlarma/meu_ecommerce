const Pedido = require("../models/Pedido");
const ItemPedido = require("../models/ItemPedido");
const Produto = require("../models/Produto");
const Estoque = require("../models/Estoque");
const Entrega = require("../models/Entrega");

// util: gerar código de rastreio simples
const gerarCodigoRastreio = () => {
  return "BR" + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// criar pedido (COM TRANSAÇÃO)
// body esperado:
// {
//   idUsuario,
//   valorFrete,   // number (opcional, default 0)
//   entrega: { cep, logradouro, numero, complemento, bairro, localidade, uf }, // dados de entrega
//   items: [ { idProduto, quantidade } ]
// }
const criarPedido = async (req, res) => {
  const idUsuario = req.user && req.user.codUsuario;
  const { valorFrete = 0, entrega, items } = req.body;

  if (!idUsuario || !Array.isArray(items) || items.length === 0 || !entrega) {
    return res.status(400).json({ message: "Dados do pedido incompletos." });
  }
  const sequelize = Pedido.sequelize; // pega instancia do sequelize a partir do model

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // cria pedido com valores iniciais
    const pedido = await Pedido.create(
      {
        idUsuario,
        valorFrete,
        valorSubtotal: 0,
        valorTotal: 0,
        status: "PENDENTE_PAGAMENTO",
        dataPedido: new Date(),
      },
      { transaction }
    );

    // processa itens: checa estoque, cria item_pedido, decrementa estoque
    let subtotal = 0;
    for (const it of items) {
      if (!it.idProduto || !it.quantidade) {
        await transaction.rollback();
        return res.status(400).json({ message: "Item inválido." });
      }

      const produto = await Produto.findByPk(it.idProduto);
      if (!produto) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: `Produto ${it.idProduto} não encontrado.` });
      }

      // pega estoque
      const estoque = await Estoque.findOne({
        where: { idProduto: it.idProduto },
        transaction,
        lock: true,
      });
      const qtdAtual = estoque ? Number(estoque.quantidade_atual || 0) : 0;

      if (qtdAtual < Number(it.quantidade)) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}.`,
        });
      }

      const precoUnitario = Number(produto.preco);
      const valorTotalItem = Number(
        (precoUnitario * Number(it.quantidade)).toFixed(2)
      );
      subtotal += valorTotalItem;

      // cria itemPedido
      await ItemPedido.create(
        {
          idPedido: pedido.codPedido,
          idProduto: it.idProduto,
          quantidade: it.quantidade,
          precoUnitario: precoUnitario,
          valorTotalItem,
        },
        { transaction }
      );

      // decrementa estoque
      estoque.quantidade_atual = qtdAtual - Number(it.quantidade);
      await estoque.save({ transaction });
    }

    const valorTotal = Number((subtotal + Number(valorFrete)).toFixed(2));

    // atualiza pedido com valores calculados
    await Pedido.update(
      { valorSubtotal: subtotal, valorTotal },
      { where: { codPedido: pedido.codPedido }, transaction }
    );

    // cria entrega automaticamente (opção A)
    const codigoRastreio = gerarCodigoRastreio();
    const dataEstimada = new Date();
    dataEstimada.setDate(dataEstimada.getDate() + 3); // estimativa: +3 dias

    const entregaCriada = await Entrega.create(
      {
        idPedido: pedido.codPedido,
        cep: entrega.cep,
        logradouro: entrega.logradouro,
        complemento: entrega.complemento || null,
        bairro: entrega.bairro,
        localidade: entrega.localidade,
        uf: entrega.uf,
        numero: entrega.numero,
        dataEstimada,
        codigoRastreio,
        statusEntrega: "EM_TRANSITO",
      },
      { transaction }
    );

    await transaction.commit();

    // busca pedido completo para retornar
    const pedidoFull = await Pedido.findByPk(pedido.codPedido, {
      include: [
        {
          model: ItemPedido,
          as: "itensPedido",
          include: [{ model: Produto, as: "produtoItem" }],
        },
        { model: Entrega, as: "entregaPedido" },
      ],
    });

    res.status(201).json(pedidoFull);
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error("Erro criar pedido:", err);
    res.status(500).json({ message: "Erro ao criar pedido." });
  }
};

// listar pedidos
const listar = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: ItemPedido,
          as: "itensPedido",
          include: [{ model: Produto, as: "produtoItem" }],
        },
        { model: Entrega, as: "entregaPedido" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error("Erro listar pedidos:", err);
    res.status(500).json({ message: "Erro ao listar pedidos." });
  }
};

const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: ItemPedido,
          as: "itensPedido",
          include: [{ model: Produto, as: "produtoItem" }],
        },
        { model: Entrega, as: "entregaPedido" },
      ],
    });
    if (!pedido)
      return res.status(404).json({ message: "Pedido não encontrado." });
    res.status(200).json(pedido);
  } catch (err) {
    console.error("Erro buscar pedido:", err);
    res.status(500).json({ message: "Erro ao buscar pedido." });
  }
};

// atualizar status do pedido (ex: marcar como PAGO, ENVIADO, ENTREGUE, CANCELADO)
// se cancelar, restaura estoque automaticamente
const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sequelize = Pedido.sequelize;
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const pedido = await Pedido.findByPk(id, { transaction });
    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    const statusAntigo = pedido.status;
    await Pedido.update({ status }, { where: { codPedido: id }, transaction });

    // se foi para CANCELADO, restaurar estoque
    if (status === "CANCELADO" && statusAntigo !== "CANCELADO") {
      const itens = await ItemPedido.findAll({
        where: { idPedido: id },
        transaction,
      });
      for (const it of itens) {
        const estoque = await Estoque.findOne({
          where: { idProduto: it.idProduto },
          transaction,
          lock: true,
        });
        if (estoque) {
          estoque.quantidade_atual =
            Number(estoque.quantidade_atual || 0) + Number(it.quantidade);
          await estoque.save({ transaction });
        }
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Status atualizado." });
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error("Erro atualizar status do pedido:", err);
    res.status(500).json({ message: "Erro ao atualizar status do pedido." });
  }
};

module.exports = { criarPedido, listar, buscarPorId, atualizarStatus };

// esse código é muito grande . . . meu deus
