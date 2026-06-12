import Link from 'next/link'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ArrowRight, Clock, User, Briefcase, Calendar, Inbox } from 'lucide-react'
import { formatDate } from '@/lib/dates'
import { getRolLabel } from '@/lib/roles'

export default async function ReviewsPendientesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const reviewsPendientes = await prisma.review.findMany({
    where: {
      idUsuario: user.id,
      estaCompleta: false,
    },
    include: {
      trabajo: {
        include: {
          rider: true,
          driver: true,
        },
      },
    },
  })

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[#c392dd] mb-2">
          REVIEWS PENDIENTES
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Reviews pendientes</h1>
        <p className="text-[#c392dd]">
          Reviews que tenés que completar sobre otros usuarios
        </p>
      </div>

      {reviewsPendientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox size={48} className="text-[#8d62a5] opacity-50 mb-4" />
          <p className="text-[#c392dd] text-lg">No tenés reviews pendientes</p>
          <p className="text-[#8d62a5] mt-2 text-sm">
            Todas tus reviews están completadas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsPendientes.map((review) => {
            const otroUsuario =
              review.trabajo.idRider === user.id
                ? review.trabajo.driver
                : review.trabajo.rider

            return (
              <div
                key={review.id}
                className="bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#8d62a5]/20 p-2 rounded-lg">
                        <User size={20} className="text-[#f500f1]" />
                      </div>
                      <div>
                        <p className="text-[#c392dd] text-xs uppercase tracking-wider">
                          Usuario a evaluar
                        </p>
                        <p className="text-[#fbdaf9] font-semibold">
                          {otroUsuario?.nombre} {otroUsuario?.apellido}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Briefcase size={18} className="text-[#8d62a5]" />
                      <span className="text-[#c392dd]">{review.trabajo.tipoDeTrabajo}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#8d62a5]" />
                      <span className="text-[#c392dd]">
                        {formatDate(review.trabajo.fechaFin)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/reviews/realizar/${review.idTrabajo}`}
                    className="flex items-center gap-2 bg-[#f500f1] text-[#1a0a2e] py-3 px-5 rounded-lg hover:scale-[1.02] transition-transform duration-300 shadow-lg font-semibold shrink-0"
                  >
                    Hacer review
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
