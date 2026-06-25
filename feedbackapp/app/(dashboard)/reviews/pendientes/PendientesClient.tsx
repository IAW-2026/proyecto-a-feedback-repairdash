'use client'

import Link from 'next/link'
import { ArrowRight, User, Briefcase, Calendar, Inbox } from 'lucide-react'
import { formatDate } from '@/lib/dates'
import Pagination from '@/components/Pagination'
import { useSearch } from '@/hooks/useSearch'

interface ReviewPendiente {
  id: string
  idTrabajo: string
  trabajo: {
    tipoDeTrabajo: string
    fechaFin: Date | null
    idRider: string
    rider: { nombre: string; apellido: string } | null
    idDriver: string
    driver: { nombre: string; apellido: string } | null
  }
}

interface PendientesClientProps {
  userId: string
  reviews: ReviewPendiente[]
  total: number
  page: number
  totalPaginas: number
}

export default function PendientesClient({ userId, reviews, total, page, totalPaginas }: PendientesClientProps) {
  const { handlePage } = useSearch({ search: '' })

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-brand-accent-mid mb-2">
          REVIEWS PENDIENTES
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Reviews pendientes</h1>
        <p className="text-brand-accent-mid">{total} {total === 1 ? 'review que tenés' : 'reviews que tenés'} que completar sobre otros usuarios</p>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox size={48} className="text-brand-accent-soft opacity-50 mb-4" />
          <p className="text-brand-accent-mid text-lg">No tenés reviews pendientes</p>
          <p className="text-brand-accent-soft mt-2 text-sm">
            {page > 1 ? 'No hay más resultados en esta página' : 'Todas tus reviews están completadas'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => {
              const usuarioAEvaluar =
                review.trabajo.idRider === userId
                  ? review.trabajo.driver
                  : review.trabajo.rider

              return (
                <div
                  key={review.id}
                  className="bg-brand-card rounded-xl p-6 border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-brand-card-hover hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-accent-soft/20 p-2 rounded-lg">
                          <User size={20} className="text-brand-accent-strong" />
                        </div>
                        <div>
                          <p className="text-brand-accent-mid text-xs uppercase tracking-wider">
                            Usuario a evaluar
                          </p>
                          <p className="text-brand-text-light font-semibold truncate max-w-[120px] sm:max-w-none">
                            {usuarioAEvaluar?.nombre} {usuarioAEvaluar?.apellido}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Briefcase size={18} className="text-brand-accent-soft" />
                        <span className="text-brand-accent-mid">{review.trabajo.tipoDeTrabajo}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-brand-accent-soft" />
                        <span className="text-brand-accent-mid">
                          {formatDate(review.trabajo.fechaFin)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/reviews/realizar/${review.idTrabajo}`}
                      className="flex items-center gap-2 max-sm:gap-1 bg-brand-accent-strong text-white py-3 max-sm:py-1.5 px-5 max-sm:px-2.5 rounded-lg hover:scale-[1.02] transition-transform duration-300 shadow-lg font-semibold text-sm max-sm:text-xs shrink-0"
                    >
                      Hacer review
                      <ArrowRight size={20} className="max-sm:hidden" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
