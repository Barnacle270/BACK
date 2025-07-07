import { Router } from 'express';
import { generarReporteServicios } from '../controllers/reportes.controller.js';

const router = Router();

router.get('/servicios', generarReporteServicios);

export default router;
