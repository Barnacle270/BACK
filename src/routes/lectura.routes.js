import express from 'express';
import {
  crearLectura,
  obtenerLecturas,
  obtenerLecturaPorId,
  actualizarLectura,
  eliminarLectura,
  obtenerLecturasPorMaquinaria
} from '../controllers/lectura.controller.js';

const router = express.Router();

// Ruta base: /api/lecturas
router.post('/', crearLectura);
router.get('/', obtenerLecturas);
router.get('/:id', obtenerLecturaPorId);
router.get('/maquinaria/:id', obtenerLecturasPorMaquinaria);
router.put('/:id', actualizarLectura);
router.delete('/:id', eliminarLectura);

export default router;
