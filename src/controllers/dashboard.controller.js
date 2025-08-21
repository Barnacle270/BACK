// controllers/dashboard.controller.js
import Servicio from '../models/servicio.model.js';

const TZ = 'America/Lima';
const OFFSET_HOURS = 5; // Lima (UTC-05) sin DST

function resolveDateRange(period = '30d') {
  const now = new Date();
  const end = now;
  const start = new Date(end);
  const toStartOfMonth = (d) => { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; };
  const toStartOfYear  = (d) => { const x = new Date(d); x.setMonth(0,1); x.setHours(0,0,0,0); return x; };

  switch (period) {
    case '7d':  start.setDate(end.getDate() - 7);  break;
    case '30d': start.setDate(end.getDate() - 30); break;
    case '90d': start.setDate(end.getDate() - 90); break;
    case 'MTD': return { start: toStartOfMonth(end), end };
    case 'YTD': return { start: toStartOfYear(end),  end };
    default:    start.setDate(end.getDate() - 30);
  }
  start.setHours(0,0,0,0);
  return { start, end };
}

export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = resolveDateRange(period);

    // KPIs (globales). Si quieres que respeten 'period', añade { fechaTraslado: { $gte: start, $lt: end } } a cada filtro.
    const [
      total,
      pendientes,
      concluidos,
      facturados,
      pendientesFacturar,
      anuladasMesActual,
    ] = await Promise.all([
      Servicio.countDocuments({ estado: { $ne: 'ANULADA' } }),
      Servicio.countDocuments({ estado: 'PENDIENTE' }),
      Servicio.countDocuments({ estado: 'CONCLUIDO' }),
      Servicio.countDocuments({ estado: { $ne: 'ANULADA' }, estadoFacturacion: 'FACTURADO' }),
      Servicio.countDocuments({
        estado: { $ne: 'ANULADA' },
        $or: [
          { estadoFacturacion: { $exists: false } },
          { estadoFacturacion: { $ne: 'FACTURADO' } },
        ],
      }),
      (async () => {
        const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0,0,0,0);
        const finMes = new Date(inicioMes); finMes.setMonth(finMes.getMonth() + 1);
        return Servicio.countDocuments({
          estado: 'ANULADA',
          fechaTraslado: { $gte: inicioMes, $lt: finMes },
        });
      })(),
    ]);

    // Series/Tablas por periodo
    const baseMatch = { fechaTraslado: { $gte: start, $lt: end } };
    const notAnulada = { estado: { $ne: 'ANULADA' } };

    const facet = await Servicio.aggregate([
      { $match: baseMatch },
      {
        $facet: {
          // 1) Servicios por día (excluye ANULADA) — corrige día con $dateAdd + timezone
          serviciosPorDia: [
            { $match: notAnulada },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    timezone: TZ,
                    date: { $dateAdd: { startDate: '$fechaTraslado', unit: 'hour', amount: OFFSET_HOURS } },
                  },
                },
                total: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: '$_id', total: 1 } },
          ],

          // 2) Estados por día — corrige día con $dateAdd + timezone
          estadosPorDia: [
            {
              $group: {
                _id: {
                  dia: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      timezone: TZ,
                      date: { $dateAdd: { startDate: '$fechaTraslado', unit: 'hour', amount: OFFSET_HOURS } },
                    },
                  },
                  estado: '$estado',
                },
                c: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: '$_id.dia',
                pendientes: { $sum: { $cond: [{ $eq: ['$_id.estado', 'PENDIENTE'] }, '$c', 0] } },
                concluidos: { $sum: { $cond: [{ $eq: ['$_id.estado', 'CONCLUIDO'] }, '$c', 0] } },
                anuladas:   { $sum: { $cond: [{ $eq: ['$_id.estado', 'ANULADA'] }, '$c', 0] } },
              },
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: '$_id', pendientes: 1, concluidos: 1, anuladas: 1 } },
          ],

          // 3) Facturación por día (conteo) — corrige día con $dateAdd + timezone
          facturacion: [
            { $match: notAnulada },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    timezone: TZ,
                    date: { $dateAdd: { startDate: '$fechaTraslado', unit: 'hour', amount: OFFSET_HOURS } },
                  },
                },
                facturados: {
                  $sum: { $cond: [{ $eq: ['$estadoFacturacion', 'FACTURADO'] }, 1, 0] },
                },
                pendientesFacturar: {
                  $sum: {
                    $cond: [
                      {
                        $or: [
                          { $eq: ['$estadoFacturacion', null] },
                          { $ne: ['$estadoFacturacion', 'FACTURADO'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, date: '$_id', facturados: 1, pendientesFacturar: 1 } },
          ],

          // 4) Top clientes por CANTIDAD (excluye ANULADA)
          topClientes: [
            { $match: notAnulada },
            {
              $addFields: {
                clienteNorm: {
                  $cond: [
                    { $or: [{ $eq: ['$cliente', null] }, { $eq: ['$cliente', ''] }] },
                    'SIN CLIENTE',
                    '$cliente',
                  ],
                },
              },
            },
            {
              $group: {
                _id: '$clienteNorm',
                cantidad: { $sum: 1 },
              },
            },
            { $sort: { cantidad: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, cliente: '$_id', cantidad: 1 } },
          ],

          // 5) Últimos servicios — corrige fecha mostrada con $dateAdd + timezone
          ultimos: [
            { $sort: { fechaTraslado: -1 } },
            { $limit: 8 },
            {
              $project: {
                _id: 0,
                id: '$_id',
                fecha: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    timezone: TZ,
                    date: { $dateAdd: { startDate: '$fechaTraslado', unit: 'hour', amount: OFFSET_HOURS } },
                  },
                },
                numeroGuia: '$numeroGuia',
                cliente: '$cliente',
                servicio: '$tipoCarga', // mostrando tipo de carga como “servicio”
                estado: '$estado',
              },
            },
          ],
        },
      },
    ]);

    const {
      serviciosPorDia = [],
      estadosPorDia = [],
      facturacion = [],
      topClientes = [],
      ultimos = [],
    } = facet[0] || {};

    return res.json({
      // KPIs (globales)
      total,
      pendientes,
      concluidos,
      facturados,
      pendientesFacturar,
      anuladasMesActual,

      // Periodo aplicado a series/listas
      period,
      range: { start, end },

      // Series y tablas
      series: { serviciosPorDia, estadosPorDia, facturacion },
      topClientes, // [{ cliente, cantidad }]
      ultimos,     // [{ id, fecha, numeroGuia, cliente, servicio, estado }]
    });
  } catch (err) {
    console.error('Error al obtener estadísticas del dashboard:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
