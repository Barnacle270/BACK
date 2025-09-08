// models/Factura.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const facturaItemSchema = new Schema({
  servicio: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
  monto: { type: Number, required: true, min: 0 }
}, { _id: false });

const facturaSchema = new Schema({
  numero: { type: String, required: true, unique: true }, // ej. "FF10-500"
  fechaEmision: { type: Date, default: Date.now },

  // (Opcional pero útil si quieres controlar consistencia por cliente/moneda)
  cliente: { type: String, default: null },
  ruc: { type: String, default: null },
  moneda: { type: String, default: 'PEN' },

  items: {
    type: [facturaItemSchema],
    validate: {
      validator: v => Array.isArray(v) && v.length > 0,
      message: 'La factura debe tener al menos un ítem.'
    }
  },

  total: { type: Number, required: true, min: 0, default: 0 },

  observaciones: { type: String, default: '' },

  // Pago a nivel de factura
  estadoPago: { type: String, enum: ['PENDIENTE', 'PAGADO'], default: 'PENDIENTE' },
  fechaPago: { type: Date, default: null }
}, { timestamps: true });

// Índices
facturaSchema.index({ numero: 1 }, { unique: true });

// --- Hooks ---

// Calcula total = suma(montos)
facturaSchema.pre('validate', function (next) {
  const suma = (this.items || []).reduce((acc, it) => acc + (it.monto || 0), 0);
  this.total = Number.isFinite(suma) ? suma : 0;
  next();
});

// Verifica que ningún servicio ya esté asociado a otra factura
facturaSchema.pre('save', async function (next) {
  try {
    const Servicio = mongoose.model('Servicio');
    const idsServicios = this.items.map(i => i.servicio);

    // ¿Alguno ya tiene factura distinta?
    const repetidos = await Servicio.find({
      _id: { $in: idsServicios },
      factura: { $ne: null }
    }).select('_id factura').lean();

    if (repetidos.length > 0) {
      return next(new Error('Uno o más servicios ya están asociados a una factura.'));
    }

    // (Opcional) Consistencia de cliente
    if (this.cliente) {
      const servicios = await Servicio.find({ _id: { $in: idsServicios } })
        .select('_id cliente').lean();
      const distintos = new Set(servicios.map(s => s.cliente || ''));
      if (distintos.size > 1) {
        return next(new Error('Los servicios pertenecen a diferentes clientes.'));
      }
      // Si no pusiste cliente en la factura, podrías setearlo automático con el de los servicios:
      // this.cliente = servicios[0]?.cliente || this.cliente;
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Después de guardar, enlaza servicios y copia montos. Si está pagada, propaga pago.
facturaSchema.post('save', async function (doc, next) {
  try {
    const Servicio = mongoose.model('Servicio');

    // Vincular cada servicio a la factura y guardar su monto de línea
    for (const it of doc.items) {
      await Servicio.updateOne(
        { _id: it.servicio },
        { $set: { factura: doc._id, montoFacturacion: it.monto } }
      );
    }

    // Si la factura está pagada, marcar servicios como pagados
    if (doc.estadoPago === 'PAGADO') {
      await Servicio.updateMany(
        { _id: { $in: doc.items.map(i => i.servicio) } },
        { $set: { estadoPago: 'PAGADO', fechaPago: doc.fechaPago || new Date() } }
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Factura = mongoose.model('Factura', facturaSchema);
export default Factura;
