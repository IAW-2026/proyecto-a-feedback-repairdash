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
    <div className="flex items-center justify-between pt-6 border-t border-[#8d62a5]/20 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 border border-[#8d62a5] rounded-lg font-semibold text-sm transition-all duration-200 ${
          page === 1
            ? 'opacity-40 cursor-not-allowed text-[#fbdaf9]'
            : 'bg-[#3a1f52] text-[#fbdaf9] hover:border-[#f500f1] hover:text-[#f500f1]'
        }`}
      >
        ← Anterior
      </button>

      <span className="text-[#c392dd] text-sm">
        Página {page} de {totalPaginas}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPaginas}
        className={`px-4 py-2 border border-[#8d62a5] rounded-lg font-semibold text-sm transition-all duration-200 ${
          page === totalPaginas
            ? 'opacity-40 cursor-not-allowed text-[#fbdaf9]'
            : 'bg-[#3a1f52] text-[#fbdaf9] hover:border-[#f500f1] hover:text-[#f500f1]'
        }`}
      >
        Siguiente →
      </button>
    </div>
  )
}
