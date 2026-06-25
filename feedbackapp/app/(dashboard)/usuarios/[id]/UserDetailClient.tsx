'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Star, AlertCircle } from 'lucide-react'
import StatCard from '@/components/StatCard'
import StarRating from '@/components/StarRating'
import ReviewCard from '@/components/ReviewCard'
import Pagination from '@/components/Pagination'
import type { Review } from '@/types'

interface UserDetailClientProps {
  usuario: {
    id: string
    nombre: string
    apellido: string
  }
  promedio: number | null
  reportesEnContra: number
  totalReviews: number
  reviews: Review[]
  page: number
  totalPaginas: number
}

export default function UserDetailClient({
  usuario,
  promedio,
  reportesEnContra,
  totalReviews,
  reviews,
  page,
  totalPaginas,
}: UserDetailClientProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handlePage = (p: number) => {
    router.push(`${pathname}?page=${p}`)
  }

  return (
    <div className="w-full">
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <div className="relative mb-[clamp(1.5rem,3vw,2rem)]">
          <div>
            <p className="text-brand-accent-mid font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Perfil de usuario
            </p>
            <h1 className="font-gilroy font-bold text-brand-text-light mb-1" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              {usuario.nombre} {usuario.apellido}
            </h1>
            <p className="text-brand-accent-mid" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Información y reviews del usuario
            </p>
          </div>
          <div className="opacity-70 scale-[0.7] origin-top-right sm:absolute sm:right-0 sm:top-0">
            <StatCard
              icon={<AlertCircle size={20} className="flex-shrink-0" />}
              title="Reportes en contra"
              value={reportesEnContra}
              description="Reportes resueltos desfavorablemente"
              variant={reportesEnContra > 0 ? 'danger' : 'info'}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {promedio !== null && (
            <div className="bg-brand-card rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
                <Star size={24} className="text-brand-accent-mid flex-shrink-0" />
                <p className="text-brand-accent-mid font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Valoración Promedio
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-2">
                  <StarRating valoracion={promedio} size={28} />
                  <span className="font-gilroy font-bold text-brand-text-light" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    {promedio} / 5
                  </span>
                </div>
                <span className="text-brand-accent-mid text-sm">
                  Basado en {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-gilroy font-bold text-brand-text-light mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reviews recibidas
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-brand-card/50 rounded-lg p-[clamp(1.5rem,4vw,3rem)] border border-dashed border-brand-accent-soft/30 text-center">
            <Star size={48} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-brand-accent-soft" />
            <h3 className="font-gilroy font-bold text-brand-text-light mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
              Sin reviews
            </h3>
            <p className="text-brand-accent-mid" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Este usuario no ha recibido reviews todavía
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                autor={review.autor}
                valoracion={review.valoracion}
                trabajo={review.trabajo}
                review={review.review}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
      </div>
    </div>
  )
}