'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

interface UserCardProps {
  id: string
  nombre: string
  apellido: string
  valoracion: number
  badge?: string
  children?: React.ReactNode
}

export default function UserCard({ id, nombre, apellido, valoracion, badge, children }: UserCardProps) {
  return (
    <Link href={`/usuarios/${id}`} className="block group">
      <div className="bg-[#3a1f52] rounded-lg py-[clamp(0.75rem,2.5vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)] border border-[#8d62a5]/30 hover:border-[#f500f1]/40 hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:scale-[1.01]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-gilroy font-bold text-[#fbdaf9]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            {apellido}, {nombre}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.floor(valoracion) ? 'fill-[#f500f1] text-[#f500f1]' : 'text-[#8d62a5] opacity-30'}
              />
            ))}
            <span className="text-[#c392dd] text-xs font-medium ml-1">{valoracion}/5</span>
          </div>
          {badge && (
            <span className="inline-block px-2.5 py-0.5 bg-[#8d62a5]/20 text-[#c392dd] text-xs font-medium rounded-full whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </Link>
  )
}
