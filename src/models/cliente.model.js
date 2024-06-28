import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    rz: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* 
"rz":"ALICORP",
*/

export default mongoose.model("Cliente", clienteSchema);