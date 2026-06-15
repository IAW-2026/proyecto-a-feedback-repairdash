import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_ESTADOS = ["CREADO", "PRUEBAS_AGREGADAS", "RESUELTO"] as const;
const VALID_RESOLUCIONES = ["SinResolver", "Resuelto"] as const;

export async function GET(request: Request) {
  const authError = validateInternalApiKey(request, process.env.CONTROLPANE_API_KEY);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
  const rawEstado = searchParams.get("estado");
  const rawResolucion = searchParams.get("resolucion");

  if (rawEstado && !(VALID_ESTADOS as readonly string[]).includes(rawEstado)) {
    return NextResponse.json(
      { message: `Estado inválido. Valores permitidos: ${VALID_ESTADOS.join(", ")}` },
      { status: 400 },
    );
  }

  if (rawResolucion && !(VALID_RESOLUCIONES as readonly string[]).includes(rawResolucion)) {
    return NextResponse.json(
      { message: `Resolución inválida. Valores permitidos: ${VALID_RESOLUCIONES.join(", ")}` },
      { status: 400 },
    );
  }

  const where: Record<string, unknown> = {};

  if (rawEstado) where.estado = rawEstado;
  if (rawResolucion) where.resolucion = rawResolucion;

  try {
    const [reportes, total] = await Promise.all([
      prisma.reporte.findMany({
        where,
        include: {
          trabajo: {
            select: { fechaFin: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          trabajo: { fechaFin: "desc" },
        },
      }),
      prisma.reporte.count({ where }),
    ]);

    const data = reportes.map((r) => ({
      id: r.id,
      idTrabajo: r.idTrabajo,
      idReportante: r.idReportante,
      idReportado: r.idReportado,
      descripcion: r.descripcion,
      estado: r.estado,
      resolucion: r.resolucion,
      decision: r.decision,
      creadoEn: r.trabajo.fechaFin?.toISOString() ?? null,
    }));

    return NextResponse.json({ data, total, page, limit });
  } catch (error) {
    console.error("Error al obtener reportes de control-plane:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
