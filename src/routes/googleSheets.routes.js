// 📂 routes/googleSheets.routes.js
import express from "express";
import { 
  getConductores, 
  getTractos, 
  getCarretas, 
  getCuentasPorCobrar 
} from "../controllers/googleSheets.controller.js";

const router = express.Router();

// Documentos
router.get("/conductores", getConductores);
router.get("/tractos", getTractos);
router.get("/carretas", getCarretas);

// Cuentas por cobrar
router.get("/cuentasxcobrar", getCuentasPorCobrar);

export default router;
