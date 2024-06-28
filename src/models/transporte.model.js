import mongoose from "mongoose";

const transporteSchema = new mongoose.Schema(
  {
    fechat: {
      type: String,
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
      required: true,
    },
    comprobanteDev: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true,
    },
    turno: {
      type: String,
      required: true,
    },
    planilla: {
      type: String,
      required: true,
    },
    combustible: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* 
"fecha":"25/06/2024",
"cliente": "SAN FERNANDO",
"puntoPartida": "LURIN",
"puntoDestino": "LURIN",
"guiaRemitente": "123456",
"guiaTransportista": "123456",
"placa": "123456",
"conductor": "123456",
"tipoServicio": "123456",
"detalle": "123456",
"almacenDev": "123456",
"comprobanteDev": "123456",
"estado": "123456",
"turno": "123456",
"planilla": "123456",
"combustible": "123456",
*/

export default mongoose.model("Transporte", transporteSchema);