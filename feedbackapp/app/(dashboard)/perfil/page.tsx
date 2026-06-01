import { redirect } from 'next/navigation';
import { User, Mail, Lock, Star, Briefcase, AlertCircle, Clock } from 'lucide-react';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/StatCard';
import StarRating from '@/components/StarRating';

export default async function PerfilPage() {
  // Obtener usuario autenticado
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Realizar todas las consultas en paralelo
  const [totalTrabajos, reportesEnContra, reportesPendientes] = await Promise.all([
    prisma.trabajo.count({
      where: {
        OR: [{ idRider: user.id }, { idDriver: user.id }],
      },
    }),
    prisma.reporte.count({
      where: {
        OR: [
          { idReportante: user.id, decision: 'EnContra' },
          { idReportado: user.id, decision: 'AFavor' },
        ],
      },
    }),
    prisma.reporte.count({
      where: {
        resolucion: 'SinResolver',
        OR: [
          { idReportante: user.id },
          { idReportado: user.id },
        ],
      },
    }),
  ]);

  // Obtener promedio de calificaciones del atributo del usuario
  const promedioCalificaciones = user.valoracion > 0 ? user.valoracion : null;

  return (
    <div className="w-full">
        {/* Header */}
        <div className="mb-[clamp(2rem,6vw,3rem)]">
          <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            Mi Perfil
          </p>
          <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
            Información de cuenta
          </h1>
          <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            Visualizá tus datos personales y estadísticas
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-[clamp(1rem,3vw,2rem)]">
          {/* Card 1: Datos del usuario */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <User size={24} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Datos Personales
              </p>
            </div>

            <div className="space-y-[clamp(1rem,3vw,1.5rem)]">
              <div>
                <label htmlFor="nombre" className="block text-[#c392dd] uppercase font-semibold mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Nombre Completo
                </label>
                <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                  <input
                    id="nombre"
                    type="text"
                    value={`${user.nombre} ${user.apellido}`}
                    disabled
                    className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] cursor-not-allowed opacity-60 min-h-[44px]"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  />
                  <Lock size={20} className="text-[#8d62a5] flex-shrink-0" />
                </div>
                <p className="text-[#c392dd] mt-[clamp(0.375rem,1vw,0.5rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Campo no editable
                </p>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#c392dd] uppercase font-semibold mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Email
                </label>
                <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                  <input
                    id="email"
                    type="email"
                    value={user.mail}
                    disabled
                    className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] cursor-not-allowed opacity-60 min-h-[44px]"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  />
                  <Mail size={20} className="text-[#8d62a5] flex-shrink-0" />
                </div>
                <p className="text-[#c392dd] mt-[clamp(0.375rem,1vw,0.5rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Campo no editable
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Actividad Laboral */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <Briefcase size={24} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Actividad Laboral
              </p>
            </div>

            <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/30 text-center">
              <p className="text-[#c392dd] uppercase font-semibold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Trabajos en los que te viste involucrado
              </p>
              <div className="font-gilroy font-bold text-[#f500f1]" style={{ fontSize: 'clamp(2.5rem, 8vw, 3rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                {totalTrabajos}
              </div>
              <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                proyectos completados
              </p>
            </div>
          </div>

          {/* Card 3: Valoración Promedio */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <Star size={24} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Valoración Promedio
              </p>
            </div>

            <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/30">
              <p className="text-[#c392dd] uppercase font-semibold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Valoración promedio recibida
              </p>
              <div className="flex items-center justify-center">
                {promedioCalificaciones === null ? (
                  <div className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    Sin calificaciones
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                    <StarRating valoracion={promedioCalificaciones} size={20} />
                    <span className="font-gilroy font-bold text-[#fbdaf9]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                      {promedioCalificaciones} / 5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Reportes */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <AlertCircle size={24} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Estado de Reportes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,3vw,1.5rem)]">
              <StatCard
                icon={<AlertCircle size={20} className="text-red-400 flex-shrink-0" />}
                title="Fallados en tu contra"
                value={reportesEnContra}
                description="reportes resueltos desfavorablemente"
                variant="danger"
              />
              <StatCard
                icon={<Clock size={20} className="text-[#c392dd] flex-shrink-0" />}
                title="Reportes pendientes"
                value={reportesPendientes}
                description="en evaluación o realizados por ti"
                variant="info"
              />
            </div>
          </div>
        </div>
      </div>
  );
}
