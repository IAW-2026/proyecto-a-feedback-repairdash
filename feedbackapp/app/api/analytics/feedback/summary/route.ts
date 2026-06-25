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
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const month = searchParams.get("month");

  let dateFilter: { gte: Date; lte: Date };
  let period: string | { from: string; to: string };

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { message: "Los parámetros 'from' y 'to' deben ser fechas válidas (ISO 8601)" },
        { status: 400 }
      );
    }
    const toDateEnd = new Date(to);
    toDateEnd.setHours(23, 59, 59, 999);
    dateFilter = { gte: fromDate, lte: toDateEnd };
    period = { from, to };
  } else if (month) {
    if (!validarMonthParam(month)) {
      return NextResponse.json(
        { message: "El parámetro 'month' debe tener formato YYYY-MM" },
        { status: 400 }
      );
    }
    const [year, monthNum] = month.split("-").map(Number);
    dateFilter = {
      gte: new Date(year, monthNum - 1, 1),
      lte: new Date(year, monthNum, 0, 23, 59, 59, 999),
    };
    period = month;
  } else {
    const now = new Date();
    const year = now.getFullYear();
    const monthNum = now.getMonth() + 1;
    dateFilter = {
      gte: new Date(year, monthNum - 1, 1),
      lte: new Date(year, monthNum, 0, 23, 59, 59, 999),
    };
    period = `${year}-${String(monthNum).padStart(2, "0")}`;
  }

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
            fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
          },
        },
      }),
      prisma.reporte.count({
        where: {
          trabajo: {
            fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
          },
        },
      }),
      prisma.reporte.count({
        where: {
          decision: "EnContra",
          trabajo: {
            fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
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
            fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
          },
          reportado: {
            rol: "driver",
          },
        },
      }),
      prisma.trabajo.count({
        where: {
          fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
        },
      }),
    ]);

    const tasaReportessobreTrabajos =
      reviewsDelMes > 0
        ? (reportesDelMes / reviewsDelMes).toFixed(3)
        : "0.000";

    return NextResponse.json(
      {
        source: "feedback",
        period,
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