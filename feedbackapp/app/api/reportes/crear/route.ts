import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Leer body
    const body = await request.json();
    const { idTrabajo, descripcion, pruebas } = body;

    // Validar que existan los campos requeridos
    if (!idTrabajo || !descripcion) {
      return NextResponse.json(
        { error: 'idTrabajo y descripcion son requeridos' },
        { status: 400 }
      );
    }

    // Validar tamaño de pruebas
    const MAX_IMAGEN = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO = 35 * 1024 * 1024; // 35MB

    for (const prueba of pruebas || []) {
      if (prueba.tipo === 'video' && prueba.tamaño > MAX_VIDEO) {
        return NextResponse.json(
          { error: 'Un video supera los 35MB' },
          { status: 400 }
        );
      }

      if ((prueba.tipo === 'imagen' || prueba.tipo === 'pdf') && prueba.tamaño > MAX_IMAGEN) {
        return NextResponse.json(
          { error: `${prueba.tipo === 'imagen' ? 'Una imagen' : 'Un archivo'} supera los 5MB` },
          { status: 400 }
        );
      }
    }

    // Verificar que el trabajo existe
    const trabajo = await prisma.trabajo.findUnique({
      where: { id: idTrabajo },
    });

    if (!trabajo) {
      return NextResponse.json(
        { error: 'El trabajo no existe' },
        { status: 404 }
      );
    }

    // Verificar que el usuario participa en el trabajo
    if (trabajo.idRider !== userId && trabajo.idDriver !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para crear un reporte sobre este trabajo' },
        { status: 403 }
      );
    }

    // Determinar idReportado (el otro participante)
    const idReportado = trabajo.idRider === userId ? trabajo.idDriver : trabajo.idRider;

    // Verificar que no existe ya un reporte para este trabajo
    const reporteExistente = await prisma.reporte.findUnique({
      where: { idTrabajo },
    });

    if (reporteExistente) {
      return NextResponse.json(
        { error: 'Ya existe un reporte para este trabajo' },
        { status: 409 }
      );
    }

    // Crear el reporte con sus pruebas en una transacción
    const reporte = await prisma.reporte.create({
      data: {
        idTrabajo,
        idReportante: userId,
        idReportado,
        descripcion,
        estaCompleto: false,
        pruebas: {
          create: (pruebas || []).map(
            (p: { url: string; tipo: string }) => ({
              url: p.url,
              tipo: p.tipo,
            })
          ),
        },
      },
      include: {
        pruebas: true,
      },
    });

    return NextResponse.json(
      { ok: true, reporte },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/reportes/crear:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
