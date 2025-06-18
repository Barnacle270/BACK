import { z } from 'zod';

export const movimientoSchema = z.object({
  fecha: z.coerce.date({ required_error: 'La fecha es requerida' }),
  solicitante: z.string().min(1, 'Solicitante es requerido'),
  autorizadoPor: z.string().min(1, 'Autorizado por es requerido'),
  descripcion: z.string().min(1, 'Descripción es requerida'),
  tipoComprobante: z.enum(['Factura', 'Boleta', 'Vale']),
  serieComprobante: z.string().optional(),
  destino: z.string().min(1, 'Destino es requerido'),
  monto: z.number().positive('Monto debe ser mayor a 0'),
  estado: z.enum(['liquidado', 'por liquidar']),
  tipo: z.enum(['ingreso', 'egreso']),
  empresa: z.string().optional()
});

export const movimientoSchemaPut = movimientoSchema.partial(); // para edición (campos opcionales)
