const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 3000;
const HOSTNAME = "localhost";
const db = require("./db/conn");

// controllers (coloca os arquivos dentro de ./controller)
const authController = require("./controller/auth.controller");
const usuarioController = require("./controller/usuario.controller");
const produtoController = require("./controller/produto.controller");
const estoqueController = require("./controller/estoque.controller");
const pedidoController = require("./controller/pedido.controller");
const entregaController = require("./controller/entrega.controller");

// middlewares (./middleware)
const authMiddleware = require("./middleware/auth.middleware");
const adminMiddleware = require("./middleware/admin.middleware");

// ---- middleware global ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// ---------- rotas publicas -----------------
app.post("/usuario", usuarioController.cadastrar); // cadastro
app.post("/login", authController.login); // login

// produtos (público: listar e ver por id)
app.get("/produtos", produtoController.listar);
app.get("/produtos/:id", produtoController.buscarPorId);

// ---------- rotas privadas -----------------

// PEDIDOS (usuário autenticado)
app.post("/pedidos", authMiddleware, pedidoController.criarPedido); // cria pedido (usa req.user)
app.get("/pedidos", authMiddleware, pedidoController.listar); // lista (admin ou só do usuário dependendo do controller)
app.get("/pedidos/:id", authMiddleware, pedidoController.buscarPorId);

// atualizar status do pedido (normalmente admin)
app.put("/pedidos/:id/status", authMiddleware, adminMiddleware, pedidoController.atualizarStatus);

// PRODUTOS (só admin cria/edita/apaga)
app.post("/produtos", authMiddleware, adminMiddleware, produtoController.cadastrar);
app.put("/produtos/:id", authMiddleware, adminMiddleware, produtoController.atualizar);
app.delete("/produtos/:id", authMiddleware, adminMiddleware, produtoController.excluir);

// ESTOQUE (listar público/depende da sua regra; alterar só admin)
app.get("/estoques", authMiddleware, adminMiddleware, estoqueController.listar);
app.get("/estoques/:idProduto", authMiddleware, estoqueController.buscarPorProduto); // pode deixar só admin se quiser
app.put("/estoques/:idProduto", authMiddleware, adminMiddleware, estoqueController.atualizarQuantidade);

// ENTREGAS (admin ou autenticação necessária)
app.get("/entregas", authMiddleware, adminMiddleware, entregaController.listar);
app.get("/entregas/:id", authMiddleware, entregaController.buscarPorId);
app.put("/entregas/:id", authMiddleware, adminMiddleware, entregaController.atualizar);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Aplicação rodando!" });
});

// -------------------------
db.sync()
  .then(() => {
    app.listen(PORT, HOSTNAME, () => {
      console.log(`Servidor rodando em http://${HOSTNAME}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao sincronizar o banco de dados!", err);
  });
