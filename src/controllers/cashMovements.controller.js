// controllers/cashMovementsController.js
import { CashMovement } from '../models/CashMovement.js';

export const registrarMovimiento = async (req, res) => {

  console.log('req.user:', req.user);
  try {
    const {
      tipo,
      personaSolicita,
      personaAutoriza,
      descripcion,
      categoria,
      origenIngreso,
      placaOMaquina,
      monto,
      estadoRendicion,
      comprobantes,
      observacion,
      saldoFinalCaja
    } = req.body;

    // Validaciones mínimas (puedes mejorar esto con un esquema tipo Joi)
    if (!descripcion || !monto || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos.' });
    }

    const nuevoMovimiento = new CashMovement({
      tipo,
      personaSolicita,
      personaAutoriza,
      descripcion,
      categoria: tipo === 'EGRESO' ? categoria : undefined,
      origenIngreso: tipo === 'INGRESO' ? origenIngreso : undefined,
      placaOMaquina,
      monto,
      estadoRendicion,
      comprobantes,
      observacion,
      saldoFinalCaja,
      responsableCaja: req.user.id, // Asignación automática
    });

    const guardado = await nuevoMovimiento.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el movimiento' });
  }
};


export const obtenerMovimientos = async (req, res) => {
  try {
    const { tipo, desde, hasta } = req.query;

    const filtro = {};

    // Filtro por tipo si se envía (?tipo=EGRESO)
    if (tipo) {
      filtro.tipo = tipo;
    }

    // Filtro por fecha si se envía (?desde=2025-06-15&hasta=2025-06-17)
   if (desde && hasta) {
  const inicio = new Date(desde);
  const fin = new Date(hasta);

  // Ajustar fin para incluir todo el día (hasta las 23:59:59)
  fin.setHours(23, 59, 59, 999);

  filtro.fecha = { $gte: inicio, $lte: fin };
}

    const movimientos = await CashMovement.find(filtro).sort({ fecha: -1 });
    res.json(movimientos);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos' });
  }
};