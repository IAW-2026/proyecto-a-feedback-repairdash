//Se obtienen todas las reviews en las que participó el usuario loggeado.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function validarStringID(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar que id sea un string no vacío
    if (!validarStringID(id)) {
      return NextResponse.json(
        { error: 'El ID es inválido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener las reviews RECIBIDAS por el usuario
    // (reviews completadas escritas por otros en trabajos donde el usuario participó)
    const reviews = await prisma.review.findMany({
      where: {
        estaCompleta: true,
        trabajo: {
          OR: [{ idRider: id }, { idDriver: id }],
        },
        NOT: { idUsuario: id },
      },
      include: {
        autor: true,
        trabajo: true,
      },
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
