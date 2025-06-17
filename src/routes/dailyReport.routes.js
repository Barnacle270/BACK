import express from 'express';
import { cerrarCajaDelDia } from '../controllers/dailyReport.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

router.post('/cierre', authRequired, cerrarCajaDelDia);

export default router;
