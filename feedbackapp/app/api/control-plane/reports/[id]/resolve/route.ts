import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  decision: z.enum(["AFavor", "EnContra"], {
    message: "La decisión debe ser AFavor o EnContra",
  }),
  actorClerkId: z.string().min(1, "actorClerkId es requerido"),
  actorEmail: z.string().email("actorEmail debe ser un email válido"),
  reason: z.string().min(1, "reason es requerido"),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = validateInternalApiKey(request, process.env.CONTROLPANE_API_KEY);
  if (authError) return authError;

  const { id } = await params;

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { message: "ID de reporte inválido" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es un JSON válido" },
      { status: 401 },
    );
  }

  const result = bodySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: result.error.issues[0].message },
      { status: 402 },
    );
  }

  const { decision } = result.data;

  try {
    const reporte = await prisma.reporte.findUnique({ where: { id } });

    if (!reporte) {
      return NextResponse.json(
        { message: "El reporte no existe" },
        { status: 404 },
      );
    }

    if (reporte.estado !== "PRUEBAS_AGREGADAS") {
      return NextResponse.json(
        { message: "El reporte no está pendiente de revisión" },
        { status: 403 },
      );
    }

    const actualizado = await prisma.reporte.update({
      where: { id },
      data: {
        decision,
        resolucion: "Resuelto",
        estado: "RESUELTO",
      },
    });

    return NextResponse.json({
      id: actualizado.id,
      estado: actualizado.estado,
      resolucion: actualizado.resolucion,
      decision: actualizado.decision,
    });
  } catch (error) {
    console.error("Error al resolver reporte desde control-plane:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
