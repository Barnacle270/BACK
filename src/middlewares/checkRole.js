export const checkRole = (roles) => {
  return async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    console.log("Token recibido en checkRole:", token);  // Verifica que el token se esté recibiendo en checkRole

    if (!token) {
      return res.status(401).json({ message: "No token found, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await Employee.findById(decoded.id);

      console.log("Usuario autorizado:", user);  // Verifica los datos del usuario autorizado

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        console.log("Acceso denegado, rol insuficiente:", user.role);  // Verifica el rol del usuario
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      req.user = user;
      next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
      console.error("Error en checkRole:", error);
      return res.status(401).json({ message: "Token is not valid" });
    }
  };
};
