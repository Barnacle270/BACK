import express from 'express';
import {
  crearMaquinaria,
  obtenerMaquinarias,
  obtenerMaquinariaPorId,
  actualizarMaquinaria,
  eliminarMaquinaria,
  agregarMantenimiento,
  editarMantenimiento,
  eliminarMantenimiento
} from '../controllers/maquinaria.controller.js';

const router = express.Router();

// CRUD maquinaria
router.post('/', crearMaquinaria);
router.get('/', obtenerMaquinarias);
router.get('/:id', obtenerMaquinariaPorId);
router.put('/:id', actualizarMaquinaria);
router.delete('/:id', eliminarMaquinaria);

// Mantenimientos por maquinaria
router.post('/:id/mantenimientos', agregarMantenimiento);
router.put('/:id/mantenimientos/:mantenimientoId', editarMantenimiento);
router.delete('/:id/mantenimientos/:mantenimientoId', eliminarMantenimiento);

export default router;
