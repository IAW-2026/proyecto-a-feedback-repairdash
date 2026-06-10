import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UserDetailClient from './UserDetailClient'

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1')
  const POR_PAGINA = 10

  const usuario = await prisma.usuario.findUnique({ where: { id } })
  if (!usuario) notFound()

  const whereReviews = {
    estaCompleta: true,
    valoracion: { not: null },
    trabajo: {
      OR: [
        { idRider: id },
        { idDriver: id },
      ],
    },
    NOT: { idUsuario: id },
  }

  const [reportesEnContra, reviews, totalReviews] = await Promise.all([
    prisma.reporte.count({
      where: { idReportado: id, decision: 'EnContra' },
    }),
    prisma.review.findMany({
      where: whereReviews,
      include: {
        autor: { select: { id: true, nombre: true, apellido: true, rol: true } },
        trabajo: { select: { id: true, tipoDeTrabajo: true, fechaFin: true } },
      },
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.review.count({ where: whereReviews }),
  ])

  const totalPaginas = Math.ceil(totalReviews / POR_PAGINA)
  const promedio = usuario.valoracion > 0 ? usuario.valoracion : null

  const reviewsData = reviews.map((r) => ({
    id: r.id,
    valoracion: r.valoracion,
    review: r.review,
    autor: {
      id: r.autor.id,
      nombre: r.autor.nombre,
      apellido: r.autor.apellido,
      rol: r.autor.rol,
    },
    trabajo: {
      id: r.trabajo.id,
      tipoDeTrabajo: r.trabajo.tipoDeTrabajo,
      fechaFin: r.trabajo.fechaFin,
    },
  }))

  return (
    <UserDetailClient
      usuario={{
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      }}
      promedio={promedio}
      reportesEnContra={reportesEnContra}
      reviews={reviewsData}
      page={page}
      totalPaginas={totalPaginas}
    />
  )
}
