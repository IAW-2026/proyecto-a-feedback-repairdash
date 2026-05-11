//POST feedback/api/report
/*Origen: Rider app o driver app 
Objetivo: Comenzar un reporte dada una situación que no puede ser resuelta entre ambos usuarios 
EndPoint: POST feedback/api/report */ 

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

export async function POST(request: Request) {
    const prisma = getPrisma();
    //Si no se envía un JSON. Catch()  vuelve nulo a body
    const body = await request.json().catch(() => null);

    if (!body) {
        return NextResponse.json(
            { message: "El cuerpo de la solicitud no es un JSON valido" },
            { status: 400 }
        );
    }

    const { idTrabajo, idReportante, idReportado } = body;

    if (
        !validarID(idTrabajo) ||
        !validarID(idReportante) ||
        !validarID(idReportado)
    ) {
        return NextResponse.json(
            {
                message:
                    "idTrabajo, idReportante e idReportado no son IDs validos",
            },
            { status: 400 }
        );
    }

    if (idReportante === idReportado) {
        return NextResponse.json(
            { message: "El reportante y el reportado no pueden ser el mismo usuario" },
            { status: 400 }
        );
    }
    //Muchas consultas a BD, esto se puede optimizar. Por ahora dejarlo así para que sea mas claro.
    const reportante = await prisma.usuario.findUnique({
        where: { id: idReportante },
    });
    const reportado = await prisma.usuario.findUnique({
        where: { id: idReportado },
    });
    if (!reportante || !reportado) {
        return NextResponse.json(
            { message: "No existe el reportante o el reportado" },
            { status: 404 }
        );
    }
    const trabajo = await prisma.trabajo.findUnique({
        where: { id: idTrabajo },
        include: {
            cliente: true,
            trabajador: true,
            reporte: true,
        },
    });

    if (!trabajo) {
        return NextResponse.json(
            { message: "No existe un trabajo con ese id" },
            { status: 404 }
        );
    }

    if (trabajo.reporte) {
        return NextResponse.json(
            { message: "El trabajo ya tiene un reporte creado" },
            { status: 409 }
        );
    }

    const usuariosDelTrabajo = [trabajo.idCliente, trabajo.idTrabajador];
    const usuariosValidos =
        usuariosDelTrabajo.includes(idReportante) &&
        usuariosDelTrabajo.includes(idReportado);

    if (!usuariosValidos) {
        return NextResponse.json(
            {
                message:
                    "El reportante y el reportado deben pertenecer al trabajo indicado",
            },
            { status: 400 }
        );
    }

    const reporte = await prisma.reporte.create({
        data: {
            idTrabajo,
            idReportante,
            idReportado,
        }
    });


    return NextResponse.json(
        {
            message: "Reporte creado exitosamente",
            idReporte: reporte.id,
            vinculos: {
                reportante: nombreCompleto(reportante),
                reportado: nombreCompleto(reportado),
            },
            estado: reporte.resolucion,
        },
        { status: 201 }
    );
}
