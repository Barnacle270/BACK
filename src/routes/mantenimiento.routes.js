import express from 'express';
import {
  crearMantenimiento,
  obtenerMantenimientosPorMaquinaria,
  obtenerMantenimientosProximos
} from '../controllers/mantenimiento.controller.js';

import MantenimientoRealizado from '../models/mantenimientoRealizado.model.js';

const router = express.Router();

// ✅ Obtener todos los mantenimientos realizados
router.get('/', async (req, res) => {
  try {
    const mantenimientos = await MantenimientoRealizado.find().populate('maquinaria');
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mantenimientos', detalle: error.message });
  }
});

// ✅ RUTA ESPECÍFICA primero
router.get('/proximos-mantenimientos', obtenerMantenimientosProximos);

// 🛠 Crear nuevo mantenimiento
router.post('/', crearMantenimiento);

// 🧾 Obtener mantenimientos por maquinaria (dinámico, va al final)
router.get('/:maquinariaId', obtenerMantenimientosPorMaquinaria);

export default router;
