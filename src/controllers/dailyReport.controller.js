import { CashMovement } from '../models/CashMovement.js';
import { DailyCashReport } from '../models/DailyCashReport.model.js';

export const cerrarCajaDelDia = async (req, res) => {
  try {
    const { fecha, saldoInicial, saldoRealReportado } = req.body;

    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    // Buscar movimientos del día que aún no han sido cerrados
    const movimientosDelDia = await CashMovement.find({
      fecha: { $gte: inicio, $lte: fin },
      cerrado: false
    });

    if (movimientosDelDia.length === 0) {
      return res.status(400).json({ mensaje: 'No hay movimientos para cerrar ese día.' });
    }

    // Cálculo de totales
    const totalIngresos = movimientosDelDia
      .filter(mov => mov.tipo === 'INGRESO')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const totalEgresos = movimientosDelDia
      .filter(mov => mov.tipo === 'EGRESO')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const saldoEfectivoFinal = saldoInicial + totalIngresos - totalEgresos;

    const saldoPorRendir = movimientosDelDia
      .filter(mov => mov.tipo === 'EGRESO' && mov.estadoRendicion !== 'RENDIDO')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const diferencia = saldoRealReportado - saldoEfectivoFinal;

    // Crear y guardar el reporte
    const reporte = new DailyCashReport({
      fecha: inicio,
      movimientos: movimientosDelDia.map(m => m._id),
      saldoInicial,
      totalIngresos,
      totalEgresos,
      saldoEfectivoFinal,
      saldoPorRendir,
      saldoRealReportado,
      diferencia,
      creadoPor: req.user.id,
      cerrado: true
    });

    await reporte.save();

    // Marcar movimientos como cerrados
    await CashMovement.updateMany(
      { _id: { $in: movimientosDelDia.map(m => m._id) } },
      { $set: { cerrado: true } }
    );

    res.status(201).json({ mensaje: 'Caja cerrada correctamente', reporte });
  } catch (error) {
    console.error('Error al cerrar caja:', error);
    res.status(500).json({ mensaje: 'Error interno al cerrar la caja' });
  }
};
