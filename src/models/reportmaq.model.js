import mongoose from "mongoose";

const reportmaqSchema = new mongoose.Schema(
  {
    numeroControl: {
      type: String,
      required: true,
      unique: true,
    },
    fecha: {
      type: String,
      required: true,
      trim: true,
    },
    cliente: {
      type: String,
      required: true,
      trim: true,
    },
    almacen: {
      type: String,
      required: true,
      trim: true,
    },
    maquina: {
      type: String,
      required: true,
      trim: true,
    },
    operador: {
      type: String,
      required: true,
      trim: true,
    },
    turno: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    inicio: {
      type: String,
      required: true,
      trim: true,
    },
    fin: {
      type: String,
      required: true,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
      trim: true,
    },
    tarifa: {
      type: Number,
      required: true,
      trim: true,
    },
    payO: {
      type: Number,
      required: false,
      trim: true,
    },
    paymentC: {
      type: Number,
      required: false,
      trim: true,
    },
    estate: {
      type: String,
      enum: ["pendiente", "pagado", "facturado"],
      default: "pendiente",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


export default mongoose.model("Reportmaq", reportmaqSchema);