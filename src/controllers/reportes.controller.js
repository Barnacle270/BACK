import ExcelJS from "exceljs";
import Servicio from "../models/servicio.model.js";

export const generarReporteServicios = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = {};

    // Helper para fechas
    const fmtFecha = (f) => (f ? new Date(f).toISOString().slice(0, 10) : "");

    if (desde && hasta) {
      const d1 = new Date(desde);
      const d2 = new Date(hasta);
      if (!isNaN(d1) && !isNaN(d2)) {
        filtro.fechaTraslado = { $gte: d1, $lte: d2 };
      }
    }

    const servicios = await Servicio.find(filtro).lean();

    // Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Servicios");

    // Definir columnas (todos los campos de tu versión original)
    worksheet.columns = [
      { header: "Tipo de Guía", key: "tipoGuia", width: 18 },
      { header: "Guía", key: "numeroGuia", width: 15 },
      { header: "Fecha de Traslado", key: "fechaTraslado", width: 18 },
      { header: "Documento Relacionado", key: "documentoRelacionado", width: 25 },
      { header: "Cliente", key: "cliente", width: 30 },
      { header: "RUC Remitente", key: "rucRemitente", width: 20 },
      { header: "Razón Social Remitente", key: "razonRemitente", width: 30 },
      { header: "RUC Destinatario", key: "rucDestinatario", width: 20 },
      { header: "Razón Social Destinatario", key: "razonDestinatario", width: 30 },
      { header: "Dirección Partida", key: "direccionPartida", width: 30 },
      { header: "Dirección Llegada", key: "direccionLlegada", width: 30 },
      { header: "Placa Vehículo Principal", key: "placaPrincipal", width: 22 },
      { header: "Nombre del Conductor", key: "nombreConductor", width: 25 },
      { header: "Tipo de Carga", key: "tipoCarga", width: 20 },
      { header: "N° Contenedor", key: "numeroContenedor", width: 18 },
      { header: "Observaciones", key: "observaciones", width: 30 },
      { header: "Terminal de Devolución", key: "terminalDevolucion", width: 25 },
      { header: "Placa Devolución", key: "placaDevolucion", width: 20 },
      { header: "Conductor Devolución", key: "conductorDevolucion", width: 25 },
      { header: "Hora de Cita", key: "horaCita", width: 15 },
      { header: "Vencimiento Memo", key: "vencimientoMemo", width: 18 },
      { header: "Fecha Devolución", key: "fechaDevolucion", width: 18 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Estado de Facturación", key: "estadoFacturacion", width: 22 },
      { header: "Fecha de Recepción", key: "fechaRecepcion", width: 18 },
      { header: "Fecha de Facturación", key: "fechaFacturacion", width: 18 },
      { header: "Número de Factura", key: "numeroFactura", width: 20 },
      { header: "Creado el", key: "createdAt", width: 18 },
      { header: "Actualizado el", key: "updatedAt", width: 18 },
    ];

    // Estilos encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" }, // Azul Office
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Insertar datos
    servicios.forEach((s) => {
      worksheet.addRow({
        tipoGuia: s.tipoGuia || "",
        numeroGuia: s.numeroGuia || "",
        fechaTraslado: fmtFecha(s.fechaTraslado),
        documentoRelacionado: s.documentoRelacionado || "",
        cliente: s.cliente || "",
        rucRemitente: s.remitente?.ruc || "",
        razonRemitente: s.remitente?.razonSocial || "",
        rucDestinatario: s.destinatario?.ruc || "",
        razonDestinatario: s.destinatario?.razonSocial || "",
        direccionPartida: s.direccionPartida || "",
        direccionLlegada: s.direccionLlegada || "",
        placaPrincipal: s.placaVehiculoPrincipal || "",
        nombreConductor: s.nombreConductor || "",
        tipoCarga: s.tipoCarga || "",
        numeroContenedor: s.numeroContenedor || "",
        observaciones: s.observaciones || "",
        terminalDevolucion: s.terminalDevolucion || "",
        placaDevolucion: s.placaDevolucion || "",
        conductorDevolucion: s.conductorDevolucion || "",
        horaCita: s.horaCita || "",
        vencimientoMemo: fmtFecha(s.vencimientoMemo),
        fechaDevolucion: fmtFecha(s.fechaDevolucion),
        estado: s.estado || "",
        estadoFacturacion: s.estadoFacturacion || "",
        fechaRecepcion: fmtFecha(s.fechaRecepcion),
        fechaFacturacion: fmtFecha(s.fechaFacturacion),
        numeroFactura: s.numeroFactura || "",
        createdAt: fmtFecha(s.createdAt),
        updatedAt: fmtFecha(s.updatedAt),
      });
    });

    // Estilos de filas de datos
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // encabezado
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Autofiltro en encabezado
    worksheet.autoFilter = {
      from: "A1",
      to: worksheet.getRow(1).lastCell.address,
    };

    // Enviar archivo
    res.setHeader("Content-Disposition", 'attachment; filename="reporte_servicios.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
};

export const listarPendientesFacturacion = async (req, res) => {
  try {
    const pendientes = await Servicio.find({
      estado: { $ne: "ANULADA" },
      $or: [
        { estadoFacturacion: { $exists: false } },
        { estadoFacturacion: null },
        { estadoFacturacion: { $ne: "FACTURADO" } },
      ],
    }).sort({ fechaTraslado: -1 });

    res.json(pendientes);
  } catch (error) {
    console.error("Error al obtener servicios pendientes de facturar:", error);
    res.status(500).json({ mensaje: "Error al obtener pendientes de facturar" });
  }
};
