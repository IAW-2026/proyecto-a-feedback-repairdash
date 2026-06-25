'use client'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface EstadoBadgeProps {
  estado: 'SinResolver' | 'Resuelto'
}

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  if (estado === 'SinResolver') {
    return (
      <span className="bg-brand-accent-soft/20 text-[#c392dd] text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full inline-flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
        <AlertTriangle size={14} />
        Sin resolver
      </span>
    )
  }
  return (
    <span className="bg-green-500/20 text-green-300 text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full inline-flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
      <CheckCircle2 size={14} />
      Resuelto
    </span>
  )
}
