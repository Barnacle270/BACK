import mongoose from 'mongoose';

const repuestoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, default: 1 },
  marca: { type: String }
}, { _id: false });

const mantenimientoSchema = new mongoose.Schema({

  codigo: {
    type: String,
    required: true,
    unique: true
  },
  maquinaria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maquinaria',
    required: true
  },
  tipo: {
    type: String,
    enum: ['PREVENTIVO', 'CORRECTIVO'],
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  lectura: {
    type: Number,
    required: true,
    min: 0
  },
  repuestos: [repuestoSchema],
  responsable: {
    type: String
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Mantenimiento', mantenimientoSchema);
