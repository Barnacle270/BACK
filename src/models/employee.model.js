import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['usuario', 'administrador', 'superadministrador'],
      required: true,
      default: 'usuario',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", employeeSchema);
