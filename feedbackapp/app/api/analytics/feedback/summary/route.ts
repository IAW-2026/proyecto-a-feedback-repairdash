import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

function validarMonthParam(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value);
}

export async function GET(request: Request) {
  const authError = validateInternalApiKey(request, process.env.ANALYTICS_API_KEY);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!month || !validarMonthParam(month)) {
    return NextResponse.json(
      { message: "El parámetro 'month' es requerido y debe tener formato YYYY-MM" },
      { status: 400 }
    );
  }
 const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

  try {
    const [
      reviewsDelMes,
      reportesDelMes,
      reportesConFalloContraCliente,
      reportesConFalloContraTrabajador,
      trabajosDelMes,
    ] = await Promise.all([
      prisma.review.count({
        where: {
          estaCompleta: true,
          valoracion: { gte: 1, lte: 5 },
          trabajo: {
            fechaFin: { gte: startOfMonth, lte: endOfMonth },
          },
        },
      }),
      prisma.reporte.count({
        where: {
          trabajo: {
            fechaFin: { gte: startOfMonth, lte: endOfMonth },
          },
        },
      }),
      prisma.reporte.count({
        where: {
          decision: "EnContra",
          trabajo: {
            fechaFin: { gte: startOfMonth, lte: endOfMonth },
          },
          reportado: {
            rol: "rider",
          },
        },
      }),
      prisma.reporte.count({
        where: {
          decision: "EnContra",
          trabajo: {
            fechaFin: { gte: startOfMonth, lte: endOfMonth },
          },
          reportado: {
            rol: "driver",
          },
        },
      }),
      prisma.trabajo.count({
        where: {
          fechaFin: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
    ]);

    const tasaReportessobreTrabajos =
      trabajosDelMes > 0
        ? (reportesDelMes / trabajosDelMes).toFixed(3)
        : "0.000";

    return NextResponse.json(
      {
        source: "feedback",
        period: month,
        generatedAt: new Date().toISOString(),
        reviewsDelMes,
        reportesDelMes,
        reportesConFalloContraCliente,
        reportesConFalloContraTrabajador,
        tasaReportessobreTrabajos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener resumen de feedback:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}