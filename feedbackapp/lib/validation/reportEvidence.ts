import { z } from 'zod'

export const reportEvidenceSchema = z.object({
  descripcion: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  url: z
    .string()
    .url('La URL no es válida'),
  tipo: z
    .string()
    .min(1, 'El tipo no puede estar vacío'),
})

export const reportEvidenceArraySchema = z.object({
  descripcion: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres'),
  pruebas: z
    .array(
      z.object({
        url: z.string().url('La URL no es válida'),
        tipo: z.string().min(1, 'El tipo no puede estar vacío'),
      })
    )
    .min(1, 'Debe haber al menos una prueba'),
})
