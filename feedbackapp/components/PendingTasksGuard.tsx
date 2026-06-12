import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import PendingTasksGuardRenderer from './PendingTasksGuardRenderer';

export default async function PendingTasksGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  let reportePendiente = null;
  let reviewPendientes: any[] = [];

  if (user) {
    reportePendiente = await prisma.reporte.findFirst({
      where: {
        idReportante: user.id,
        estado: 'CREADO',
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

    if (!reportePendiente) {
      reviewPendientes = await prisma.review.findMany({
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

  return (
    <PendingTasksGuardRenderer
      reportePendiente={reportePendiente}
      reviewPendientes={reviewPendientes}
    >
      {children}
    </PendingTasksGuardRenderer>
  );
}
