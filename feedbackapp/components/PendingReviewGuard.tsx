import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import PendingReviewScreen from './PendingReviewScreen';

export default async function PendingReviewGuard({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    // Buscar directamente si existe una review pendiente del usuario
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

    // Si hay una review pendiente, mostrar la pantalla de aviso
    if (reviewPendiente) {
      return <PendingReviewScreen trabajo={reviewPendiente.trabajo} userId={user.id} />;
    }
  }

  // Si no hay pendientes (o no hay usuario logueado o ya completó la review), mostramos el contenido original
  return <>{children}</>;
}