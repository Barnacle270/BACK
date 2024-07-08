import Transporte from "../models/transporte.model.js";
import ExcelJS from "exceljs";
import { DateTime } from "luxon";

// Función para formatear la fecha a dd-mm-yyyy
function formatearFecha(fecha) {
  return DateTime.fromJSDate(fecha).toFormat("dd-MM-yyyy");
}

export const getTransporte = async (req, res) => {
  try {
    const transportes = await Transporte.find();
    res.json(transportes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTransporte = async (req, res) => {
  try {
    const {
      fechat,
      cliente,
      puntoPartida,
      puntoDestino,
      guiaRemitente,
      guiaTransportista,
      placa,
      conductor,
      tipoServicio,
      detalle,
      almacenDev,
      comprobanteDev,
      estado,
      turno,
      planilla,
      combustible,
    } = req.body;

    const newTransporte = new Transporte({
      fechat,
      cliente,
      puntoPartida,
      puntoDestino,
      guiaRemitente,
      guiaTransportista,
      placa,
      conductor,
      tipoServicio,
      detalle,
      almacenDev,
      comprobanteDev,
      estado,
      turno,
      planilla,
      combustible,
    });

    const savedTransporte = await newTransporte.save();

    return res.status(201).json({ savedTransporte });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get transporte by id
export const getTransporteById = async (req, res) => {
  try {
    const transporte = await Transporte.findById(req.params.id);
    res.json(transporte);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTransporte = async (req, res) => {
  try {
    const {
      fechat,
      cliente,
      puntoPartida,
      puntoDestino,
      guiaRemitente,
      guiaTransportista,
      placa,
      conductor,
      tipoServicio,
      detalle,
      almacenDev,
      comprobanteDev,
      estado,
      turno,
      planilla,
      combustible,
    } = req.body;
    const transporteUpdated = await Transporte.findOneAndUpdate(
      { _id: req.params.id },
      {
        fechat,
        cliente,
        puntoPartida,
        puntoDestino,
        guiaRemitente,
        guiaTransportista,
        placa,
        conductor,
        tipoServicio,
        detalle,
        almacenDev,
        comprobanteDev,
        estado,
        turno,
        planilla,
        combustible,
      },
      { new: true }
    );
    return res.json(transporteUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTransporte = async (req, res) => {
  try {
    const deletedTransporte = await Transporte.findByIdAndDelete(req.params.id);
    if (!deletedTransporte)
      return res.status(404).json({ message: "Transporte not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// funcion para traer los transportes que tengan el estado "pendiente" y el tipo de servicio "servicio"
export const getTransportePendiente = async (req, res) => {
  try {
    const transportes = await Transporte.find({
      estado: "PENDIENTE",
      tipoServicio: "SERVICIO",
    });
    res.json(transportes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const exportTransporteExcel = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res
        .status(400)
        .json({ error: "Las fechas de inicio y fin son requeridas." });
    }

    const start = DateTime.fromISO(fechaInicio).startOf("day");
    const end = DateTime.fromISO(fechaFin).endOf("day");

    const transportes = await Transporte.find({
      fechat: {
        $gte: start.toJSDate(),
        $lte: end.toJSDate(),
      },
    });

    if (transportes.length === 0) {
      return res.status(404).json({
        error:
          "No se encontraron registros en el rango de fechas especificado.",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transportes");

    worksheet.columns = [
      { header: "Fecha", key: "fechat", width: 20 },
      { header: "Cliente", key: "cliente", width: 30 },
      { header: "Punto de Partida", key: "puntoPartida", width: 30 },
      { header: "Punto de Destino", key: "puntoDestino", width: 30 },
      { header: "Guía Remitente", key: "guiaRemitente", width: 20 },
      { header: "Guía Transportista", key: "guiaTransportista", width: 20 },
      { header: "Placa", key: "placa", width: 15 },
      { header: "Conductor", key: "conductor", width: 30 },
      { header: "Tipo de Servicio", key: "tipoServicio", width: 20 },
      { header: "Detalle", key: "detalle", width: 30 },
      { header: "Almacén de Devolución", key: "almacenDev", width: 30 },
      { header: "Comprobante de Devolución", key: "comprobanteDev", width: 30 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Turno", key: "turno", width: 15 },
      { header: "Planilla", key: "planilla", width: 15 },
      { header: "Combustible", key: "combustible", width: 15 },
      // Agregar más columnas según sea necesario
    ];

    transportes.forEach((transporte) => {
      worksheet.addRow({
        fechat: formatearFecha(transporte.fechat), // Formatear fecha a dd-mm-yyyy
        cliente: transporte.cliente,
        puntoPartida: transporte.puntoPartida,
        puntoDestino: transporte.puntoDestino,
        guiaRemitente: transporte.guiaRemitente,
        guiaTransportista: transporte.guiaTransportista,
        placa: transporte.placa,
        conductor: transporte.conductor,
        tipoServicio: transporte.tipoServicio,
        detalle: transporte.detalle,
        almacenDev: transporte.almacenDev,
        comprobanteDev: transporte.comprobanteDev,
        estado: transporte.estado,
        turno: transporte.turno,
        planilla: transporte.planilla,
        combustible: transporte.combustible,
        // Agregar más campos según sea necesario
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=transportes_${start.toFormat(
        "yyyyMMdd"
      )}_${end.toFormat("yyyyMMdd")}.xlsx`,
    });

    res.send(buffer);
  } catch (error) {
    console.error("Error al generar Excel:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
};
