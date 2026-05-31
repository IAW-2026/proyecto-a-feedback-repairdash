import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import UserDetailClient from './UserDetailClient'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const usuario = await prisma.usuario.findUnique({ where: { id } })
  if (!usuario) notFound()

  const [reportesEnContra, reviews] = await Promise.all([
    prisma.reporte.count({
      where: { idReportado: id, decision: 'EnContra' },
    }),
    prisma.review.findMany({
      where: { idUsuario: id, estaCompleta: true },
      include: {
        autor: { select: { id: true, nombre: true, apellido: true, rol: true } },
        trabajo: { select: { id: true, tipoDeTrabajo: true, fechaFin: true } },
      },
    }),
  ])

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
    />
  )
}
