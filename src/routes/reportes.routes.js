import { Router } from 'express';
import { generarReporteServicios, listarPendientesFacturacion } from '../controllers/reportes.controller.js';

const router = Router();

router.get('/servicios', generarReporteServicios);
router.get('/pendientes-facturar', listarPendientesFacturacion);

export default router;
