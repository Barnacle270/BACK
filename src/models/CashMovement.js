// models/CashMovement.js
import mongoose from 'mongoose';

const CashMovementSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },

  tipo: { type: String, enum: ['INGRESO', 'EGRESO'], required: true },

  personaSolicita: { type: String },
  personaAutoriza: { type: String },

  descripcion: { type: String, required: true },
  categoria: {
    type: String,
    enum: ['VIATICOS', 'REPUESTOS', 'ADELANTO_SUELDO', 'OTROS'],
    required: function () {
      return this.tipo === 'EGRESO';
    }
  },
  origenIngreso: {
    type: String,
    enum: ['REPOSICION', 'REINTEGRO', 'VENTAS', 'OTRO'],
    required: function () {
      return this.tipo === 'INGRESO';
    }
  },

  placaOMaquina: { type: String },
  monto: { type: Number, required: true },

  estadoRendicion: {
    type: String,
    enum: ['RENDIDO', 'PENDIENTE', 'OBSERVADO'],
    default: 'PENDIENTE'
  },

  comprobantes: [{ type: String }], // URLs de imágenes o documentos
  observacion: { type: String },

  saldoFinalCaja: { type: Number },

  responsableCaja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  cerrado: { type: Boolean, default: false }
});

export const CashMovement = mongoose.model('CashMovement', CashMovementSchema);
