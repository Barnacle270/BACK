import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  numeroGuia: {
    type: String,
    required: true,
    unique: true // Este campo será la clave única
  },
  fechaTraslado: {
    type: Date,
    required: true
  },
  documentoRelacionado: {
    type: String
  },
  cliente: {
    type: String
  },
  remitente: {
    ruc: { type: String },
    razonSocial: { type: String }
  },
  destinatario: {
    ruc: { type: String },
    razonSocial: { type: String }
  },
  direccionPartida: {
    type: String
  },
  direccionLlegada: {
    type: String
  },
  placaVehiculoPrincipal: {
    type: String
  },
  nombreConductor: {
    type: String
  },
  tipoCarga: {
    type: String,
    required: true,
    enum: ['CONTENEDOR', 'CARGA SUELTA', 'TOLVA', 'OTROS']
  },
  numeroContenedor: {
    type: String
  },
  observaciones: {
    type: String
  },
  terminalDevolucion: {
    type: String
  },
  vencimientoMemo: {
    type: Date
  },
  fechaDevolucion: {
    type: Date
  },
  placaDevolucion: {
    type: String
  },
  conductorDevolucion: {
    type: String
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'CONCLUIDO'],
    required: true
  }
}, {
  timestamps: true
});

const Servicio = mongoose.model('Servicio', servicioSchema);
export default Servicio;
