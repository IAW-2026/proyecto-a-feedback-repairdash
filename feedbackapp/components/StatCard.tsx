'use client'

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: number | string
  description: string
  variant: 'danger' | 'info'
}

const variantStyles = {
  danger: {
    icon: 'text-red-400',
    value: 'text-red-400',
    description: 'text-red-300/70',
    border: 'border-red-500/30 hover:border-red-500/60',
  },
  info: {
    icon: 'text-[#c392dd]',
    value: 'text-[#c392dd]',
    description: 'text-[#c392dd]/90',
    border: 'border-[#c392dd]/30 hover:border-[#c392dd]/60',
  },
}

export default function StatCard({ icon: Icon, title, value, description, variant }: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border ${styles.border} transition-all`}>
      <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-[clamp(0.75rem,2vw,1rem)]">
        <Icon size={20} className={`${styles.icon} flex-shrink-0`} />
        <p className="text-[#c392dd] uppercase font-semibold" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
          {title}
        </p>
      </div>
      <div className={`font-gilroy font-bold text-center ${styles.value}`} style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
        {value}
      </div>
      <p className={`text-center ${styles.description}`} style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        {description}
      </p>
    </div>
  )
}
