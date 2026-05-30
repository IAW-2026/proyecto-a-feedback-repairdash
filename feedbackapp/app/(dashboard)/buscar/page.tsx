import { prisma } from '@/lib/prisma'
import BuscarClient from './BuscarClient'

function generateMockData(nombre: string, apellido: string) {
  const seed = nombre.length + apellido.length
  return {
    promedioEstrellas: (seed % 3) + 3,
    reportesEnContra: seed % 8,
    trabajosInvolucrado: seed % 20 + 5,
  }
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const POR_PAGINA = 10

  const whereClause = search
    ? { nombre: { contains: search, mode: 'insensitive' as const } }
    : undefined

  const usuarios = await prisma.usuario.findMany({
    where: whereClause,
    skip: (page - 1) * POR_PAGINA,
    take: POR_PAGINA,
  })

  const total = await prisma.usuario.count({
    where: whereClause,
  })

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  const resultados = usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    ...generateMockData(u.nombre, u.apellido),
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
