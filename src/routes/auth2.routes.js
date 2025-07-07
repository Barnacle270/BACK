import { Router } from "express";
import {
  register,
  login,
  verifyToken,
  logout,
  profile,
  updateUserRole,
  getAllUsers
} from "../controllers/auth2.controller.js";

import { validateSchema } from "../schemas/validateSchema.js";

import { authRequired } from "../middlewares/authRequired.js";
import { validatedni } from "../middlewares/validatedni.js";
import { registerSchema, loginSchema } from "../schemas/auth2.schema.js"; // Asegúrate de tener estos esquemas

import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

// 🔐 REGISTRO DE USUARIO NUEVO
router.post("/register", validateSchema(registerSchema), register);

// 🔐 LOGIN
router.post("/login", validateSchema(loginSchema), login);

// ✅ VERIFICAR TOKEN ACTIVO
router.get("/verify", verifyToken);

// 🔒 OBTENER PERFIL DEL USUARIO AUTENTICADO
router.get("/profile", authRequired, profile);

// 🔓 LOGOUT (elimina la cookie)
router.post("/logout", logout);

// 🧪 EJEMPLO DE RUTA PROTEGIDA CON VALIDATEDNI (si lo necesitas aparte)
router.get("/protected-dni", validatedni, (req, res) => {
  res.json({ message: "Ruta protegida con validatedni", user: req.user });
});

// 🧑‍💻 Obtener todos los usuarios (solo admin y superadmin)
router.get(
  "/users",
  authRequired,
  requireRole(["administrador", "superadministrador"]),
  getAllUsers
);

// ⚙️ Actualizar el rol de un usuario (solo superadmin)
router.put(
  "/users/:id/role",
  authRequired,
  requireRole(["superadministrador"]), // Solo el superadmin cambia roles
  updateUserRole
);

export default router;
