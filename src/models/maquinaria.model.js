import mongoose from 'mongoose';

const maquinariaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['CARGADOR FRONTAL', 'STACKER', 'CAMIÓN', 'MONTACARGAS', 'OTRO']
  },
  marca: { type: String },
  modelo: { type: String },
  numeroSerie: { type: String, sparse: true },
  placa: { type: String, unique: true, sparse: true },
  anio: { type: Number },
  ubicacion: { type: String },

  unidadMedida: {
    type: String,
    enum: ['HORAS', 'KILOMETROS'],
    required: true
  },

  lecturaActual: { type: Number, default: 0 },
  mantenimientoCada: { type: Number, required: true },
  ultimaLecturaMantenimiento: { type: Number, default: 0 },
  ultimaFechaMantenimiento: { type: Date },

  estado: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO', 'EN TALLER'],
    default: 'ACTIVO'
  }
}, {
  timestamps: true
});

export default mongoose.model('Maquinaria', maquinariaSchema);
