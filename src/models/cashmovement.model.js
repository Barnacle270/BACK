import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const cashMovementSchema = new Schema({
  fecha: { type: Date, required: true },
  solicitante: { type: String, required: true },
  autorizadoPor: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipoComprobante: {
    type: String,
    enum: ['Factura', 'Boleta', 'Vale'],
    default: 'Vale'
  },
  serieComprobante: { type: String },
  destino: { type: String, required: true },
  monto: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['liquidado', 'por liquidar'],
    default: 'por liquidar'
  },
  tipo: {
    type: String,
    enum: ['ingreso', 'egreso'],
    required: true
  },
  empresa: { type: String, default: 'Transporte J' },
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

const CashMovement = model('CashMovement', cashMovementSchema);
export default CashMovement;
