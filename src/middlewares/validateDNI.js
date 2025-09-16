import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Employee from "../models/employee.model.js";

export const validatedni = async (req, res, next) => {
  let token = null;

  // Buscar en Authorization header (Bearer)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No access token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);

    // Busca el usuario en la base de datos usando el ID del token
    const user = await Employee.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Añade el DNI del usuario al request
    req.user = {
      ...decoded,
      dni: user.dni,
    };

    next();
  } catch (error) {
    console.error("❌ validatedni error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
