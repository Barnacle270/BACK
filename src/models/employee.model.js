import mongoose from "mongoose";

// Definición del esquema del modelo de Empleado
const employeeSchema = new mongoose.Schema(
  {
    dni: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['User', 'Administrador', 'Superadministrador','Coordinador', 'Almacen'],
      default: 'User',
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
