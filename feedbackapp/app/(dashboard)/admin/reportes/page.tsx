import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import { Prisma, EstadoReporte } from '@/generated/prisma/client'
import AdminReportesClient from './AdminReportesClient'

export default async function AdminReportesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  // ============================================
  // 1. AUTENTICACIÓN: Verificar que el usuario es admin
  // ============================================
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  // NOTA: La validación del rol admin ya se hace en proxy.ts
  // Si llegas aquí significa que ya pasaste ese control

  // ============================================
  // 2. PARÁMETROS: Obtener page y search de los query params
  // ============================================
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const POR_PAGINA = 10

  // ============================================
  // 3. CONSTRUCCIÓN DEL WHERE CLAUSE
  // ============================================
  // Filtros:
  // - Mostrar SOLO reportes pendientes de revisión admin (estado == PRUEBAS_AGREGADAS)
  // - Si hay búsqueda, filtrar por nombre del reportante O reportado
  const whereClause: Prisma.ReporteWhereInput = {
    estado: EstadoReporte.PRUEBAS_AGREGADAS,
    
    ...(search
      ? {
          OR: [
            {
              reportante: {
                OR: [
                  { nombre: { contains: search, mode: 'insensitive' } },
                  { apellido: { contains: search, mode: 'insensitive' } },
                ],
              },
            },
            {
              reportado: {
                OR: [
                  { nombre: { contains: search, mode: 'insensitive' } },
                  { apellido: { contains: search, mode: 'insensitive' } },
                ],
              },
            },
          ],
        }
      : {}),
  }

  // ============================================
  // 4. OBTENER REPORTES PAGINADOS Y ORDENADOS
  // ============================================
  // Ordenamiento: de más viejo a más nuevo (por fechaFin del trabajo)
  const reportesRaw = await prisma.reporte.findMany({
    where: whereClause,
    include: {
      trabajo: true,
      reportante: true,
      reportado: true,
    },
    skip: (page - 1) * POR_PAGINA,
    take: POR_PAGINA,
    orderBy: {
      trabajo: { fechaFin: 'asc' },
    },
  })

  const reportes = reportesRaw.map(r => ({
    ...r,
    resolucion: r.resolucion as string,
    decision: r.decision as string | null,
    estado: r.estado as string,
  }))

  // ============================================
  // 5. CONTAR TOTAL DE REPORTES PARA PAGINACIÓN
  // ============================================
  const total = await prisma.reporte.count({
    where: whereClause,
  })

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  // ============================================
  // 6. PASAR DATOS AL COMPONENTE CLIENTE
  // ============================================
  return (
    <AdminReportesClient
      reportes={reportes}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
    />
  )
}
