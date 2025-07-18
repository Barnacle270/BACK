import express from 'express';
import {
  crearMaquinaria,
  obtenerMaquinarias,
  obtenerMaquinariaPorId,
  actualizarMaquinaria,
  eliminarMaquinaria,
  obtenerEquiposConMantenimientoPendiente
} from '../controllers/maquinaria.controller.js';

const router = express.Router();

// ✅ Primero las rutas específicas
router.get('/pendientes', obtenerEquiposConMantenimientoPendiente);

// Luego las rutas con parámetros
router.post('/', crearMaquinaria);
router.get('/', obtenerMaquinarias);
router.get('/:id', obtenerMaquinariaPorId);
router.put('/:id', actualizarMaquinaria);
router.delete('/:id', eliminarMaquinaria);

export default router;
