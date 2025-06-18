import { Router } from 'express';
import {
  crearMovimiento,
  listarMovimientosPorFecha,
  editarMovimiento,
  estadoCajaActual,
  cerrarCaja,
  historialCierres
} from '../controllers/cash.controller.js';

import { validateSchema } from '../middlewares/validator.middleware.js';
import { movimientoSchema, movimientoSchemaPut } from '../schemas/cash.schema.js';

import validateToken from '../middlewares/validateToken.js';

const router = Router();

// 📌 Registrar nuevo movimiento
router.post('/movimientos', validateToken, validateSchema(movimientoSchema), crearMovimiento);

// 📌 Obtener movimientos por fecha (?fecha=YYYY-MM-DD)
router.get('/movimientos', validateToken, listarMovimientosPorFecha);

// 📌 Editar movimiento por ID
router.put('/movimientos/:id', validateToken, validateSchema(movimientoSchemaPut), editarMovimiento);

// 📌 Obtener estado de caja actual
router.get('/estado-actual', validateToken, estadoCajaActual);

// 📌 Cerrar caja
router.post('/cerrar-caja', validateToken, cerrarCaja);

// 📌 Historial de cierres
router.get('/historial-cierres', validateToken, historialCierres);


export default router;
