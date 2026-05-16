/*Origen: Rider app o workep app Objetivo: Una vez finalizado un trabajo, por la confirmación de ambos usuarios. Se debe permitir realizar una review de 
cada usuario hacia el otro, por lo que se debe llamar a feedback app. 
EndPoint: PUT feedback/api/reviews/user 
Request: { "idTrabajo": 42 } 
Response 200 OK: { "status": "ReadyToRate", "datosDelTrabajo": { "idTrabajo": 42, "tipoDeTrabajo": "Flete", "cliente": { "id": 10, "nombre": "Juan" }, 
"trabajador": { "id": 1, "nombre": "Sebastian" } } }*/
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic'; //Linea para forzar que vercel no optimice estaticamente (IA)


function nombreCompleto(usuario: { nombre: string; apellido: string }) {
    return `${usuario.nombre} ${usuario.apellido}`;
}
export async function PUT(request: Request) {
    const prisma = getPrisma();
    //Si no se envía un JSON. Catch()  vuelve nulo a body
    const body = await request.json().catch(() => null);

    if (!body) {
        return NextResponse.json(
            { message: "El cuerpo de la solicitud no es un JSON valido" },
            { status: 400 }
        );
    }
    const { idTrabajo } = body;
    //Debo chequear 
    const trabajo = await prisma.trabajo.findUnique({
        where: { id: idTrabajo },
        include: {
            cliente: true,
            trabajador: true
        }
    });
    if (!trabajo) {
        return NextResponse.json({ message: "Trabajo no encontrado" }, { status: 404 });
    }
    const [reviewCliente, reviewTrabajador] = await prisma.$transaction([
        prisma.review.upsert({
            where: {
                idTrabajo_idUsuario: {  // Prisma autogenera este nombre
                    idTrabajo: idTrabajo,
                    idUsuario: trabajo.idCliente,
                }
            },
            update: {},
            create: { idTrabajo, idUsuario: trabajo.idCliente },
        }),
        prisma.review.upsert({
            where: {idTrabajo_idUsuario: {
                idTrabajo: idTrabajo,
                idUsuario: trabajo.idTrabajador,
            } },
            update: {},
            create: { idTrabajo, idUsuario: trabajo.idTrabajador },
        })
    ]);

    return NextResponse.json(
        {
            status: "ReadyToRate",
            datosDelTrabajo: {
                idTrabajo: trabajo.id,
                tipoDeTrabajo: trabajo.tipoDeTrabajo,
                cliente: { id: trabajo.cliente.id, nombre: nombreCompleto(trabajo.cliente) },
                trabajador: { id: trabajo.trabajador.id, nombre: nombreCompleto(trabajo.trabajador) },
            },
            reviews: {
                cliente: { idReview: reviewCliente.id, idUsuario: reviewCliente.idUsuario },
                trabajador: { idReview: reviewTrabajador.id, idUsuario: reviewTrabajador.idUsuario },
            },
        },
        { status: 200 }
    );
}