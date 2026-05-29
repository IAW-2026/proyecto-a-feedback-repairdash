import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import PendingTasksGuardRenderer from './PendingTasksGuardRenderer';

/**
 * Componente Guard centralizado (Server Component).
 * Obtiene datos de BD sobre tareas pendientes y pasa a renderer client.
 *
 * Orden de verificación:
 * 1. PRIMERO: Reportes pendientes (reporte.idReportante === userId && estaCompleto === false)
 * 2. LUEGO: Reviews pendientes (review.idUsuario === userId && estaCompleta === false)
 *
 * El Cliente Component (PendingTasksGuardRenderer) decide si aplicar el bloqueo
 * basado en el pathname actual (permite bypass para rutas de resolución).
 */
export default async function PendingTasksGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  let reportePendiente = null;
  let reviewPendiente = null;

  if (user) {
    // ✅ PASO 1: Verificar si hay un REPORTE pendiente
    reportePendiente = await prisma.reporte.findFirst({
      where: {
        idReportante: user.id,
        estaCompleto: false,
      },
      include: {
        trabajo: {
          include: {
            rider: true,
            driver: true,
          },
        },
        reportado: true,
      },
    });

    // ✅ PASO 2: Verificar si hay una REVIEW pendiente
    // (Se ejecuta aunque haya reporte - el renderer decide quién tiene prioridad)
    if (!reportePendiente) {
      reviewPendiente = await prisma.review.findFirst({
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
      });
    }
  }

  // Pasar datos al componente renderer (client) que decide si bloquear
  return (
    <PendingTasksGuardRenderer
      reportePendiente={reportePendiente}
      reviewPendiente={reviewPendiente}
    >
      {children}
    </PendingTasksGuardRenderer>
  );
}
