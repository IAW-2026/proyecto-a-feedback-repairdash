/*Origen: Rider app o driver app
Objetivo: Actualizar un reporte existente agregando pruebas (descripción y URL)
EndPoint: PUT feedback/api/reports/[id]
Request: { "descripcion": "El usuario no pagó", "url": "https://evidence.com/img.jpg", "tipo": "descripcion" }
Response 200 OK: { "message": "Prueba agregada al reporte", "idPrueba": "uuid", "idReporte": "uuid" }*/

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reportEvidenceArraySchema } from '@/lib/validation/reportEvidence';
import { validateInternalApiKey } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

    const { id } = await params;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
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

    // Validar con Zod
    const result = reportEvidenceArraySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { descripcion, pruebas } = result.data;

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

    // Crear todas las pruebas y actualizar el reporte en una sola query
    const reporteActualizado = await prisma.reporte.update({
      where: { id },
      data: {
        estado: 'PRUEBAS_AGREGADAS',
        ...(!reporte.descripcion ? { descripcion } : {}),
        pruebas: {
          createMany: { data: pruebas },
        },
      },
      include: {
        pruebas: {
          orderBy: { id: 'desc' },
          take: pruebas.length,
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Pruebas agregadas al reporte',
        pruebas: reporteActualizado.pruebas.map((p) => ({ id: p.id, url: p.url, tipo: p.tipo })),
        idReporte: reporteActualizado.id,
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
