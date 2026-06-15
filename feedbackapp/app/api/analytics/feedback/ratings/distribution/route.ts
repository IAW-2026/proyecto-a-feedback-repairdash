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
        const agrupado = await prisma.review.groupBy({
            by: ["valoracion"],
            where: {
                estaCompleta: true,
                valoracion: { not: null, gte: 1, lte: 5 },
                trabajo: {
                    fechaFin: { gte: startOfMonth, lte: endOfMonth },
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
                period: month,
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