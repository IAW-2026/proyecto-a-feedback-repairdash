'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  valoracion: number | null
  max?: number
  size?: number
}

export default function StarRating({ valoracion, max = 5, size = 18 }: StarRatingProps) {
  if (valoracion === null) return null

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(valoracion)
              ? 'fill-brand-accent-strong text-brand-accent-strong'
              : 'text-brand-accent-soft opacity-30'
          }
        />
      ))}
    </div>
  )
}
