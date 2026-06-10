import { Star, Bell } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const clerkUser = await currentUser()
  const firstName = clerkUser?.firstName ?? ''

  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const reportesPendientes = await prisma.reporte.count({
    where: {
      resolucion: 'SinResolver',
      OR: [
        { idReportante: user.id },
        { idReportado: user.id },
      ],
    },
  })

  const promedioCalificaciones = user.valoracion > 0 ? user.valoracion : null

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <h1
          className="font-gilroy font-bold text-[#fbdaf9]"
          style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}
        >
          Hola, {firstName}
        </h1>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[clamp(1rem,3vw,2rem)]">
        {/* Card: Valoración promedio */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-[#f500f1]/60 hover:shadow-xl hover:shadow-[#f500f1]/20">
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              VALORACIÓN PROMEDIO
            </p>
            <div className="bg-[#f500f1]/10 p-2 rounded-lg">
              <Star size={20} className="text-[#f500f1]" />
            </div>
          </div>
          {promedioCalificaciones === null ? (
            <p
              className="text-[#c392dd] text-center"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Sin calificaciones
            </p>
          ) : (
            <div
              className="font-gilroy font-bold text-[#fbdaf9] text-center"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
            >
              ⭐ {promedioCalificaciones}
            </div>
          )}
          <p
            className="text-[#c392dd] mt-1 text-center"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Promedio de tus reseñas.
          </p>
        </div>

        {/* Card: Reportes pendientes */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-[#f500f1]/60 hover:shadow-xl hover:shadow-[#f500f1]/20">
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              REPORTES EN EVALUACIÓN
            </p>
            <div className="bg-[#f500f1]/10 p-2 rounded-lg">
              <Bell size={20} className="text-[#f500f1]" />
            </div>
          </div>
          <div
            className="font-gilroy font-bold text-[#fbdaf9] text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
          >
            {reportesPendientes}
          </div>
          <p
            className="text-[#c392dd] mt-1 text-center"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Reportes que involucran tu cuenta.
          </p>
        </div>

        {/* Card placeholder */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/20 opacity-50 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#8d62a5]/40 hover:shadow-xl hover:shadow-[#8d62a5]/10">
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              PRÓXIMA MÉTRICA
            </p>
            <div className="bg-[#8d62a5]/10 p-2 rounded-lg">
              <span className="text-[#8d62a5] text-lg font-bold">?</span>
            </div>
          </div>
          <div
            className="font-gilroy font-bold text-[#8d62a5] text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
          >
            --
          </div>
          <p
            className="text-[#c392dd] mt-1 text-center"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            {/* TODO: agregar métrica adicional aquí */}
            Más estadísticas próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
