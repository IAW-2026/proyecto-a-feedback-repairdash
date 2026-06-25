'use client'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: number | string
  description: string
  variant: 'danger' | 'info'
}

const variantStyles = {
  danger: {
    value: 'text-red-400',
    description: 'text-red-300/70',
    border: 'border-red-500/30 hover:border-red-500/60',
  },
  info: {
    value: 'text-brand-accent-mid',
    description: 'text-brand-accent-mid/90',
    border: 'border-brand-accent-mid/30 hover:border-brand-accent-mid/60',
  },
}

export default function StatCard({ icon, title, value, description, variant }: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`bg-brand-bg rounded-lg p-[clamp(1rem,3vw,1.5rem)] border ${styles.border} transition-all`}>
      <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-[clamp(0.75rem,2vw,1rem)]">
        {icon}
        <p className="text-brand-accent-mid uppercase font-semibold" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
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
