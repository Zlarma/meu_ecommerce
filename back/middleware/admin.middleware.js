function adminMiddleware(req, res, next) {
    if (!req.user) return res.status(401).json({ error: "Não autenticado." });
    if (req.user.tipo_usuario && req.user.tipo_usuario === "ADMIN") {
      return next();
    }
    return res.status(403).json({ error: "Acesso negado. Apenas ADMIN." });
  }
  
  module.exports = adminMiddleware;
  