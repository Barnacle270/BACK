import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { clearTokenCookie } from "../libs/cookies.js";

export const authRequired = (req, res, next) => {
  let token = req.cookies?.token;

  // fallback: Authorization header (Bearer)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded; // inyecta datos del usuario en la request
    next();
  } catch (error) {
    console.error("❌ Error al verificar el token:", error.message);

    // Limpio cookie rota para no dejar basura en el navegador
    clearTokenCookie(res);

    return res.status(401).json({
      message: "Token is not valid",
      error: error.message,
    });
  }
};
