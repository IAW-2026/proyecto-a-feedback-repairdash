import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = validateInternalApiKey(request, process.env.CONTROLPANE_API_KEY);
  if (authError) return authError;

  const { id } = await params;

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { message: "El ID del reporte no es válido" },
      { status: 400 },
    );
  }

  try {
    const reporte = await prisma.reporte.findUnique({
      where: { id },
      include: {
        trabajo: true,
        reportante: true,
        reportado: true,
        pruebas: true,
      },
    });

    if (!reporte) {
      return NextResponse.json(
        { message: "El reporte no existe" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: reporte.id,
      idTrabajo: reporte.idTrabajo,
      idReportante: reporte.idReportante,
      idReportado: reporte.idReportado,
      descripcion: reporte.descripcion,
      estado: reporte.estado,
      resolucion: reporte.resolucion,
      decision: reporte.decision,
      creadoEn: reporte.trabajo.fechaFin?.toISOString() ?? null,
      trabajo: {
        id: reporte.trabajo.id,
        idRider: reporte.trabajo.idRider,
        idDriver: reporte.trabajo.idDriver,
        tipoDeTrabajo: reporte.trabajo.tipoDeTrabajo,
        fechaInicio: reporte.trabajo.fechaInicio.toISOString(),
        fechaFin: reporte.trabajo.fechaFin?.toISOString() ?? null,
      },
      reportante: {
        id: reporte.reportante.id,
        nombre: reporte.reportante.nombre,
        apellido: reporte.reportante.apellido,
        rol: reporte.reportante.rol,
      },
      reportado: {
        id: reporte.reportado.id,
        nombre: reporte.reportado.nombre,
        apellido: reporte.reportado.apellido,
        rol: reporte.reportado.rol,
      },
      pruebas: reporte.pruebas.map((p) => ({
        id: p.id,
        tipo: p.tipo,
        url: p.url,
      })),
    });
  } catch (error) {
    console.error("Error al obtener reporte de control-plane:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
