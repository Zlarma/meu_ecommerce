const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 3000;
const hostname = "localhost";
const db = require("./db/conn");

const authController = require("./controller/auth.controller");
const authMiddleware = require("./middleware/auth.middleware");
const usuarioController = require("./controller/usuario.controller");
// const produtoController = require("./controller/produto.controller");
// const estoqueController = require("./controller/estoque.controller");

// ---- middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//---------- rotas publicas -----------------
app.post("/usuario", usuarioController.cadastrar);
app.post("/login", authController.login);

//---------- rotas privadas -----------------
// app.use(authMiddleware);

// app.post("/produto", produtoController.cadastrar);
// app.get("/produto", produtoController.listar);
// app.get("/produto:nome", produtoController.consultarNome);
// app.put("/produto:id", produtoController.atualizar);
// app.delete("/produto:id", produtoController.apagar);

// app.post("/estoque", estoqueController.cadastrar);
// app.get("/estoque", estoqueController.listar);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Aplicação rodando!" });
});

// -------------------------
db.sync()
  .then(() => {
    app.listen(PORT, hostname, () => {
      console.log(`Servidor rodando em http://${hostname}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao sincronizar o banco de dados!", err);
  });
