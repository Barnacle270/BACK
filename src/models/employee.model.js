import mongoose from "mongoose";

// Definición del esquema del modelo de Empleado
const employeeSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true, // Asegura que no haya dos empleados con el mismo DNI
    },
    name: {
      type: String,
      required: true,
      trim: true, // Elimina espacios en blanco al principio y al final
    },
    email: {
      type: String,
      required: true,
      unique: true, // Asegura que el correo sea único
      lowercase: true, // Convierte todos los correos a minúsculas
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Validación básica de formato de correo
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'], // Validación de longitud mínima
    },
    role: {
      type: String,
      enum: ['usuario', 'administrador', 'superadministrador'], // Roles permitidos
      default: 'usuario', // Valor por defecto si no se especifica
      required: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente los campos 'createdAt' y 'updatedAt'
  }
);

export default mongoose.model("Employee", employeeSchema);
