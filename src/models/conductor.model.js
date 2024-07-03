import mongoose from "mongoose";

const conductorSchema = new mongoose.Schema(
  {
    nombrec: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/* 
"nombrec":"aaaaaaa",
*/

export default mongoose.model("Conductor", conductorSchema);