'use client'

import { Star, Search } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
import { useSearch } from '@/hooks/useSearch'
import type { Review } from '@/types'

interface ReviewsClientProps {
  reviews: Review[]
  page: number
  totalPaginas: number
  search: string
  total: number
  promedio: string | null
}

export default function ReviewsClient({
  reviews,
  page,
  totalPaginas,
  search,
  total,
  promedio,
}: ReviewsClientProps) {
  const { searchValue, setSearchValue, handlePage } = useSearch({ search })

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
          <div className="bg-[#3a1f52] px-4 py-2 rounded-xl border border-brand-accent-soft/20 flex items-center gap-2">
            <span className="text-brand-accent-strong font-bold text-xl">★ {promedio}</span>
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
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                autor={review.autor}
                valoracion={review.valoracion}
                trabajo={review.trabajo}
                review={review.review}
                href={`/reviews/${review.id}`}
              />
            ))}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
