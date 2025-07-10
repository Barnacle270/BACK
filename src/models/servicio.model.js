import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  tipoGuia: {
    type: String,
    enum: ['NORMAL', 'ESPECIAL'],
    required: true
  },
  numeroGuia: {
    type: String,
    required: true,
    unique: true
  },
  fechaTraslado: {
    type: Date // Ya no es "required", para aceptar guías tipo 62
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
  horaCita: {
    type: String
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
  },

  // FACTURACIÓN
  estadoFacturacion: {
    type: String,
    enum: ['RECEPCIONADO', 'FACTURADO'],
    default: null
  },
  fechaRecepcion: {
    type: Date,
    default: null
  },
  fechaFacturacion: {
    type: Date,
    default: null
  },
  numeroFactura: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

const Servicio = mongoose.model('Servicio', servicioSchema);
export default Servicio;
