    const { verificarToken } = require("../service/jwt.service");

    function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Token não fornecido!" });

    const token = authHeader.split(" ")[1];
    try {
        const dadosToken = verificarToken(token);
        if (!dadosToken) return res.status(403).json({ error: "Token inválido!" });

        // anexa dados do token para uso nas controllers
        req.user = dadosToken; // ex: { codUsuario, email, tipo_usuario }
        next();
    } catch (err) {
        console.error("Erro validar token:", err);
        return res.status(403).json({ error: "Token inválido!" });
    }
    }

    module.exports = authMiddleware;
