import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { date } from "zod";

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
    almacenDev: {
      type: String,
    },
    comprobanteDev: {
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