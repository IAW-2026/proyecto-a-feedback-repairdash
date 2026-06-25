import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import  RealizarReviewForm  from './RealizarReviewForm';

export default async function RealizarReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // El [id] es el idTrabajo
  const { id } = await params;
  const idTrabajo = id;

  // Obtener usuario autenticado
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Buscar la review pendiente por idTrabajo e idUsuario
  const reviewPendiente = await prisma.review.findUnique({
    where: {
      idTrabajo_idUsuario: {
        idTrabajo: idTrabajo,
        idUsuario: user.id,
      },
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

  // Si no existe la review, redirigir
  if (!reviewPendiente) {
    redirect('/');
  }

  // Si ya está completa, redirigir
  if (reviewPendiente.estaCompleta) {
    redirect('/');
  }

  // Determinar a quién evaluar según el rol del usuario
  let usuarioAEvaluar;
  if (user.rol === 'rider') {
    usuarioAEvaluar = reviewPendiente.trabajo.driver;
  } else if (user.rol === 'driver') {
    usuarioAEvaluar = reviewPendiente.trabajo.rider;
  } else {
    // Si es admin o rol desconocido, redirigir
    redirect('/');
  }

  return (
    <RealizarReviewForm
      reviewId={reviewPendiente.id}
      trabajo={reviewPendiente.trabajo}
      usuarioAEvaluar={usuarioAEvaluar}
    />
  );
}

