import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import AdminUsersClient from './AdminUsersClient'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; rol?: string }
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const rolFilter = params.rol ?? ''
  const POR_PAGINA = 5

  const where: Prisma.UsuarioWhereInput = {}

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: 'insensitive' as const } },
      { apellido: { contains: search, mode: 'insensitive' as const } },
    ]
  }

  if (['rider', 'driver', 'feedbackAdmin'].includes(rolFilter)) {
    where.rol = rolFilter as 'rider' | 'driver' | 'feedbackAdmin'
  }

  const [usuarios, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      skip: (page - 1) * POR_PAGINA,
      take: POR_PAGINA,
      orderBy: { valoracion: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        mail: true,
        rol: true,
        valoracion: true,
        activo: true,
      },
    }),
    prisma.usuario.count({ where }),
  ])

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  return (
    <AdminUsersClient
      usuarios={usuarios.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        mail: u.mail,
        rol: u.rol,
        valoracion: u.valoracion,
        activo: u.activo,
      }))}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
      rolFilter={rolFilter}
    />
  )
}
