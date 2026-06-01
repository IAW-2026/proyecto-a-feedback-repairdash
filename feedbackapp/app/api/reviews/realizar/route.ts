//Se completa una review que el usuario tenia pendiente
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { reviewFormSchema } from '@/lib/validation/reviewForm';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    // Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Leer del body
    const body = await request.json();

    // Validar con Zod
    const result = reviewFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { reviewId, valoracion, review } = result.data;

    // Obtener la review para verificaciones
    const reviewRecord = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    // Verificar que existe
    if (!reviewRecord) {
      return NextResponse.json(
        { error: 'Review no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que pertenece al usuario logueado
    if (reviewRecord.idUsuario !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Verificar que no está ya completada
    if (reviewRecord.estaCompleta === true) {
      return NextResponse.json(
        { error: 'Esta review ya fue completada' },
        { status: 400 }
      );
    }

    // Actualizar la review
    const reviewActualizada = await prisma.review.update({
      where: { id: reviewId },
      data: {
        valoracion,
        review,
        estaCompleta: true,
      },
    });

    // PASO 1: Obtener el trabajo para saber quién es el evaluado
    const trabajo = await prisma.trabajo.findUnique({
      where: { id: reviewActualizada.idTrabajo },
    });

    if (trabajo) {
      // PASO 2: Determinar el id del usuario evaluado
      // El usuario evaluado es el OTRO participante del trabajo (no quien escribió la review)
      const idEvaluado =
        trabajo.idRider === userId ? trabajo.idDriver : trabajo.idRider;

      // PASO 3 y 4: Obtener todas las reviews recibidas por el evaluado y calcular el promedio
      const reviewsRecibidas = await prisma.review.findMany({
        where: {
          estaCompleta: true,
          valoracion: { gte: 1 },
          trabajo: {
            OR: [
              { idRider: idEvaluado },
              { idDriver: idEvaluado },
            ],
          },
          NOT: { idUsuario: idEvaluado },
        },
        select: { valoracion: true },
      });

      // PASO 5: Calcular el nuevo promedio
      const nuevoPromedio =
        reviewsRecibidas.length > 0
          ? parseFloat(
            (
              reviewsRecibidas.reduce((acc, r) => acc + r.valoracion!, 0) /
              reviewsRecibidas.length
            ).toFixed(1)
          )
          : 0;

      // PASO 6: Actualizar valoracion del usuario evaluado
      await prisma.usuario.update({
        where: { id: idEvaluado },
        data: { valoracion: nuevoPromedio },
      });
    }

    return NextResponse.json(
      { ok: true, review: reviewActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar review:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
