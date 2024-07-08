import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createTransporte,
  exportTransporteExcel,
  updateTransporte,
  getTransporteById,
  deleteTransporte
} from "../controllers/transporte.controller.js";
import validationTransporte from "../schemas/transporte.schema.js";
import Transporte from "../models/transporte.model.js";

const router = Router();

// Ruta para obtener transportes con paginación
router.get("/transporte", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 5) || 5; // Límite de resultados por página
    const page = parseInt(req.query.page, 10) || 1; // Página solicitada

    // Ordenar por fecha descendente y realizar la paginación
    const transporte = await Transporte.paginate(
      {},
      {
        sort: { fechat: -1 }, // Ordena por fechat descendente
        limit,
        page,
      }
    );

    res.json(transporte);
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener transportes:", error);
    res.status(500).json({ error: "Error al obtener transportes" });
  }
});

// Ruta para obtener un transporte por ID
router.get("/transporte/:id", getTransporteById);

// Ruta para crear transporte (requiere autenticación)
router.post(
  "/transporte",
  authRequired,
  validationTransporte(),
  createTransporte
);

// Ruta para exportar transporte a Excel por rango de fechas
router.post("/transporte/generar-excel", exportTransporteExcel);

// actualiza un transporte
router.put("/transporte/:id", validationTransporte(), updateTransporte);

router.delete("/transporte/:id", deleteTransporte);


export default router;
