import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = validateInternalApiKey(request, process.env.CONTROLPANE_API_KEY);
  if (authError) return authError;

  try {
    const [
      reportesAbiertos,
      reportesEnRevision,
      reportesResueltos,
      reviewsPendientes,
    ] = await Promise.all([
      prisma.reporte.count({
        where: {
          resolucion: "SinResolver",
          estado: "CREADO",
        },
      }),
      prisma.reporte.count({
        where: {
          estado: "PRUEBAS_AGREGADAS",
        },
      }),
      prisma.reporte.count({
        where: {
          resolucion: "Resuelto",
        },
      }),
      prisma.review.count({
        where: {
          estaCompleta: false,
        },
      }),
    ]);

    return NextResponse.json({
      reportesAbiertos,
      reportesEnRevision,
      reportesResueltos,
      reviewsPendientes,
    });
  } catch (error) {
    console.error("Error al obtener resumen de control-plane:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
