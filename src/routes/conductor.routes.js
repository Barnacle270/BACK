import { Router } from 'express';
import {
  crearConductor,
  listarConductores,
  obtenerConductorPorId,
  actualizarConductor
} from '../controllers/conductor.controller.js';

const router = Router();

router.post('/conductores', crearConductor);
router.get('/conductores', listarConductores);
router.get('/conductores/:id', obtenerConductorPorId);
router.put('/conductores/:id', actualizarConductor);

export default router;
