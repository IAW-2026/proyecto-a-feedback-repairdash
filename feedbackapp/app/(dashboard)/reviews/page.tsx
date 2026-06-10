import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import ReviewsClient from './ReviewsClient'

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Usuario no autenticado')
  }
  // Parámetros de paginación y búsqueda
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const POR_PAGINA = 10

  // Where clause base para reviews recibidas (sin filtro de búsqueda)
  const baseWhereClause = {
    estaCompleta: true,
    valoracion: { not: null },
    trabajo: {
      OR: [
        { idRider: user.id },
        { idDriver: user.id }
      ],
    },
    NOT: { idUsuario: user.id }  // Reviews escritas por otros, no por mí
  }

  // Where clause con filtro de búsqueda
  const searchWhereClause = search
    ? {
        AND: [
          baseWhereClause,
          {
            OR: [
              { autor: { nombre: { contains: search, mode: 'insensitive' as const } } },
              { autor: { apellido: { contains: search, mode: 'insensitive' as const } } },
              { trabajo: { tipoDeTrabajo: { contains: search, mode: 'insensitive' as const } } },
            ],
          },
        ],
      }
    : baseWhereClause

  // Obtener reviews paginadas
  const reviews = await prisma.review.findMany({
    where: searchWhereClause,
    include: {
      autor: true,
      trabajo: true,
    },
    skip: (page - 1) * POR_PAGINA,
    take: POR_PAGINA,
    orderBy: {
      trabajo: { fechaFin: 'desc' }
    }
  })

  // Obtener el total de reviews (con filtro de búsqueda)
  const total = await prisma.review.count({
    where: searchWhereClause
  })

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  // Obtener promedio del atributo del usuario
  const promedio = user.valoracion > 0 ? user.valoracion.toString() : null

  return (
    <ReviewsClient
      reviews={reviews}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
      promedio={promedio}
    />
  )
}
