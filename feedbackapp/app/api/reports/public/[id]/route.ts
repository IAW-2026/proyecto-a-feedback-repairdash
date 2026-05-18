/*Origen: Rider app o driver app Objetivo: Mostrar cuantos reportes tiene determinado usuario con el que se va a trabajar, 
para determinar si quiero o no aceptar sus servicios o trabajar para el. 
EndPoint: GET feedback/api/reports/public/:userId Request: nada, el ID ya viaja en la URL. 
Response 200 OK:
 { "idUsuario": 1, "reportesAbiertos": 1, "reportesConFalloEnContra": 0 }*/
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'; //Linea para forzar que vercel no optimice estaticamente (IA)
//Esto es VALIDAR EL ID, debo consultar a clerk?
function validarID(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function nombreCompleto(usuario: { nombre: string; apellido: string }) {
    return `${usuario.nombre} ${usuario.apellido}`;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const prisma = getPrisma();
    // Esperamos a que los parámetros estén listos
    const { id } = await params;
    if (!validarID(id)) {
        return NextResponse.json(
            { message: "el ID es un ID no válido." },
            { status: 400 }
        );
    }
    const [usuario, reportesAbiertos, reportesConFalloEnContra] = await Promise.all([
        prisma.usuario.findUnique({
            where: { id: id },
            select: { id: true } // Solo traemos el ID para confirmar si existe
        }),
        prisma.reporte.count({
            where: {
                idReportado: id,
                resolucion: "SinResolver"
            }
        }),
        prisma.reporte.count({
            where: {
                idReportado: id,
                decision: "EnContra"
            }
        })
    ]);

    if (!usuario) {
        return NextResponse.json(
            { message: "No existe este usuario en el sistema" },
            { status: 404 }
        );
    }

    // Calculamos las estadísticas en backend usando JS
    return NextResponse.json(
        {
            idUsuario: usuario.id,
            reportesAbiertos,
            reportesConFalloEnContra
        },
        { status: 200 }
    );

}