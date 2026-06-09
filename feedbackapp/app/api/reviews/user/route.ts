/*Origen: Rider app o workep app Objetivo: Una vez finalizado un trabajo, por la confirmación de ambos usuarios. Se debe permitir realizar una review de 
cada usuario hacia el otro, por lo que se debe llamar a feedback app. 
EndPoint: POST feedback/api/reviews/user 
Request: { "idTrabajo": "trabajo-001" } 
Response 201 Created: { "message": "Reviews creadas y trabajo finalizado", "reviews": [{ "idUsuario": "user_123" }, { "idUsuario": "user_456" }] }*/
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAnyInternalApiKey } from "@/lib/auth";
export const dynamic = 'force-dynamic';

function validarStringID(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function nombreCompleto(usuario: { nombre: string; apellido: string }) {
  return `${usuario.nombre} ${usuario.apellido}`;
}

export async function POST(request: Request) {
  //Si no se envía un JSON. Catch() vuelve nulo a body
  const authError = validateAnyInternalApiKey(request, [
      process.env.FEEDBACK_API_KEY,
      process.env.DRIVER_INTERNAL_API_KEY,
    ]);
    if (authError) return authError;
    
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { message: 'El cuerpo de la solicitud no es un JSON válido' },
      { status: 400 }
    );
  }

  const { idTrabajo } = body;

  if (!validarStringID(idTrabajo)) {
    return NextResponse.json(
      { message: 'El idTrabajo no es un ID válido' },
      { status: 400 }
    );
  }

  // Verificar que el trabajo existe
  const trabajo = await prisma.trabajo.findUnique({
    where: { id: idTrabajo },
    include: {
      rider: true,
      driver: true,
    },
  });

  if (!trabajo) {
    return NextResponse.json(
      { message: 'Trabajo no encontrado' },
      { status: 404 }
    );
  }

  // Verificar que el trabajo está activo o que existe un reporte
  if (!trabajo.activo) {
    const reporteActivo = await prisma.reporte.findFirst({
      where: { idTrabajo },
      select: { id: true },
    });

    if (!reporteActivo) {
      return NextResponse.json(
        { error: 'El trabajo ya fue finalizado' },
        { status: 400 }
      );
    }
  }

  // Verificar que no existen reviews para este trabajo
  const reviewsExistentes = await prisma.review.findMany({
    where: { idTrabajo },
  });

  if (reviewsExistentes.length > 0) {
    return NextResponse.json(
      { error: 'Ya existen reviews para este trabajo' },
      { status: 409 }
    );
  }

  // Crear DOS reviews vacías y desactivar el trabajo en una transacción
  const [reviewRider, reviewDriver] = await prisma.$transaction([
    prisma.review.create({
      data: {
        idTrabajo,
        idUsuario: trabajo.idRider,
      },
    }),
    prisma.review.create({
      data: {
        idTrabajo,
        idUsuario: trabajo.idDriver,
      },
    }),
    prisma.trabajo.update({
      where: { id: idTrabajo },
      data: { activo: false, fechaFin: new Date() },
    }),
  ]);

  return NextResponse.json(
    {
      message: 'Reviews creadas y trabajo finalizado',
      reviews: [
        { idUsuario: reviewRider.idUsuario },
        { idUsuario: reviewDriver.idUsuario },
      ],
    },
    { status: 201 }
  );
}