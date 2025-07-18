import mongoose from 'mongoose';

const mantenimientoRealizadoSchema = new mongoose.Schema({
  maquinaria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maquinaria',
    required: true
  },
  tipoMantenimiento: {
    type: String,
    required: true
  },
  lectura: {
    type: Number,
    required: true
  },
  unidad: {
    type: String,
    enum: ['HORAS', 'KILOMETROS'],
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  observaciones: {
    type: String
  },
  realizadoPor: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('MantenimientoRealizado', mantenimientoRealizadoSchema);
