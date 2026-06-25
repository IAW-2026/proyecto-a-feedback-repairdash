interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon size={48} className="text-brand-accent-soft mx-auto opacity-50 mb-4" />}
      <p className="text-brand-accent-mid text-lg">{title}</p>
      {description && (
        <p className="text-brand-accent-mid mt-2">{description}</p>
      )}
    </div>
  )
}
