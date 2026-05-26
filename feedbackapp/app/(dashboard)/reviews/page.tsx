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

  // Construir el where clause
  const whereClause = {
    idUsuario: user.id,
    review: { not: null },
    trabajo: {
      OR: [
        { tipoDeTrabajo: { contains: search, mode: 'insensitive' as const } }
      ]
    }
  }

  // Obtener reviews paginadas
  const reviews = await prisma.review.findMany({
    where: whereClause,
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

  // Obtener el total de reviews
  const total = await prisma.review.count({
    where: whereClause
  })

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  // Calcular promedio de todas las reviews (sin paginación)
  const todasLasReviews = await prisma.review.findMany({
    where: {
      idUsuario: user.id,
      valoracion: { not: null }
    },
    select: { valoracion: true }
  })

  const promedio = todasLasReviews.length > 0
    ? (todasLasReviews.reduce((acc, r) => acc + r.valoracion!, 0) / todasLasReviews.length).toFixed(1)
    : null

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
