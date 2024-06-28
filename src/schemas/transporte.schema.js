import { z } from 'zod';

export const transporteSchema = z.object({
  fechat: z.string({
    required_error: 'la fecha es requerida',
  }),
});

