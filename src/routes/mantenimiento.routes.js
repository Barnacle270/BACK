import express from 'express';
import {
  crearMantenimiento,
  obtenerMantenimientos,
  obtenerMantenimientoPorId,
  actualizarMantenimiento,
  eliminarMantenimiento,
  obtenerMantenimientosPorMaquinaria
} from '../controllers/mantenimiento.controller.js';

const router = express.Router();

// Ruta base: /api/mantenimientos
router.post('/', crearMantenimiento);
router.get('/', obtenerMantenimientos);
router.get('/:id', obtenerMantenimientoPorId);
router.get('/maquinaria/:id', obtenerMantenimientosPorMaquinaria);
router.put('/:id', actualizarMantenimiento);
router.delete('/:id', eliminarMantenimiento);

export default router;
