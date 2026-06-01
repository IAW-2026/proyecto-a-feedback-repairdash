import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import AdminReportesClient from './AdminReportesClient'

export default async function AdminReportesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; estado?: string }
}) {
  // ============================================
  // 1. AUTENTICACIÓN
  // ============================================
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  // ============================================
  // 2. PARÁMETROS
  // ============================================
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const estado = params.estado ?? ''
  const POR_PAGINA = 10

  // ============================================
  // 3. WHERE CLAUSE
  // ============================================
  const whereClause: Prisma.ReporteWhereInput = {}

  if (estado && ['CREADO', 'PRUEBAS_AGREGADAS', 'RESUELTO'].includes(estado)) {
    whereClause.estado = estado as 'CREADO' | 'PRUEBAS_AGREGADAS' | 'RESUELTO'
  }

  if (search) {
    whereClause.OR = [
      { reportante: { OR: [{ nombre: { contains: search, mode: 'insensitive' as const } }, { apellido: { contains: search, mode: 'insensitive' as const } }] } },
      { reportado: { OR: [{ nombre: { contains: search, mode: 'insensitive' as const } }, { apellido: { contains: search, mode: 'insensitive' as const } }] } },
    ]
  }

  // ============================================
  // 4. OBTENER TODOS LOS IDs ORDENADOS POR PRIORIDAD + FECHA
  // ============================================
  // Prioridad: PRUEBAS_AGREGADAS (0) > CREADO (1) > RESUELTO (2)
  const todosLosIds = await prisma.reporte.findMany({
    where: whereClause,
    select: { id: true, estado: true, trabajo: { select: { fechaFin: true } } },
    orderBy: { trabajo: { fechaFin: 'asc' } },
  })

  const priority: Record<string, number> = {
    PRUEBAS_AGREGADAS: 0,
    CREADO: 1,
    RESUELTO: 2,
  }

  todosLosIds.sort((a, b) => {
    const pA = priority[a.estado] ?? 99
    const pB = priority[b.estado] ?? 99
    return pA - pB
  })

  const skip = (page - 1) * POR_PAGINA
  const paginatedIds = todosLosIds.slice(skip, skip + POR_PAGINA).map(r => r.id)
  const total = todosLosIds.length
  const totalPaginas = Math.ceil(total / POR_PAGINA)

  // ============================================
  // 5. OBTENER DATOS COMPLETOS DE LOS IDs PAGINADOS
  // ============================================
  const reportesRaw = paginatedIds.length > 0
    ? await prisma.reporte.findMany({
        where: { id: { in: paginatedIds } },
        include: { trabajo: true, reportante: true, reportado: true },
      })
    : []

  // Reordenar para que coincida con el orden de paginatedIds
  const idOrder = new Map(paginatedIds.map((id, i) => [id, i]))
  reportesRaw.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0))

  const reportes = reportesRaw.map(r => ({
    ...r,
    resolucion: r.resolucion as string,
    decision: r.decision as string | null,
    estado: r.estado as string,
  }))

  const totalPendientes = todosLosIds.filter(r => r.estado !== 'RESUELTO').length

  // ============================================
  // 6. PASAR DATOS AL CLIENTE
  // ============================================
  return (
    <AdminReportesClient
      reportes={reportes}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
      totalPendientes={totalPendientes}
      estado={estado}
    />
  )
}
