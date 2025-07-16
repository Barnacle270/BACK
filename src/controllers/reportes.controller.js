import XLSX from 'xlsx';
import Servicio from '../models/servicio.model.js';

export const generarReporteServicios = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const filtro = {};

    if (desde && hasta) {
      filtro.fechaTraslado = {
        $gte: new Date(desde),
        $lte: new Date(hasta),
      };
    }

    const servicios = await Servicio.find(filtro).lean();

    const data = servicios.map(s => ({
      "Tipo de Guía": s.tipoGuia || '',
      "Guía": s.numeroGuia || '',
      "Fecha de Traslado": s.fechaTraslado?.toISOString().slice(0, 10) || '',
      "Documento Relacionado": s.documentoRelacionado || '',
      "Cliente": s.cliente || '',
      "RUC Remitente": s.remitente?.ruc || '',
      "Razón Social Remitente": s.remitente?.razonSocial || '',
      "RUC Destinatario": s.destinatario?.ruc || '',
      "Razón Social Destinatario": s.destinatario?.razonSocial || '',
      "Dirección Partida": s.direccionPartida || '',
      "Dirección Llegada": s.direccionLlegada || '',
      "Placa Vehículo Principal": s.placaVehiculoPrincipal || '',
      "Nombre del Conductor": s.nombreConductor || '',
      "Tipo de Carga": s.tipoCarga || '',
      "N° Contenedor": s.numeroContenedor || '',
      "Observaciones": s.observaciones || '',
      "Terminal de Devolución": s.terminalDevolucion || '',
      "Placa Devolución": s.placaDevolucion || '',
      "Conductor Devolución": s.conductorDevolucion || '',
      "Hora de Cita": s.horaCita || '',
      "Vencimiento Memo": s.vencimientoMemo?.toISOString().slice(0, 10) || '',
      "Fecha Devolución": s.fechaDevolucion?.toISOString().slice(0, 10) || '',
      "Estado": s.estado || '',
      "Estado de Facturación": s.estadoFacturacion || '',
      "Fecha de Recepción": s.fechaRecepcion?.toISOString().slice(0, 10) || '',
      "Fecha de Facturación": s.fechaFacturacion?.toISOString().slice(0, 10) || '',
      "Número de Factura": s.numeroFactura || '',
      "Creado el": s.createdAt?.toISOString().slice(0, 10) || '',
      "Actualizado el": s.updatedAt?.toISOString().slice(0, 10) || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename="reporte_servicios.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el reporte' });
  }
};

export const listarPendientesFacturacion = async (req, res) => {
  try {
    const pendientes = await Servicio.find({
      $and: [
        { estado: { $ne: 'ANULADA' } },
        {
          $or: [
            { estadoFacturacion: { $exists: false } },
            { estadoFacturacion: { $eq: null } },
            { estadoFacturacion: { $ne: 'FACTURADO' } },
          ]
        }
      ]
    }).sort({ fechaTraslado: -1 });

    res.json(pendientes);
  } catch (error) {
    console.error('Error al obtener servicios pendientes de facturar:', error);
    res.status(500).json({ mensaje: 'Error al obtener pendientes de facturar' });
  }
};


