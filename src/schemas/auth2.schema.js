// src/schemas/login.schema.js
import { z } from "zod";

export const loginSchema = z.object({
  dni: z
    .string({ required_error: "El DNI es obligatorio" })
    .length(8, { message: "El DNI debe tener 8 dígitos" })
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" }),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});
