'use client'

interface PaginationProps {
  page: number
  totalPaginas: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPaginas,
  onPageChange,
}: PaginationProps) {
  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-between pt-6 border-t border-brand-accent-soft/20 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 border border-brand-accent-soft rounded-lg font-semibold text-sm transition-all duration-200 ${
          page === 1
            ? 'opacity-40 cursor-not-allowed text-brand-text-light'
            : 'bg-brand-card text-brand-text-light hover:border-brand-accent-strong hover:text-brand-accent-strong'
        }`}
      >
        Anterior
      </button>

      <span className="text-brand-accent-mid text-sm">
        Página {page} de {totalPaginas}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPaginas}
        className={`px-4 py-2 border border-brand-accent-soft rounded-lg font-semibold text-sm transition-all duration-200 ${
          page === totalPaginas
            ? 'opacity-40 cursor-not-allowed text-brand-text-light'
            : 'bg-brand-card text-brand-text-light hover:border-brand-accent-strong hover:text-brand-accent-strong'
        }`}
      >
        Siguiente
      </button>
    </div>
  )
}
