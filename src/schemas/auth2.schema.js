import { z } from 'zod';


export const registerSchema = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  dni: z
    .string({
      required_error: 'dni is required',
    }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    }),
});

export const loginSchema = z.object({
  dni: z
    .string({
      required_error: 'el dni es requerido',
    }),
  password: z
    .string({
      required_error: 'la contraseña es requerida',
    })
});
