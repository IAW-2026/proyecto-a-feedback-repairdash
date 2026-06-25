/*
GET feedback/api/reviews/user/:userID Request: nada, el ID ya viaja en la URL. 
Response 200 OK: { "idUsuario": "user_123", "nombre": "Juan", "apellido": "Pérez", "valoracion": 4.5 }*/
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAnyInternalApiKey } from "@/lib/auth";
export const dynamic = 'force-dynamic';

function validarStringID(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = validateAnyInternalApiKey(request, [
      process.env.FEEDBACK_API_KEY,
      process.env.DRIVER_INTERNAL_API_KEY,
      process.env.ANALYTICS_API_KEY,
    ]);
    if (authError) return authError;
    // Esperamos a que los parámetros estén listos
    const { id } = await params;

    // Validar que id sea un string no vacío
    if (!validarStringID(id)) {
      return NextResponse.json(
        { message: 'el ID es un ID no válido.' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        valoracion: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        idUsuario: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        valoracion: usuario.valoracion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener valoración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}