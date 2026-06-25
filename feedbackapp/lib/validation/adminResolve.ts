import { z } from 'zod'

export const adminResolveSchema = z.object({
  decision: z.enum(['AFavor', 'EnContra'], {
    message: 'La decisión debe ser AFavor o EnContra',
  }),
})
