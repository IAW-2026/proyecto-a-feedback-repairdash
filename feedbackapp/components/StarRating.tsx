'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number | null
  max?: number
  size?: number
}

export default function StarRating({ rating, max = 5, size = 18 }: StarRatingProps) {
  if (rating === null) return null

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.floor(rating)
              ? 'fill-[#f500f1] text-[#f500f1]'
              : 'text-[#8d62a5] opacity-30'
          }
        />
      ))}
    </div>
  )
}
