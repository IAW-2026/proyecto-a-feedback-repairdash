import { redirect } from 'next/navigation';
import { User, Star, AlertCircle, Clock } from 'lucide-react';
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
  const [reportesEnMiContraActivos, reportesIniciadosPorMi, reportesFallados] = await Promise.all([
    prisma.reporte.count({
      where: { idReportado: user.id, resolucion: 'SinResolver' },
    }),
    prisma.reporte.count({
      where: { idReportante: user.id, resolucion: 'SinResolver' },
    }),
    prisma.reporte.count({
      where: { idReportado: user.id, decision: 'EnContra' },
    }),
  ]);

  // Obtener promedio de calificaciones del atributo del usuario
  const promedioCalificaciones = user.valoracion > 0 ? user.valoracion : null;

  return (
    <div className="w-full">
        {/* Header */}
        <div className="mb-[clamp(2rem,6vw,3rem)]">
          <p className="text-brand-accent-mid font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            Mi Perfil
          </p>
          <h1 className="font-gilroy font-bold text-brand-text-light mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
            InformaciÃ³n de cuenta
          </h1>
          <p className="text-brand-accent-mid" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            VisualizÃ¡ tus datos personales y estadÃ­sticas
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-[clamp(1rem,3vw,2rem)]">
          {/* ValoraciÃ³n Promedio */}
          <div className="bg-brand-card rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <Star size={24} className="text-brand-accent-mid flex-shrink-0" />
              <p className="text-brand-accent-mid font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                ValoraciÃ³n Promedio
              </p>
            </div>

            <div className="flex items-center justify-center">
              {promedioCalificaciones === null ? (
                <div className="text-brand-accent-mid" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  Sin calificaciones
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                  <StarRating valoracion={promedioCalificaciones} size={28} />
                  <span className="font-gilroy font-bold text-brand-text-light" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    {promedioCalificaciones} / 5
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Datos Personales */}
          <div className="bg-brand-card rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <User size={24} className="text-brand-accent-mid flex-shrink-0" />
              <p className="text-brand-accent-mid font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Datos Personales
              </p>
            </div>

            <div className="space-y-[clamp(1rem,3vw,1.5rem)]">
              <div>
                <p className="text-brand-accent-mid uppercase font-semibold mb-[clamp(0.25rem,0.5vw,0.375rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Nombre Completo
                </p>
                <p className="text-brand-text-light" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  {user.nombre} {user.apellido}
                </p>
              </div>

              <div>
                <p className="text-brand-accent-mid uppercase font-semibold mb-[clamp(0.25rem,0.5vw,0.375rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Email
                </p>
                <p className="text-brand-text-light" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  {user.mail}
                </p>
              </div>
            </div>
          </div>

          {/* Reportes */}
          <div className="bg-brand-card rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <AlertCircle size={24} className="text-brand-accent-mid flex-shrink-0" />
              <p className="text-brand-accent-mid font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Estado de Reportes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[clamp(1rem,3vw,1.5rem)]">
              <StatCard
                icon={<Clock size={20} className="text-brand-accent-mid flex-shrink-0" />}
                title="En mi contra activos"
                value={reportesEnMiContraActivos}
                description="reportes activos donde fuiste denunciado"
                variant="info"
              />
              <StatCard
                icon={<Clock size={20} className="text-brand-accent-mid flex-shrink-0" />}
                title="Iniciados por mÃ­"
                value={reportesIniciadosPorMi}
                description="reportes que abriste y estÃ¡n en evaluaciÃ³n"
                variant="info"
              />
              <StatCard
                icon={<AlertCircle size={20} className="flex-shrink-0" />}
                title="Fallados en mi contra"
                value={reportesFallados}
                description="reportes resueltos desfavorablemente"
                variant={reportesFallados > 0 ? 'danger' : 'info'}
              />
            </div>
          </div>
        </div>
      </div>
  );
}
