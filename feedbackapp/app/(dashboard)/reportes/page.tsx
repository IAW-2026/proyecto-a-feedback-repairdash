import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import ReportesClient from './ReportesClient'

const POR_PAGINA = 6

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: { e?: string; r?: string }
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  const params = await searchParams
  const pageEnviados = parseInt(params.e ?? '1')
  const pageRecibidos = parseInt(params.r ?? '1')

  const [
    totalEnviados,
    totalRecibidos,
    enviados,
    recibidos,
  ] = await Promise.all([
    prisma.reporte.count({ where: { idReportante: user.id } }),
    prisma.reporte.count({ where: { idReportado: user.id } }),
    prisma.reporte.findMany({
      where: { idReportante: user.id },
      include: { trabajo: true, reportado: true },
      orderBy: { trabajo: { fechaFin: 'desc' } },
      skip: (pageEnviados - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.reporte.findMany({
      where: { idReportado: user.id },
      include: { trabajo: true, reportante: true },
      orderBy: { trabajo: { fechaFin: 'desc' } },
      skip: (pageRecibidos - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
  ])

  const reportesEnviados = enviados.map(r => ({
    id: r.id,
    nombreUsuario: `${r.reportado.nombre} ${r.reportado.apellido}`,
    tipoDeTrabajo: r.trabajo.tipoDeTrabajo,
    fecha: r.trabajo.fechaFin?.toLocaleDateString('es-ES') ?? r.trabajo.fechaInicio.toLocaleDateString('es-ES'),
    resolucion: r.resolucion as 'SinResolver' | 'Resuelto',
    decision: r.decision as 'AFavor' | 'EnContra' | null,
    soyReportante: true,
  }))

  const reportesRecibidos = recibidos.map(r => ({
    id: r.id,
    nombreUsuario: `${r.reportante.nombre} ${r.reportante.apellido}`,
    tipoDeTrabajo: r.trabajo.tipoDeTrabajo,
    fecha: r.trabajo.fechaFin?.toLocaleDateString('es-ES') ?? r.trabajo.fechaInicio.toLocaleDateString('es-ES'),
    resolucion: r.resolucion as 'SinResolver' | 'Resuelto',
    decision: r.decision as 'AFavor' | 'EnContra' | null,
    soyReportante: false,
  }))

  return (
    <ReportesClient
      reportesEnviados={reportesEnviados}
      reportesRecibidos={reportesRecibidos}
      pageEnviados={pageEnviados}
      pageRecibidos={pageRecibidos}
      totalPaginasEnviados={Math.ceil(totalEnviados / POR_PAGINA)}
      totalPaginasRecibidos={Math.ceil(totalRecibidos / POR_PAGINA)}
    />
  )
}
