/*Origen: Rider app o driver app
Objetivo: Actualizar un reporte existente agregando pruebas (descripción y URL)
EndPoint: PUT feedback/api/reports/[id]
Request: { "descripcion": "El usuario no pagó", "url": "https://evidence.com/img.jpg", "tipo": "descripcion" }
Response 200 OK: { "message": "Prueba agregada al reporte", "idPrueba": "uuid", "idReporte": "uuid" }*/

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function validarStringID(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar que id sea un string no vacío
    if (!validarStringID(id)) {
      return NextResponse.json(
        { message: 'El ID del reporte no es válido' },
        { status: 400 }
      );
    }

    // Leer del body
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: 'El cuerpo de la solicitud no es un JSON válido' },
        { status: 400 }
      );
    }

    const { descripcion, url, tipo } = body;

    // Validar que existan todos los datos
    if (!validarStringID(descripcion) || !validarStringID(url) || !validarStringID(tipo)) {
      return NextResponse.json(
        { message: 'descripcion, url y tipo deben ser strings válidos' },
        { status: 400 }
      );
    }

    // Validar que la URL sea válida
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { message: 'La URL no es válida' },
        { status: 400 }
      );
    }

    // Verificar que el reporte existe
    const reporte = await prisma.reporte.findUnique({
      where: { id },
    });

    if (!reporte) {
      return NextResponse.json(
        { message: 'El reporte no existe' },
        { status: 404 }
      );
    }

    // Verificar que el reporte aún no está completo
    if (reporte.estado !== 'CREADO') {
      return NextResponse.json(
        { message: 'El reporte ya fue completado' },
        { status: 400 }
      );
    }

    // Crear la prueba
    const prueba = await prisma.pruebas.create({
      data: {
        idReporte: id,
        tipo,
        url,
      },
    });

    // Marcar el reporte como completo
    await prisma.reporte.update({
      where: { id },
      data: { estado: 'PRUEBAS_AGREGADAS' },
    });

    return NextResponse.json(
      {
        message: 'Prueba agregada al reporte',
        idPrueba: prueba.id,
        idReporte: reporte.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
