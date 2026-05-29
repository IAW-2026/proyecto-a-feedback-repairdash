import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
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
  // - Mostrar SOLO reportes incompletos (estaCompleto == false)
  // - Si hay búsqueda, filtrar por nombre del reportante O reportado
  const whereClause = {
    estaCompleto: 'PRUEBAS_AGREGADAS', // Filtro principal: solo reportes incompletos
    
    // Si hay texto de búsqueda, filtrar por nombre del reportante o reportado
    ...(search
      ? {
          OR: [
            {
              reportante: {
                OR: [
                  { nombre: { contains: search, mode: 'insensitive' as const } },
                  { apellido: { contains: search, mode: 'insensitive' as const } },
                ],
              },
            },
            {
              reportado: {
                OR: [
                  { nombre: { contains: search, mode: 'insensitive' as const } },
                  { apellido: { contains: search, mode: 'insensitive' as const } },
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
  const reportes = await prisma.reporte.findMany({
    where: whereClause,
    include: {
      trabajo: true, // Incluir datos del trabajo para acceder a fechaFin
      reportante: true, // Incluir datos de quién hizo el reporte
      reportado: true, // Incluir datos de quién fue reportado
    },
    skip: (page - 1) * POR_PAGINA,
    take: POR_PAGINA,
    orderBy: {
      trabajo: { fechaFin: 'asc' }, // Ordenar de más viejo (asc) a más nuevo (desc)
    },
  })

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
