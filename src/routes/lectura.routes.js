import express from 'express';
import {
  crearLectura,
  obtenerLecturasPorMaquinaria,
  eliminarLectura
} from '../controllers/lectura.controller.js';

const router = express.Router();

router.post('/', crearLectura);
router.get('/:maquinariaId', obtenerLecturasPorMaquinaria);
router.delete('/:id', eliminarLectura); // opcional

export default router;