import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import NuevoReporteForm from './NuevoReporteForm';

export default async function NuevoReportePage() {
  const usuario = await getCurrentUser();

  if (!usuario) {
    redirect('/login');
  }

  // Obtener trabajos donde el usuario participó (como rider o driver) y que no estén activos
  const trabajos = await prisma.trabajo.findMany({
    where: {
      OR: [
        { idRider: usuario.id },
        { idDriver: usuario.id },
      ],
      activo: false,
      reporte: null, // No debe tener reporte existente
    },
    include: {
      rider: true,
      driver: true,
    },
    orderBy: {
      fechaFin: 'desc',
    },
  });

  // Transformar trabajos para el componente cliente
  const trabajosFormato = trabajos.map((trabajo) => {
    const esRider = trabajo.idRider === usuario.id;
    const otroUsuario = esRider ? trabajo.driver : trabajo.rider;

    return {
      id: trabajo.id,
      display: `${trabajo.tipoDeTrabajo} con ${otroUsuario.nombre} ${otroUsuario.apellido} - ${trabajo.fechaFin?.toLocaleDateString('es-AR') || 'Sin fecha'}`,
      tipo: trabajo.tipoDeTrabajo,
      nombreOtro: `${otroUsuario.nombre} ${otroUsuario.apellido}`,
      fecha: trabajo.fechaFin?.toLocaleDateString('es-AR') || 'Sin fecha',
    };
  });

  return (
    <div className="p-[clamp(1rem,4vw,2rem)] max-w-full md:max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-[clamp(1.5rem,4vw,2rem)]">
        <div>
          <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            Nuevo Reporte
          </p>
          <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
            Crear reporte
          </h1>
          <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            Completá los datos del incidente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <NuevoReporteForm trabajos={trabajosFormato} />
    </div>
  );
}
