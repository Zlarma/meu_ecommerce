const Usuario = require('../models/Usuario');
const { compareSenha } = require('../service/bcrypt.service');
const { gerarToken } = require('../service/jwt.service');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const senhaValida = await compareSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida!" });
    }

    // payload com tipo_usuario e nome para o front usar
    const payload = {
      codUsuario: usuario.codUsuario,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      nome: usuario.nome
    };

    const token = gerarToken(payload);

    // retornamos token + dados públicos do usuário (sem senha)
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        codUsuario: usuario.codUsuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      }
    });
  } catch (err) {
    console.error("Erro ao realizar o login!", err);
    return res.status(500).json({ error: "Erro ao realizar o login!" });
  }
};

module.exports = { login };
