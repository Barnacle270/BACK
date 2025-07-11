import Servicio from '../models/servicio.model.js';

export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    // Excluir servicios anulados del total
    const total = await Servicio.countDocuments({ estado: { $ne: 'ANULADA' } });

    // Pendientes
    const pendientes = await Servicio.countDocuments({ estado: 'PENDIENTE' });

    // Concluidos
    const concluidos = await Servicio.countDocuments({ estado: 'CONCLUIDO' });

    // Facturados
    const facturados = await Servicio.countDocuments({ estadoFacturacion: 'FACTURADO' });

    // Pendientes de facturar (no anulados y no facturados)
    const pendientesFacturar = await Servicio.countDocuments({
      estado: { $ne: 'ANULADA' },
      $or: [
        { estadoFacturacion: { $exists: false } },
        { estadoFacturacion: { $ne: 'FACTURADO' } },
      ],
    });

    // Servicios en los últimos 7 días (excluyendo anulados)
    const ultimos7Dias = await Servicio.countDocuments({
      estado: { $ne: 'ANULADA' },
      fechaTraslado: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      total,
      pendientes,
      concluidos,
      facturados,
      pendientesFacturar,
      ultimos7Dias,
    });
  } catch (err) {
    console.error('Error al obtener estadísticas del dashboard:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
