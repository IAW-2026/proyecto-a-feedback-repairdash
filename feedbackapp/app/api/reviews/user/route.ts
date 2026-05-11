/*Origen: Rider app o workep app Objetivo: Una vez finalizado un trabajo, por la confirmación de ambos usuarios. Se debe permitir realizar una review de 
cada usuario hacia el otro, por lo que se debe llamar a feedback app. 
EndPoint: PUT feedback/api/reviews/user 
Request: { "idTrabajo": 42 } 
Response 200 OK: { "status": "ReadyToRate", "datosDelTrabajo": { "idTrabajo": 42, "tipoDeTrabajo": "Flete", "cliente": { "id": 10, "nombre": "Juan" }, 
"trabajador": { "id": 1, "nombre": "Sebastian" } } }*/
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
}