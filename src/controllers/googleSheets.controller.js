import getSheetData from "../services/googleSheets.service.js";

const SHEET_URL_CONDUCTORES = "https://docs.google.com/spreadsheets/d/1PdNR5rzMz0UaZcvMM9fAs5psVMRPuz_IJQ2EA-IeQpM/gviz/tq?tqx=out:csv&sheet=Conductores_Documentos";
const SHEET_URL_TRACTOS = "https://docs.google.com/spreadsheets/d/16rOR2Kl7TiphzDWV0BXuAuKvTA6SQKRgWCWdP_KlVSI/gviz/tq?tqx=out:csv&sheet=Tractos_Documentos";
const SHEET_URL_CARRETAS = "https://docs.google.com/spreadsheets/d/1ghaagTU-kWVS3_facQBvOp-0Ku9ePPmAXmat2MIR6t8/gviz/tq?tqx=out:csv&sheet=Carretas_Documentos";

function procesarDocumentos(records) {
  const hoy = new Date();

  return records.map((row) => {
    const rawFecha = row["Fecha Vencimiento"]?.trim(); // limpiar espacios
    let fechaVenc = null;

    if (rawFecha) {
      // Intentamos normalizar el formato: DD/MM/YYYY → YYYY-MM-DD
      if (rawFecha.includes("/")) {
        const [dia, mes, anio] = rawFecha.split("/");
        if (dia && mes && anio) {
          fechaVenc = new Date(`${anio}-${mes}-${dia}`);
        }
      } else {
        // Si ya viene como YYYY-MM-DD o similar
        fechaVenc = new Date(rawFecha);
      }
    }

    let diasRestantes = null;
    let estado = "SIN FECHA";

    if (fechaVenc && !isNaN(fechaVenc)) {
      const diffTime = fechaVenc - hoy;
      diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diasRestantes < 0) {
        estado = "VENCIDO";
      } else if (diasRestantes <= 30) {
        estado = "POR VENCER";
      } else {
        estado = "VIGENTE";
      }
    }

    return {
      ...row,
      diasRestantes,
      estado,
    };
  });
}

export const getConductores = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_CONDUCTORES);
    res.json(procesarDocumentos(records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTractos = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_TRACTOS);
    res.json(procesarDocumentos(records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCarretas = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_CARRETAS);
    res.json(procesarDocumentos(records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
