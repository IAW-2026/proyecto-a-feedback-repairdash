'use client'

import { Star, AlertCircle, Briefcase, Calendar } from 'lucide-react'

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

interface UserDetailClientProps {
  usuario: {
    id: string
    nombre: string
    apellido: string
  }
  promedio: number | null
  reportesEnContra: number
  reviews: Review[]
}

function formatDate(date: Date | null): string {
  if (!date) return 'Fecha no disponible'
  return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return null
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? 'fill-[#f500f1] text-[#f500f1]'
              : 'text-[#8d62a5] opacity-30'
          }
        />
      ))}
    </div>
  )
}

export default function UserDetailClient({
  usuario,
  promedio,
  reportesEnContra,
  reviews,
}: UserDetailClientProps) {
  return (
    <div className="w-full">
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(1rem,3vw,2rem)]">
          <div className="min-w-0">
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
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
        <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-red-500/30 hover:border-red-500/60 transition-all max-w-md">
          <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-[clamp(0.75rem,2vw,1rem)]">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <p className="text-[#8d62a5] uppercase font-semibold" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Reportes en contra
            </p>
          </div>
          <div className="font-gilroy font-bold text-red-400" style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
            {reportesEnContra}
          </div>
          <p className="text-red-300/70" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            reportes resueltos desfavorablemente
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reviews recibidas
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-[#3a1f52]/50 rounded-lg p-[clamp(1.5rem,4vw,3rem)] border border-dashed border-[#8d62a5]/30 text-center">
            <Star size={48} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#8d62a5]" />
            <h4 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
              Sin reviews
            </h4>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Este usuario no ha recibido reviews todavía
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#3a1f52] rounded-lg p-[clamp(1rem,4vw,1.5rem)] border border-[#8d62a5]/30 hover:border-[#f500f1]/40 hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="text-lg font-bold text-[#fbdaf9] mb-1 transition-colors">
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

                <p className="text-[#fbdaf9] leading-relaxed line-clamp-3">
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
