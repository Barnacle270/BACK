// controllers/facturaTransporte.controller.js
import XLSX from 'xlsx';
import FacturaTransporte from '../models/facturaTransporte.model.js';
import Servicio from '../models/servicio.model.js';



/**
 * Marca una factura como pagada (por id o por numero)
 * Body: { fechaPago?: 'ISODate' }
 * Params: :idOrNumero
 */
export const pagarFactura = async (req, res) => {
  try {
    const { idOrNumero } = req.params;
    const { fechaPago } = req.body;

    const byId = idOrNumero.match(/^[0-9a-fA-F]{24}$/);
    const filter = byId ? { _id: idOrNumero } : { numero: idOrNumero };

    const factura = await FacturaTransporte.findOne(filter);
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada.' });

    factura.estadoPago = 'PAGADO';
    factura.fechaPago = fechaPago ? new Date(fechaPago) : new Date();
    await factura.save(); // post('save') propagará pago a Servicios

    const result = await FacturaTransporte.findById(factura._id)
      .populate({ path: 'items.servicio', select: 'numeroGuia estadoPago fechaPago' });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al pagar la factura.', error: err?.message });
  }
};

export const obtenerFactura = async (req, res) => {
  try {
    const { idOrNumero } = req.params;
    const byId = idOrNumero.match(/^[0-9a-fA-F]{24}$/);
    const filter = byId ? { _id: idOrNumero } : { numero: idOrNumero };

    const factura = await FacturaTransporte.findOne(filter)
      .populate({
        path: 'items.servicio',
        select: 'numeroGuia cliente montoFacturacion factura'
      });

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada.' });
    }

    return res.status(200).json(factura);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener la factura.', error: err?.message });
  }
};

/**
 * Listar facturas con filtros básicos
 * Query: ?cliente=&estadoPago=&desde=YYYY-MM-DD&hasta=YYYY-MM-DD
 */
export const listarFacturas = async (req, res) => {
  try {
    const { cliente, estadoPago, desde, hasta } = req.query;
    const filter = {};
    if (cliente) filter.cliente = cliente;
    if (estadoPago) filter.estadoPago = estadoPago;
    if (desde || hasta) {
      filter.fechaEmision = {};
      if (desde) filter.fechaEmision.$gte = new Date(desde);
      if (hasta) filter.fechaEmision.$lte = new Date(hasta);
    }

    const facturas = await FacturaTransporte.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.servicio',
        select: 'numeroGuia cliente'
      }) // 👈 añadimos populate para ver guías y clientes en la lista
      .select('numero fechaEmision cliente total estadoPago fechaPago items');

    return res.status(200).json(facturas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al listar facturas.', error: err?.message });
  }
};


const HEADERS = [
  'numero',
  'cliente',
  'ruc',
  'moneda',
  'observaciones',
  'numeroGuia',
  'monto',
  'fechaEmision'   // 👈 nueva columna obligatoria
];

export const importarFacturasDesdeExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const XLSX = await import('xlsx');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: 'El Excel está vacío' });
    }

    // 👉 validación de cabeceras
    const headers = Object.keys(rows[0]);
    const faltantes = HEADERS.filter(h => !headers.includes(h));
    if (faltantes.length > 0) {
      return res.status(400).json({ message: `Faltan columnas: ${faltantes.join(', ')}` });
    }

    // 👉 agrupar filas por número de factura
    const facturasMap = {};
    for (const row of rows) {
      const numero = String(row.numero).trim();
      if (!facturasMap[numero]) {
        facturasMap[numero] = {
          numero,
          cliente: row.cliente ?? '',
          ruc: row.ruc ?? '',
          moneda: row.moneda ?? 'PEN',
          observaciones: row.observaciones ?? '',
          fechaEmision: row.fechaEmision
            ? new Date(row.fechaEmision)
            : new Date(), // si no hay fecha, usar hoy
          items: []
        };
      }

      facturasMap[numero].items.push({
        numeroGuia: String(row.numeroGuia).trim(),
        monto: Number(row.monto) || 0
      });
    }

    const created = [];
    const errors = [];

    // 👉 recorrer facturas agrupadas
    for (const numero in facturasMap) {
      const f = facturasMap[numero];
      const facturaItems = [];

      // buscar servicios de cada ítem
      for (const item of f.items) {
        const servicio = await Servicio.findOne({ numeroGuia: item.numeroGuia });
        if (!servicio) {
          errors.push({
            numero: f.numero,
            numeroGuia: item.numeroGuia,
            error: 'Servicio no encontrado'
          });
          continue;
        }

        facturaItems.push({
          numeroGuia: item.numeroGuia,
          servicio: servicio._id,
          monto: item.monto
        });
      }

      if (facturaItems.length === 0) {
        errors.push({ numero: f.numero, error: 'Ningún servicio válido encontrado' });
        continue;
      }

      // calcular total
      const total = facturaItems.reduce((s, it) => s + (it.monto || 0), 0);

      // crear factura
      const factura = new FacturaTransporte({
        numero: f.numero,
        cliente: f.cliente,
        ruc: f.ruc,
        moneda: f.moneda,
        observaciones: f.observaciones,
        fechaEmision: f.fechaEmision,   // 👈 guardamos la fecha de facturación
        total,
        items: facturaItems
      });

      await factura.save();

      // actualizar servicios con la referencia a esta factura
      for (const it of facturaItems) {
        await Servicio.updateOne(
          { _id: it.servicio },
          {
            factura: factura._id,
            montoFacturacion: it.monto,
            estadoFacturacion: 'FACTURADO',
            fechaEmision: f.fechaEmision, // 👈 usamos la fecha del Excel
            numeroFactura: factura.numero
          }
        );
      }

      created.push(factura);
    }

    return res.json({
      imported: created.length,
      facturas: created,
      errors
    });

  } catch (err) {
    console.error('Error al importar facturas:', err);
    return res.status(500).json({ message: 'Error interno al importar facturas' });
  }
};