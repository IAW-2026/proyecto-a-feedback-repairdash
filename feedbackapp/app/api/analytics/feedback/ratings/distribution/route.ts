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
        const agrupado = await prisma.review.groupBy({
            by: ["valoracion"],
            where: {
                estaCompleta: true,
                valoracion: { not: null, gte: 1, lte: 5 },
                trabajo: {
                    fechaFin: { gte: dateFilter.gte, lte: dateFilter.lte },
                },
            },
            _count: { valoracion: true },
        });

        const distribucion = [1, 2, 3, 4, 5].map((estrellas) => {
            const encontrado = agrupado.find((item) => item.valoracion === estrellas);
            return {
                estrellas,
                cantidad: encontrado?._count.valoracion ?? 0,
            };
        });

        return NextResponse.json(
            {
                source: "feedback",
                period,
                generatedAt: new Date().toISOString(),
                distribucion,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al obtener distribución de ratings:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}