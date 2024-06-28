import mongoose from "mongoose";

const camionesSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* 
"placa":"D4C828",
*/

export default mongoose.model("Camiones", camionesSchema);