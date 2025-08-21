import { Router } from 'express';
import { obtenerEstadisticasDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard/estadisticas?period=7d|30d|90d|MTD|YTD
router.get('/estadisticas', obtenerEstadisticasDashboard);

export default router;