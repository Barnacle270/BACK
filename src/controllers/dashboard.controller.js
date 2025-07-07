import Servicio from '../models/servicio.model.js';

export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const total = await Servicio.countDocuments();
    const pendientes = await Servicio.countDocuments({ estado: 'PENDIENTE' });
    const concluidos = await Servicio.countDocuments({ estado: 'CONCLUIDO' });

    const ultimos7Dias = await Servicio.countDocuments({
      fechaTraslado: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ total, pendientes, concluidos, ultimos7Dias });
  } catch (err) {
    console.error('Error al obtener estadísticas del dashboard:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
