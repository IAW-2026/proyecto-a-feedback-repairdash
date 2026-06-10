'use client'
import { CheckCircle2, XCircle } from 'lucide-react'

interface DecisionBadgeProps {
  favorable: boolean
}

export default function DecisionBadge({ favorable }: DecisionBadgeProps) {
  if (favorable) {
    return (
      <span className="bg-green-500/20 text-green-300 text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full inline-flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
        <CheckCircle2 size={14} />
        A favor
      </span>
    )
  }
  return (
    <span className="bg-red-500/20 text-red-300 text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full inline-flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
      <XCircle size={14} />
      En contra
    </span>
  )
}
