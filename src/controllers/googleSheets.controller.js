// 📂 controllers/googleSheets.controller.js
import getSheetData from "../services/googleSheets.service.js";

// --- URLs de tus hojas de cálculo ---
const SHEET_URL_CONDUCTORES =
  "https://docs.google.com/spreadsheets/d/1PdNR5rzMz0UaZcvMM9fAs5psVMRPuz_IJQ2EA-IeQpM/gviz/tq?tqx=out:csv&sheet=Conductores_Documentos";
const SHEET_URL_TRACTOS =
  "https://docs.google.com/spreadsheets/d/16rOR2Kl7TiphzDWV0BXuAuKvTA6SQKRgWCWdP_KlVSI/gviz/tq?tqx=out:csv&sheet=Tractos_Documentos";
const SHEET_URL_CARRETAS =
  "https://docs.google.com/spreadsheets/d/1ghaagTU-kWVS3_facQBvOp-0Ku9ePPmAXmat2MIR6t8/gviz/tq?tqx=out:csv&sheet=Carretas_Documentos";
const SHEET_URL_CUENTAS =
  "https://docs.google.com/spreadsheets/d/18VJZw_JfOncoF_b_sbDJzmNLTEJGZ71tOZ0_kfJNEf4/gviz/tq?tqx=out:csv&sheet=CXC";

// --- Función para parsear fechas dd/mm/yyyy ---
function parseFechaDDMMYYYY(str) {
  if (!str) return null;
  const partes = str.split("/");
  if (partes.length !== 3) return null;

  let [d, m, a] = partes.map((p) => p.trim());
  return new Date(`${a}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
}

// --- Procesador de documentos (conductores, tractos, carretas) ---
function procesarDocumentos(records) {
  const hoy = new Date();

  return records.map((row) => {
    const rawFecha = row["Fecha Vencimiento"]?.trim();
    const fechaVenc = rawFecha ? parseFechaDDMMYYYY(rawFecha) : null;

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
      fechaVencimiento: fechaVenc ? fechaVenc.toISOString().split("T")[0] : null,
      diasRestantes,
      estado,
    };
  });
}

// --- Procesador de cuentas por cobrar ---
function procesarCuentas(records) {
  const hoy = new Date();

  return records.map((row) => {
    // Fechas
    const fechaEmision = parseFechaDDMMYYYY(row["F.EMISIÓN"]?.trim());
    const fechaRecepcion = parseFechaDDMMYYYY(row["F/ Rec."]?.trim());
    const fechaVenc = parseFechaDDMMYYYY(row["F/ Vcto"]?.trim());

    let diasRestantes = null;
    let estado = "SIN FECHA";

    if (fechaVenc && !isNaN(fechaVenc)) {
      const diffTime = fechaVenc - hoy;
      diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diasRestantes < 0) {
        estado = "VENCIDO";
      } else if (diasRestantes <= 15) {
        estado = "POR VENCER";
      } else {
        estado = "VIGENTE";
      }
    }

    // Normalizar montos
    const soles = parseFloat((row["SOLES"] || "0").toString().replace(",", ""));
    const detraccion = parseFloat((row["Detracción"] || "0").toString().replace(",", ""));
    const venta = parseFloat((row["P.VENTA"] || "0").toString().replace(",", ""));
    const igv = parseFloat((row["I.G.V.18%"] || "0").toString().replace(",", ""));

    return {
      ...row,
      fechaEmision: fechaEmision ? fechaEmision.toISOString().split("T")[0] : null,
      fechaRecepcion: fechaRecepcion ? fechaRecepcion.toISOString().split("T")[0] : null,
      fechaVencimiento: fechaVenc ? fechaVenc.toISOString().split("T")[0] : null,
      diasRestantes,
      estado,
      soles,
      detraccion,
      venta,
      igv,
    };
  });
}

// --- Endpoints ---
export const getConductores = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_CONDUCTORES);
    res.json(procesarDocumentos(records));
  } catch (err) {
    console.error("❌ Error en getConductores:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTractos = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_TRACTOS);
    res.json(procesarDocumentos(records));
  } catch (err) {
    console.error("❌ Error en getTractos:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCarretas = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_CARRETAS);
    res.json(procesarDocumentos(records));
  } catch (err) {
    console.error("❌ Error en getCarretas:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCuentasPorCobrar = async (req, res) => {
  try {
    const records = await getSheetData(SHEET_URL_CUENTAS);
    res.json(procesarCuentas(records));
  } catch (err) {
    console.error("❌ Error en getCuentasPorCobrar:", err);
    res.status(500).json({ error: err.message });
  }
};
