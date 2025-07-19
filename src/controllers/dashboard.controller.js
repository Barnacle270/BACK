import Servicio from '../models/servicio.model.js';

export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    // Excluir servicios anulados del total
    const total = await Servicio.countDocuments({ estado: { $ne: 'ANULADA' } });

    // Pendientes
    const pendientes = await Servicio.countDocuments({ estado: 'PENDIENTE' });

    // Concluidos
    const concluidos = await Servicio.countDocuments({ estado: 'CONCLUIDO' });

    // Facturados (excluyendo los ANULADOS)
    const facturados = await Servicio.countDocuments({
      estado: { $ne: 'ANULADA' },
      estadoFacturacion: 'FACTURADO',
    });

    // Pendientes de facturar (no anulados y no facturados)
    const pendientesFacturar = await Servicio.countDocuments({
      estado: { $ne: 'ANULADA' },
      $or: [
        { estadoFacturacion: { $exists: false } },
        { estadoFacturacion: { $ne: 'FACTURADO' } },
      ],
    });

    // Guías ANULADAS dentro del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date(inicioMes);
    finMes.setMonth(finMes.getMonth() + 1);

    const anuladasMesActual = await Servicio.countDocuments({
      estado: 'ANULADA',
      fechaTraslado: {
        $gte: inicioMes,
        $lt: finMes,
      },
    });

    res.json({
      total,
      pendientes,
      concluidos,
      facturados,
      pendientesFacturar,
      anuladasMesActual, // reemplaza a ultimos7Dias
    });
  } catch (err) {
    console.error('Error al obtener estadísticas del dashboard:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
