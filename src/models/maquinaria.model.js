// models/maquinaria.model.js
import mongoose from 'mongoose';

const tipoMantenimientoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Ej: Motor, Filtros, Hidráulico
  frecuencia: { type: Number, required: true }, // Cada cuántas horas/km
  unidad: {
    type: String,
    enum: ['HORAS', 'KILOMETROS'],
    required: true
  },
  ultimaLectura: { type: Number, default: 0 },
  ultimaFecha: { type: Date },
});

const maquinariaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['CARGADOR FRONTAL', 'STACKER', 'CAMIÓN', 'MONTACARGAS', 'OTRO']
  },
  marca: { type: String },
  modelo: { type: String },
  numeroSerie: { type: String, unique: true, sparse: true },
  placa: { type: String, unique: true, sparse: true },
  anio: { type: Number },
  ubicacion: { type: String },

  unidadMedida: {
    type: String,
    enum: ['HORAS', 'KILOMETROS'],
    required: true
  },

  lecturaActual: { type: Number, default: 0 },
  mantenimientos: [tipoMantenimientoSchema],

  estado: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO', 'EN TALLER'],
    default: 'ACTIVO'
  }
}, {
  timestamps: true
});

export default mongoose.model('Maquinaria', maquinariaSchema);
