import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const transporteSchema = new mongoose.Schema(
  {
    fechat: {
      type: Date,
      required: true,
    },

    cliente: {
      type: String,
      required: true,
    },
    puntoPartida: {
      type: String,
      required: true,
    },
    puntoDestino: {
      type: String,
      required: true,
    },
    guiaRemitente: {
      type: String,
      required: true,
    },
    guiaTransportista: {
      type: String,
      required: true,
    },
    placa: {
      type: String,
      required: true,
    },
    conductor: {
      type: String,
      required: true,
    },
    tipoServicio: {
      type: String,
      required: true,
    },
    detalle: {
      type: String,
      required: true,
    },
    fechaVen: {
      type: Date,
      default:"",
    },
    almacenDev: {
      type: String,
    },
    comprobanteDev: {
      type: String,
    },
    fechaDev: {
      type: Date,
      default:"",
    },
    conductorDev: {
      type: String,
    },
    placaDev: {
      type: String, 
    },
    estado: {
      type: String,
      default: "PENDIENTE",
    },
    turno: {
      type: String,
      required: true,
    },
    planilla: {
      type: String,
    },
    combustible: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

transporteSchema.plugin(mongoosePaginate);

export default mongoose.model("Transporte", transporteSchema);