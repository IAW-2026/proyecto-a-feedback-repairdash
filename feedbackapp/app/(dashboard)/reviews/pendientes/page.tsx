import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PendientesClient from './PendientesClient'

const POR_PAGINA = 10

export default async function ReviewsPendientesPage(props: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await props.searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const where = {
    idUsuario: user.id,
    estaCompleta: false,
  }

  const [total, reviewsPendientes] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: {
        trabajo: {
          include: {
            rider: true,
            driver: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    }),
  ])

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  return (
    <PendientesClient
      userId={user.id}
      reviews={reviewsPendientes}
      total={total}
      page={page}
      totalPaginas={totalPaginas}
    />
  )
}
