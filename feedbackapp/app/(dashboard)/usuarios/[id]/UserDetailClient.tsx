'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Star, AlertCircle } from 'lucide-react'
import StatCard from '@/components/StatCard'
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
  reviews: Review[]
  page: number
  totalPaginas: number
}

export default function UserDetailClient({
  usuario,
  promedio,
  reportesEnContra,
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(1rem,3vw,2rem)]">
          <div className="min-w-0">
            <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Perfil de usuario
            </p>
            <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              {usuario.nombre} {usuario.apellido}
            </h1>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Información y reviews del usuario
            </p>
          </div>

          {promedio !== null && (
            <div className="bg-[#3a1f52] px-4 py-2 rounded-xl border border-[#8d62a5]/20 flex items-center gap-2">
              <span className="text-[#f500f1] font-bold text-xl">★ {promedio}</span>
              <span className="text-[#c392dd] text-sm">promedio</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <StatCard
          icon={<AlertCircle size={20} className="text-red-400 flex-shrink-0" />}
          title="Reportes en contra"
          value={reportesEnContra}
          description="reportes resueltos desfavorablemente"
          variant="danger"
        />
      </div>

      <div>
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reviews recibidas
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-[#3a1f52]/50 rounded-lg p-[clamp(1.5rem,4vw,3rem)] border border-dashed border-[#8d62a5]/30 text-center">
            <Star size={48} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#8d62a5]" />
            <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
              Sin reviews
            </h3>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
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
