// src/middlewares/requireRole.js
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Obtén el rol del usuario desde `req.user`

    if (!userRole) {
      return res.status(403).json({ message: "Acceso denegado. No tienes rol" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado" });
    }

    next(); // Permite el acceso si el rol está autorizado
  };
};
