import Link from 'next/link'
import { Star, Bell, MessageSquare, AlertTriangle, Clock, Shield } from 'lucide-react'
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

  const isAdmin = user.rol === 'feedbackAdmin'

  if (isAdmin) {
    const [requierenResolucion, esperandoPruebas] = await Promise.all([
      prisma.reporte.count({
        where: { estado: 'PRUEBAS_AGREGADAS' },
      }),
      prisma.reporte.count({
        where: { estado: 'CREADO', resolucion: 'SinResolver' },
      }),
    ])

    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-[clamp(2rem,6vw,3rem)]">
          <h1
            className="font-gilroy font-bold text-[#fbdaf9]"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}
          >
            Panel de administración
          </h1>
          <p className="text-[#c392dd] mt-1" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            Bienvenido a Feedback
          </p>
        </div>

        {/* First row: 2 metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,3vw,2rem)] mb-[clamp(1rem,3vw,2rem)]">
          {/* Card: Requieren resolución */}
          <Link
            href="/admin/reportes?estado=PRUEBAS_AGREGADAS"
            className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block"
          >
            <div className="flex justify-between items-start mb-3">
              <p
                className="text-[#c392dd] font-semibold uppercase tracking-wider"
                style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
              >
                Requieren resolución
              </p>
              <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
                <AlertTriangle size={20} className="text-brand-accent-strong" />
              </div>
            </div>
            <div
              className="font-gilroy font-bold text-[#fbdaf9] text-center"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
            >
              {requierenResolucion}
            </div>
            <p
              className="text-[#c392dd] mt-1 text-center"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            >
              Reportes con pruebas agregadas listos para resolver.
            </p>
          </Link>

          {/* Card: Esperando pruebas */}
          <Link
            href="/admin/reportes?estado=CREADO"
            className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block"
          >
            <div className="flex justify-between items-start mb-3">
              <p
                className="text-[#c392dd] font-semibold uppercase tracking-wider"
                style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
              >
                Esperando pruebas
              </p>
              <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
                <Clock size={20} className="text-brand-accent-strong" />
              </div>
            </div>
            <div
              className="font-gilroy font-bold text-[#fbdaf9] text-center"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
            >
              {esperandoPruebas}
            </div>
            <p
              className="text-[#c392dd] mt-1 text-center"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            >
              Reportes creados esperando que se agreguen pruebas.
            </p>
          </Link>
        </div>

        {/* Second row: Acciones rápidas */}
        <div className="bg-[#3a1f52] rounded-xl border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block">
          <div className="flex justify-between items-start p-[clamp(1rem,3vw,1.5rem)] pb-0">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              Acciones rápidas
            </p>
            <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
              <Shield size={20} className="text-brand-accent-strong" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1rem,3vw,1rem)]">
            <Link
              href="/admin/reportes?estado=PRUEBAS_AGREGADAS"
              className="flex-1 px-4 py-3 bg-brand-accent-strong/10 border border-brand-accent-strong/30 rounded-lg text-center font-semibold text-[#fbdaf9] hover:bg-brand-accent-strong/20 hover:border-brand-accent-strong/60 transition-all duration-200"
            >
              Ver reportes pendientes →
            </Link>
            <Link
              href="/admin/reportes"
              className="flex-1 px-4 py-3 bg-[#3a1f52] border border-brand-accent-soft/30 rounded-lg text-center font-semibold text-[#c392dd] hover:text-[#fbdaf9] hover:border-brand-accent-strong/60 hover:bg-[#4a2a6a] transition-all duration-200"
            >
              Ver todos los reportes →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const [reportesReportado, reportesReportante] = await Promise.all([
    prisma.reporte.count({
      where: { idReportado: user.id, resolucion: 'SinResolver' },
    }),
    prisma.reporte.count({
      where: { idReportante: user.id, resolucion: 'SinResolver' },
    }),
  ])

  const reviewsPendientes = await prisma.review.count({
    where: {
      idUsuario: user.id,
      estaCompleta: false,
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
        <p className="text-[#c392dd] mt-1" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Bienvenido a Feedback
        </p>
      </div>

      {/* First row: 2 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,3vw,2rem)] mb-[clamp(1rem,3vw,2rem)]">
        {/* Card: Valoración promedio */}
        <Link
          href="/reviews"
          className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block"
        >
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              Valoración promedio
            </p>
            <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
              <Star size={20} className="text-brand-accent-strong" />
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
              {promedioCalificaciones}
            </div>
          )}
          <p
            className="text-[#c392dd] mt-1 text-center"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Promedio de tus reseñas.
          </p>
        </Link>

        {/* Card: Reviews pendientes */}
        <Link
          href="/reviews/pendientes"
          className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,3vw,1.5rem)] border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block"
        >
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[#c392dd] font-semibold uppercase tracking-wider"
              style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
            >
              Reviews pendientes
            </p>
            <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
              <MessageSquare size={20} className="text-brand-accent-strong" />
            </div>
          </div>
          <div
            className="font-gilroy font-bold text-[#fbdaf9] text-center"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}
          >
            {reviewsPendientes}
          </div>
          <p
            className="text-[#c392dd] mt-1 text-center"
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Reviews que tenés pendientes de completar.
          </p>
        </Link>
      </div>

      {/* Second row: full-width reports card */}
      <Link
        href="/reportes"
        className="bg-[#3a1f52] rounded-xl border border-brand-accent-soft/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20 block"
      >
        <div className="flex justify-between items-start p-[clamp(1rem,3vw,1.5rem)] pb-0">
          <p
            className="text-[#c392dd] font-semibold uppercase tracking-wider"
            style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}
          >
            Reportes en evaluación
          </p>
          <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
            <Bell size={20} className="text-brand-accent-strong" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row p-[clamp(1rem,3vw,1.5rem)] pt-[clamp(1rem,3vw,1rem)]">
          <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
            <div
              className="font-gilroy font-bold text-[#fbdaf9]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
            >
              {reportesReportado}
            </div>
            <p
              className="text-[#c392dd] mt-1 text-center"
              style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
            >
              Reportes activos donde fuiste denunciado
            </p>
          </div>
          <div className="hidden sm:block w-px bg-brand-accent-soft/20 mx-4 self-stretch" />
          <div className="block sm:hidden h-px bg-brand-accent-soft/20 my-4 mx-8" />
          <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
            <div
              className="font-gilroy font-bold text-[#fbdaf9]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
            >
              {reportesReportante}
            </div>
            <p
              className="text-[#c392dd] mt-1 text-center"
              style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
            >
              Reportes que abriste y están en evaluación
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
