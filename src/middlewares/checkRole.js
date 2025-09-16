import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Employee from "../models/employee.model.js";

export const checkRole = (roles = []) => {
  return async (req, res, next) => {
    let token = null;

    // 🔐 Solo tomar access token del header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No access token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, TOKEN_SECRET);

      const user = await Employee.findById(decoded.id).select("id role dni name");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 🔎 Verifica rol
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      // ✅ Usuario autorizado
      req.user = user;
      next();
    } catch (error) {
      console.error("Error en checkRole:", error.message);
      return res.status(401).json({ message: "Token is not valid" });
    }
  };
};
