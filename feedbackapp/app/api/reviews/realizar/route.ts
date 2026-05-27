import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
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
    const { reviewId, valoracion, review } = body;

    // Validar que existan todos los datos
    if (!reviewId || valoracion === undefined || review === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos' },
        { status: 400 }
      );
    }

    // Validar valoracion
    if (
      typeof valoracion !== 'number' ||
      valoracion < 1 ||
      valoracion > 5
    ) {
      return NextResponse.json(
        { error: 'Valoración inválida' },
        { status: 400 }
      );
    }

    // Validar review
    if (typeof review !== 'string' || review.length > 1000) {
      return NextResponse.json(
        { error: 'La review no puede superar los 1000 caracteres' },
        { status: 400 }
      );
    }

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
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        valoracion,
        review,
        estaCompleta: true,
      },
    });

    return NextResponse.json(
      { ok: true, review: updatedReview },
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
