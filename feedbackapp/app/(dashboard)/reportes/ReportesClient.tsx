'use client'

import { useRouter, usePathname } from 'next/navigation'
import { AlertTriangle, Calendar } from 'lucide-react'
import EstadoBadge from '@/components/EstadoBadge'
import DecisionBadge from '@/components/DecisionBadge'
import Link from 'next/link'
import Pagination from '@/components/Pagination'
import type { ReporteCardData } from '@/types'

interface ReportesClientProps {
  reportesEnviados: ReporteCardData[]
  reportesRecibidos: ReporteCardData[]
  pageEnviados: number
  pageRecibidos: number
  totalPaginasEnviados: number
  totalPaginasRecibidos: number
}

function ReporteCard({ reporte }: { reporte: ReporteCardData }) {
  return (
    <Link href={`/reportes/${reporte.id}`}>
      <div className="bg-[#3a1f52] rounded-lg p-[clamp(1rem,4vw,1.5rem)] border border-brand-accent-soft/30 hover:border-brand-accent-strong/40 hover:shadow-lg hover:shadow-brand-accent-strong/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(0.75rem,2vw,1rem)]">
          <div className="min-w-0">
            <h3 className="font-gilroy font-bold text-[#fbdaf9] break-words" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
              {reporte.nombreUsuario}
            </h3>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              {reporte.tipoDeTrabajo}
            </p>
          </div>
          <div className="flex gap-[clamp(0.5rem,1vw,0.75rem)] flex-wrap sm:flex-nowrap">
            <EstadoBadge estado={reporte.resolucion} />
            {reporte.resolucion === 'Resuelto' && reporte.decision && (
              <DecisionBadge favorable={reporte.soyReportante ? reporte.decision === 'AFavor' : reporte.decision === 'EnContra'} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
          <Calendar size={14} />
          <span>{reporte.fecha}</span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="bg-[#3a1f52]/50 rounded-lg p-[clamp(1.5rem,4vw,3rem)] border border-dashed border-brand-accent-soft/30 text-center">
      <AlertTriangle size={48} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-brand-accent-soft" />
      <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
        Sin reportes
      </h3>
      <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
        No hay reportes en &quot;{title}&quot; por el momento
      </p>
    </div>
  )
}

export default function ReportesClient({
  reportesEnviados,
  reportesRecibidos,
  pageEnviados,
  pageRecibidos,
  totalPaginasEnviados,
  totalPaginasRecibidos,
}: ReportesClientProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handlePageEnviados = (p: number) => {
    const params = new URLSearchParams()
    params.set('e', String(p))
    params.set('r', String(pageRecibidos))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageRecibidos = (p: number) => {
    const params = new URLSearchParams()
    params.set('e', String(pageEnviados))
    params.set('r', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(1rem,3vw,2rem)]">
          <div className="min-w-0">
            <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Reportes
            </p>
            <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              Mis Reportes
            </h1>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Seguimiento de reportes enviados y recibidos
            </p>
          </div>
        </div>
      </div>

      <section className="mb-[clamp(2rem,6vw,3rem)]">
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reportes enviados
        </h2>
        {reportesEnviados.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,2vw,1.75rem)]">
              {reportesEnviados.map((reporte) => (
                <ReporteCard key={reporte.id} reporte={reporte} />
              ))}
            </div>
            <Pagination page={pageEnviados} totalPaginas={totalPaginasEnviados} onPageChange={handlePageEnviados} />
          </>
        ) : (
          <EmptyState title="Reportes enviados" />
        )}
      </section>

      <section>
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reportes recibidos
        </h2>
        {reportesRecibidos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,2vw,1.75rem)]">
              {reportesRecibidos.map((reporte) => (
                <ReporteCard key={reporte.id} reporte={reporte} />
              ))}
            </div>
            <Pagination page={pageRecibidos} totalPaginas={totalPaginasRecibidos} onPageChange={handlePageRecibidos} />
          </>
        ) : (
          <EmptyState title="Reportes recibidos" />
        )}
      </section>
    </div>
  )
}
