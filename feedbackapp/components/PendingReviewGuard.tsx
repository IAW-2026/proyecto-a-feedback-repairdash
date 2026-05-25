import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import PendingReviewScreen from './PendingReviewScreen';

export default async function PendingReviewGuard({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    const TEST_MODE = false; // Cambiá a true si querés probar sin depender de la DB

    if (TEST_MODE) {
      // Mock de un trabajo para testing visual
      const mockTrabajo = {
        id: "test-id",
        tipoDeTrabajo: "Reparación de Test",
        fechaFin: new Date(),
        idRider: "test-rider-id",
        idDriver: user.id, // Simulamos que somos el driver
        rider: {
          nombre: "Usuario",
          apellido: "de Prueba"
        },
        driver: {
          nombre: user.nombre,
          apellido: user.apellido
        }
      };

      return <PendingReviewScreen trabajo={mockTrabajo} userId={user.id} />;
    }

    // Buscar el último trabajo finalizado del usuario
    const trabajo = await prisma.trabajo.findFirst({
      where: {
        OR: [{ idRider: user.id }, { idDriver: user.id }],
        fechaFin: { not: null },
        activo: false,
      },
      orderBy: { fechaFin: 'desc' },
      include: {
        rider: true,
        driver: true,
      },
    });

    if (trabajo) {
      // Verificar si ya tiene review
      const reviewExistente = await prisma.review.findUnique({
        where: {
          idTrabajo_idUsuario: {
            idTrabajo: trabajo.id,
            idUsuario: user.id,
          },
        },
      });

      // Si NO hay review, interceptamos la pantalla y mostramos la de "Pendiente"
      if (!reviewExistente) {
        return <PendingReviewScreen trabajo={trabajo} userId={user.id} />;
      }
    }
  }

  // Si no hay pendientes (o no hay usuario logueado o ya hizo la review), mostramos el contenido original
  return <>{children}</>;
}