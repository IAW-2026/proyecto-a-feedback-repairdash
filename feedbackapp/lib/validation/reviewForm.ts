import { z } from 'zod'

export const reviewFormSchema = z.object({
  reviewId: z.string().min(1, 'Falta el ID de la review'),
  valoracion: z
    .number()
    .int('La valoración debe ser un número entero')
    .min(1, 'La valoración debe ser entre 1 y 5')
    .max(5, 'La valoración debe ser entre 1 y 5'),
  review: z
    .string()
    .min(20, 'La opinión debe tener al menos 20 caracteres')
    .max(1000, 'La opinión no puede superar los 1000 caracteres'),
})
