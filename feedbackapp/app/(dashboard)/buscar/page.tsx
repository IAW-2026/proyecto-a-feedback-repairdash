import { prisma } from '@/lib/prisma'
import BuscarClient from './BuscarClient'

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const POR_PAGINA = 5

  if (!search) {
    return (
      <BuscarClient
        usuarios={[]}
        page={1}
        totalPaginas={0}
        search=""
        total={0}
      />
    )
  }

  const where = search
    ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' as const } },
          { apellido: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : undefined

  const [usuarios, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      orderBy: { valoracion: 'desc' },
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        _count: {
          select: {
            trabajosComoRider: true,
            trabajosComoDriver: true,
          },
        },
      },
    }),
    prisma.usuario.count({ where }),
  ])

  const reportesEnContra = await prisma.reporte.groupBy({
    by: ['idReportado'],
    where: { decision: 'EnContra' },
    _count: true,
  })
  const reportesEnContraMap = new Map(
    reportesEnContra.map((r) => [r.idReportado, r._count])
  )

  const totalPaginas = Math.ceil(total / POR_PAGINA)
  const resultados = usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    promedioEstrellas: u.valoracion,
    reportesEnContra: reportesEnContraMap.get(u.id) ?? 0,
    trabajosInvolucrado: u._count.trabajosComoRider + u._count.trabajosComoDriver,
  }))

  return (
    <BuscarClient
      usuarios={resultados}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
    />
  )
}
