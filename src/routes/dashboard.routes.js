import { Router } from 'express';
import { obtenerEstadisticasDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/estadisticas', obtenerEstadisticasDashboard);

export default router;
