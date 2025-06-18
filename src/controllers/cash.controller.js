import CashMovement from '../models/cashmovement.model.js';
import DailyCashReport from '../models/dailycashreport.model.js';
import generarPDF from '../helpers/pdfGenerator.js';

export const crearMovimiento = async (req, res) => {
  try {
    const nuevo = new CashMovement(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarMovimientosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ message: 'Se requiere una fecha' });

    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    const movimientos = await CashMovement.find({
      fecha: { $gte: inicio, $lte: fin }
    }).sort({ createdAt: 1 });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await CashMovement.findById(id);
    if (!movimiento) return res.status(404).json({ message: 'Movimiento no encontrado' });

    const fechaMovimiento = new Date(movimiento.fecha);
    fechaMovimiento.setHours(0, 0, 0, 0);

    const cierre = await DailyCashReport.findOne({ fecha: fechaMovimiento });
    if (cierre?.cerrado) {
      return res.status(403).json({ message: 'Caja cerrada. No se puede editar el movimiento.' });
    }

    const actualizado = await CashMovement.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const estadoCajaActual = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const maniana = new Date(hoy);
    maniana.setDate(hoy.getDate() + 1);

    const movimientos = await CashMovement.find({
      fecha: { $gte: hoy, $lt: maniana }
    });

    const cierreAnterior = await DailyCashReport.findOne({ fecha: new Date(hoy.getTime() - 86400000) });

    const saldoAnterior = cierreAnterior?.saldoEfectivoFinal || 0;
    const porRendirAnterior = cierreAnterior?.saldoPorRendir || 0;

    const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, cur) => acc + cur.monto, 0);
    const egresosLiquidados = movimientos.filter(m => m.tipo === 'egreso' && m.estado === 'liquidado').reduce((acc, cur) => acc + cur.monto, 0);
    const egresosPorRendir = movimientos.filter(m => m.tipo === 'egreso' && m.estado === 'por liquidar').reduce((acc, cur) => acc + cur.monto, 0);

    const saldoFinal = saldoAnterior + ingresos - egresosLiquidados;
    const totalCierre = saldoFinal + egresosPorRendir;

    res.json({
      saldoAnterior,
      porRendirAnterior,
      ingresos,
      egresosLiquidados,
      egresosPorRendir,
      saldoFinal,
      porRendirActual: egresosPorRendir,
      totalCierre
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cerrarCaja = async (req, res) => {
  try {
    const { fecha, creadoPor } = req.body;
    const dia = new Date(fecha);
    dia.setHours(0, 0, 0, 0);
    const diaSiguiente = new Date(dia);
    diaSiguiente.setDate(dia.getDate() + 1);

    const yaExiste = await DailyCashReport.findOne({ fecha: dia });
    if (yaExiste?.cerrado) {
      return res.status(400).json({ message: 'Caja ya fue cerrada' });
    }

    const movimientos = await CashMovement.find({
      fecha: { $gte: dia, $lt: diaSiguiente }
    });

    const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((sum, m) => sum + m.monto, 0);
    const egresosLiquidados = movimientos.filter(m => m.tipo === 'egreso' && m.estado === 'liquidado').reduce((sum, m) => sum + m.monto, 0);
    const egresosPorRendir = movimientos.filter(m => m.tipo === 'egreso' && m.estado === 'por liquidar').reduce((sum, m) => sum + m.monto, 0);

    const cierreAnterior = await DailyCashReport.findOne({ fecha: new Date(dia.getTime() - 86400000) });
    const saldoInicial = cierreAnterior?.saldoEfectivoFinal || 0;

    const saldoEfectivoFinal = saldoInicial + ingresos - egresosLiquidados;
    const totalCierre = saldoEfectivoFinal + egresosPorRendir;

    const pdfUrl = await generarPDF({
      fecha: dia,
      movimientos,
      saldoInicial,
      ingresos,
      egresosLiquidados,
      egresosPorRendir,
      saldoEfectivoFinal,
      totalCierre
    });

    const cierre = await DailyCashReport.findOneAndUpdate(
      { fecha: dia },
      {
        fecha: dia,
        movimientos: movimientos.map(m => m._id),
        saldoInicial,
        totalIngresos: ingresos,
        totalEgresosEfectivos: egresosLiquidados,
        totalEgresosPorRendir: egresosPorRendir,
        saldoEfectivoFinal,
        saldoPorRendir: egresosPorRendir,
        cerrado: true,
        creadoPor,
        pdfUrl
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Caja cerrada con éxito', cierre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const historialCierres = async (req, res) => {
  try {
    const historial = await DailyCashReport.find().sort({ fecha: -1 });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
