import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import PendingReportScreen from './PendingReportScreen';
import PendingReviewScreen from './PendingReviewScreen';

/**
 * Componente Guard centralizado que verifica tareas pendientes en orden de prioridad.
 *
 * Orden de verificación:
 * 1. PRIMERO: Reportes pendientes (reporte.idReportante === userId && estaCompleto === false)
 * 2. LUEGO: Reviews pendientes (review.idUsuario === userId && estaCompleta === false)
 *
 * Esto evita que ambas pantallas de bloqueo se muestren simultáneamente.
 * El usuario debe resolver primero el reporte, luego la review.
 */
export default async function PendingTasksGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    // ✅ PASO 1: Verificar si hay un REPORTE pendiente
    const reportePendiente = await prisma.reporte.findFirst({
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

    // Si hay un reporte pendiente, MOSTRAR REPORTE (tiene prioridad)
    if (reportePendiente) {
      return (
        <PendingReportScreen
          reporte={reportePendiente}
          trabajo={reportePendiente.trabajo}
          reportado={reportePendiente.reportado}
          userId={user.id}
        />
      );
    }

    // ✅ PASO 2: Verificar si hay una REVIEW pendiente
    // (Solo se ejecuta si NO hay reporte pendiente)
    const reviewPendiente = await prisma.review.findFirst({
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

    // Si hay una review pendiente, MOSTRAR REVIEW
    if (reviewPendiente) {
      return (
        <PendingReviewScreen trabajo={reviewPendiente.trabajo} userId={user.id} />
      );
    }
  }

  // Si no hay reportes NI reviews pendientes, mostrar contenido normal
  return <>{children}</>;
}
