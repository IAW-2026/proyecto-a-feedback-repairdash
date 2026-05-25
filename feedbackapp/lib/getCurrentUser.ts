import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'


export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) {
  //  throw new Error('Usuario no autenticado')
  }
 /* const user = await prisma.usuario.findUnique({ where: { id: userId } })
  if (!user) {
    //throw new Error('Usuario no encontrado en la base de datos')
  }
  return user*/
}