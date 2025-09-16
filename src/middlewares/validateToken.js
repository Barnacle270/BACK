import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  let token = null;

  // Buscar en Authorization header (Bearer)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No access token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded; // datos del usuario (id, dni, etc.)
    next();
  } catch (error) {
    console.error("❌ Error al verificar el access token:", error.message);
    return res.status(401).json({
      message: "Access token is not valid",
      error: error.message,
    });
  }
};
