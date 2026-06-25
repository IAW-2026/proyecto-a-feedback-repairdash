import Link from 'next/link'
import { Briefcase, Calendar } from 'lucide-react'
import StarRating from '@/components/StarRating'
import { formatDate } from '@/lib/dates'
import { getRolLabel } from '@/lib/roles'

interface ReviewCardProps {
  autor: { nombre: string | null; apellido: string | null; rol: string }
  valoracion: number | null
  trabajo: { tipoDeTrabajo: string; fechaFin: Date | null }
  review: string | null
  href?: string
}

export default function ReviewCard({
  autor,
  valoracion,
  trabajo,
  review,
  href,
}: ReviewCardProps) {
  const cardClass =
    'block bg-[#3a1f52] rounded-lg p-[clamp(1rem,4vw,1.5rem)] border border-brand-accent-soft/30 hover:border-brand-accent-strong/40 hover:shadow-lg hover:shadow-brand-accent-strong/10 transition-all duration-300 hover:scale-[1.02]'

  const content = (
    <>
      <div className="mb-3">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="text-lg font-bold text-[#fbdaf9] mb-1">
              {autor.nombre ?? ''} {autor.apellido ?? ''}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 bg-brand-accent-soft/20 text-[#c392dd] text-xs font-medium rounded-full">
                {getRolLabel(autor.rol)}
              </span>
            </div>
          </div>
          {valoracion !== null && (
            <div className="flex-shrink-0">
              <StarRating valoracion={valoracion} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-[#c392dd]">
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            <span>{trabajo.tipoDeTrabajo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(trabajo.fechaFin)}</span>
          </div>
        </div>
      </div>

      <p className="text-[#fbdaf9] leading-relaxed line-clamp-3">
        {review}
      </p>
    </>
  )

  if (href) {
    return <Link href={href} className={cardClass}>{content}</Link>
  }

  return <div className={cardClass}>{content}</div>
}
