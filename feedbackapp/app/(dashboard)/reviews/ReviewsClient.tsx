'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Star, Search, Briefcase, Calendar } from 'lucide-react'
import StarRating from '@/components/StarRating'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'

interface Review {
  id: string
  valoracion: number | null
  review: string | null
  autor: {
    id: string
    nombre: string | null
    apellido: string | null
    rol: string
  }
  trabajo: {
    id: string
    tipoDeTrabajo: string
    fechaFin: Date | null
  }
}

interface ReviewsClientProps {
  reviews: Review[]
  page: number
  totalPaginas: number
  search: string
  total: number
  promedio: string | null
}

function formatDate(date: Date | null): string {
  if (!date) return 'Fecha no disponible'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ReviewsClient({
  reviews,
  page,
  totalPaginas,
  search,
  total,
  promedio,
}: ReviewsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Debounce de búsqueda
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      const newSearch = searchValue.trim()
      router.push(
        `${pathname}?search=${encodeURIComponent(newSearch)}&page=1`
      )
    }, 400)

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [searchValue, router, pathname])

  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(
        `${pathname}?search=${encodeURIComponent(search)}&page=${page - 1}`
      )
    }
  }

  const handleNextPage = () => {
    if (page < totalPaginas) {
      router.push(
        `${pathname}?search=${encodeURIComponent(search)}&page=${page + 1}`
      )
    }
  }

  const hasNoReviews = reviews.length === 0
  const hasSearch = search.trim() !== ''

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#c392dd] mb-2">
            REVIEWS RECIBIDAS
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Reviews recibidas</h1>
          <p className="text-[#c392dd]">
            Reviews recibidas por trabajos que realicé
          </p>
        </div>

        {/* Badge promedio */}
        {promedio !== null && (
          <div className="bg-[#3a1f52] px-4 py-2 rounded-xl border border-[#8d62a5]/20 flex items-center gap-2">
            <span className="text-[#f500f1] font-bold text-xl">★ {promedio}</span>
            <span className="text-[#c392dd] text-sm">{total} reviews</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Buscar por tipo de trabajo..."
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* Estado vacío */}
      {hasNoReviews ? (
        <EmptyState
          icon={hasSearch ? Search : Star}
          title={hasSearch ? 'No se encontraron reviews para tu búsqueda' : 'Todavía no recibiste ninguna review'}
        />
      ) : (
        <>
          {/* Lista de reviews */}
          <div className="space-y-6 mb-8">
            {reviews.map((review, index) => (
              <Link
                key={review.id}
                href={`/reviews/${review.id}`}
                className="block group"
              >
                {/* Review */}
                <div className="mb-6">
                  {/* Header: Autor y detalles */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-[#fbdaf9] mb-1 group-hover:text-[#f500f1] transition-colors">
                          {review.autor.nombre} {review.autor.apellido}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-3 py-1 bg-[#8d62a5]/20 text-[#c392dd] text-xs font-medium rounded-full">
                            {review.autor.rol === 'rider' ? 'Rider' : 'Driver'}
                          </span>
                        </div>
                      </div>
                      {review.valoracion !== null && (
                        <div className="flex-shrink-0">
                          <StarRating rating={review.valoracion} />
                        </div>
                      )}
                    </div>

                    {/* Tipo de trabajo y fecha */}
                    <div className="flex items-center gap-4 text-sm text-[#c392dd]">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>{review.trabajo.tipoDeTrabajo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(review.trabajo.fechaFin)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Texto de la review */}
                  <p className="text-[#fbdaf9] leading-relaxed line-clamp-3">
                    {review.review}
                  </p>
                </div>

                {/* Separador */}
                {index < reviews.length - 1 && (
                  <div className="border-t border-[#8d62a5]/20 mb-6" />
                )}
              </Link>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#8d62a5]/20">
              <button
                onClick={handlePreviousPage}
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
                onClick={handleNextPage}
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
          )}
        </>
      )}
    </div>
  )
}
