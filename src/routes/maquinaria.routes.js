import express from 'express';
import {
  crearMaquinaria,
  obtenerMaquinarias,
  obtenerMaquinariaPorId,
  actualizarMaquinaria,
  eliminarMaquinaria
} from '../controllers/maquinaria.controller.js';

const router = express.Router();

// Ruta base: /api/maquinarias
router.post('/', crearMaquinaria);
router.get('/', obtenerMaquinarias);
router.get('/:id', obtenerMaquinariaPorId);
router.put('/:id', actualizarMaquinaria);
router.delete('/:id', eliminarMaquinaria);

export default router;
