/*Origen: Rider app o workep app Objetivo: Una vez finalizado un trabajo, por la confirmación de ambos usuarios. Se debe permitir realizar una review de 
cada usuario hacia el otro, por lo que se debe llamar a feedback app. 
EndPoint: PUT feedback/api/reviews/user 
Request: { "idTrabajo": 42 } 
Response 200 OK: { "status": "ReadyToRate", "datosDelTrabajo": { "idTrabajo": 42, "tipoDeTrabajo": "Flete", "Rider": { "id": 10, "nombre": "Juan" }, 
"Driver": { "id": 1, "nombre": "Sebastian" } } }*/
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'; //Linea para forzar que vercel no optimice estaticamente (IA)
//Esto es VALIDAR EL ID, debo consultar a clerk?
function validarID(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function nombreCompleto(usuario: { nombre: string; apellido: string }) {
    return `${usuario.nombre} ${usuario.apellido}`;
}
export async function PUT(request: Request) {
    //Si no se envía un JSON. Catch()  vuelve nulo a body
    const body = await request.json().catch(() => null);

    if (!body) {
        return NextResponse.json(
            { message: "El cuerpo de la solicitud no es un JSON valido" },
            { status: 400 }
        );
    }
    const { idTrabajo } = body;
    if (!validarID(idTrabajo)) {
        return NextResponse.json(
            { message: "El idTrabajo no es un ID valido" },
            { status: 400 }
        );
    }
    //Convertir a string para Prisma
    const idTrabajoStr = idTrabajo.toString();
    
    //Debo chequear 
    const trabajo = await prisma.trabajo.findUnique({
        where: { id: idTrabajoStr },
        include: {
            rider: true,
            driver: true
        }
    });
    if (!trabajo) {
        return NextResponse.json({ message: "Trabajo no encontrado" }, { status: 404 });
    }
    const [reviewRider, reviewDriver] = await prisma.$transaction([
        prisma.review.upsert({
            where: {
                idTrabajo_idUsuario: {  // Prisma autogenera este nombre
                    idTrabajo: idTrabajoStr,
                    idUsuario: trabajo.idRider,
                }
            },
            update: {},
            create: { idTrabajo: idTrabajoStr, idUsuario: trabajo.idRider },
        }),
        prisma.review.upsert({
            where: {idTrabajo_idUsuario: {
                idTrabajo: idTrabajoStr,
                idUsuario: trabajo.idDriver,
            } },
            update: {},
            create: { idTrabajo: idTrabajoStr, idUsuario: trabajo.idDriver },
        })
    ]);

    return NextResponse.json(
        {
            status: "ReadyToRate",
            datosDelTrabajo: {
                idTrabajo: trabajo.id,
                tipoDeTrabajo: trabajo.tipoDeTrabajo,
                rider: { id: trabajo.rider.id, nombre: nombreCompleto(trabajo.rider) },
                driver: { id: trabajo.driver.id, nombre: nombreCompleto(trabajo.driver) },
            },
            reviews: {
                rider: { idReview: reviewRider.id, idUsuario: reviewRider.idUsuario },
                driver: { idReview: reviewDriver.id, idUsuario: reviewDriver.idUsuario },
            },
        },
        { status: 200 }
    );
}