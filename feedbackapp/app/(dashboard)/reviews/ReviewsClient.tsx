'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Star, Search } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import Pagination from '@/components/Pagination'
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

  const handlePage = (p: number) => {
    router.push(
      `${pathname}?search=${encodeURIComponent(search)}&page=${p}`
    )
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
