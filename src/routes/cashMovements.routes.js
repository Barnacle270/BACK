// routes/cashMovements.js
import express from 'express';
import { obtenerMovimientos, registrarMovimiento } from '../controllers/cashMovements.controller.js';
// import { authMiddleware } from '../middlewares/auth.js'; // si tienes autenticación
import { authRequired } from '../middlewares/validateToken.js';

const router = express.Router();

// Protege la ruta si ya tienes authMiddleware
// router.post('/', authMiddleware, registrarMovimiento);
router.post('/', authRequired, registrarMovimiento);
router.get('/', authRequired, obtenerMovimientos);

export default router;
