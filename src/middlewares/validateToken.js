import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;  // O desde los encabezados si es necesario

  console.log("Token recibido:", token); // Verifica si el token se está recibiendo correctamente

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, TOKEN_SECRET);
    console.log("Token verificado:", decoded); // Verifica que el token esté siendo decodificado correctamente

    req.user = decoded; // Almacena los datos decodificados en la solicitud
    next(); // Continúa con la siguiente lógica
  } catch (error) {
    console.error("Error al verificar el token:", error);  // Captura los errores de verificación
    return res.status(401).json({ message: "Token is not valid", error: error.message });
  }
};
