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
    //a favor del retortante o encontra del mismo
    const [porEstadoRaw, aFavor, enContra, sinDecision, total] = await Promise.all([
      prisma.reporte.groupBy({
        by: ["estado"],
        where: {
          trabajo: {
            fechaFin: { gte: startOfMonth, lte: endOfMonth },
          },
        },
        _count: { estado: true },
      }),
      prisma.reporte.count({
        where: {
          decision: "AFavor",
          trabajo: { fechaFin: { gte: startOfMonth, lte: endOfMonth } },
        },
      }),
      prisma.reporte.count({
        where: {
          decision: "EnContra",
          trabajo: { fechaFin: { gte: startOfMonth, lte: endOfMonth } },
        },
      }),
      prisma.reporte.count({
        where: {
          decision: null,
          trabajo: { fechaFin: { gte: startOfMonth, lte: endOfMonth } },
        },
      }),
      prisma.reporte.count({
        where: {
          trabajo: { fechaFin: { gte: startOfMonth, lte: endOfMonth } },
        },
      }),
    ]);

    const estados: ("CREADO" | "PRUEBAS_AGREGADAS" | "RESUELTO")[] = [
      "CREADO",
      "PRUEBAS_AGREGADAS",
      "RESUELTO",
    ];

    const porEstado: Record<string, number> = {};
    for (const estado of estados) {
      const encontrado = porEstadoRaw.find((item) => item.estado === estado);
      porEstado[estado] = encontrado?._count.estado ?? 0;
    }

    return NextResponse.json(
      {
        source: "feedback",
        period: month,
        generatedAt: new Date().toISOString(),
        porEstado,
        porDecision: {
          AFavor: aFavor,
          EnContra: enContra,
          SinDecision: sinDecision,
        },
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener breakdown de reportes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}