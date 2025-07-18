import mongoose from 'mongoose';

const lecturaSchema = new mongoose.Schema({
  maquinaria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maquinaria',
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
  operador: {
    type: String
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Lectura', lecturaSchema);
