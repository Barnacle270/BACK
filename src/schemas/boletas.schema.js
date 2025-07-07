import { z } from 'zod';

export const createBoletasSchema = z.object({
  dni: z
    .string({
      required_error: 'dni is required',
    })
    .min(6, {
      message: 'DNI debe contener almenos 6 caracteres',
    }),
  mes: z
    .string({
      required_error: 'debe ingresar el mes',
    }),
  year: z
    .string({
      required_error: 'debe ingresar el año',
    }),
});
