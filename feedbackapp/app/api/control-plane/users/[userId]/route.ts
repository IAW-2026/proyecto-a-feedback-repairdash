import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const authError = validateInternalApiKey(request, process.env.CONTROLPANE_API_KEY);
  if (authError) return authError;

  const { userId } = await params;

  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    return NextResponse.json(
      { message: "ID de usuario inválido" },
      { status: 400 },
    );
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const [
      abiertos,
      enRevision,
      conFalloEnContra,
      totalReportesReportante,
      reviewStats,
    ] = await Promise.all([
      prisma.reporte.count({
        where: {
          idReportado: userId,
          resolucion: "SinResolver",
          estado: "CREADO",
        },
      }),
      prisma.reporte.count({
        where: {
          idReportado: userId,
          estado: "PRUEBAS_AGREGADAS",
        },
      }),
      prisma.reporte.count({
        where: {
          idReportado: userId,
          decision: "EnContra",
        },
      }),
      prisma.reporte.count({
        where: {
          idReportante: userId,
        },
      }),
      prisma.review.aggregate({
        where: {
          estaCompleta: true,
          trabajo: {
            OR: [{ idRider: userId }, { idDriver: userId }],
          },
          NOT: { idUsuario: userId },
        },
        _count: true,
        _avg: { valoracion: true },
      }),
    ]);

    return NextResponse.json({
      idUsuario: userId,
      reportesComoReportado: {
        abiertos,
        enRevision,
        conFalloEnContra,
      },
      reportesComoReportante: {
        total: totalReportesReportante,
      },
      reviewsRecibidas: {
        total: reviewStats._count,
        valoracionPromedio: Number(reviewStats._avg.valoracion?.toFixed(1) ?? 0),
      },
    });
  } catch (error) {
    console.error("Error al obtener contexto de usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
