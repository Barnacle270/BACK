import { Router } from "express";
import {
  getBoletas,
  getBoletasPorDni,
  createBoletas,
} from "../controllers/boletas.controller.js";

import { authRequired } from "../middlewares/authRequired.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validateSchema } from "../schemas/validateSchema.js";
import { createBoletasSchema } from "../schemas/boleta.schema.js";

const router = Router();

// 🧾 Obtener boletas del usuario autenticado (por su DNI)
router.get(
  "/boletas/mis-boletas",
  authRequired,
  getBoletasPorDni
);

// 📋 Obtener todas las boletas (solo para admin o superadmin)
router.get(
  "/boletas",
  authRequired,
  requireRole(["administrador", "superadministrador"]),
  getBoletas
);

// ➕ Crear nueva boleta (solo admin o superadmin)
router.post(
  "/boletas",
  authRequired,
  requireRole(["administrador", "superadministrador"]),
  validateSchema(createBoletasSchema),
  createBoletas
);

export default router;
