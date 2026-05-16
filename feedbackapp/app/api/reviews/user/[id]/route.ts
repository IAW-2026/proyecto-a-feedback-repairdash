/*
GET feedback/api/reviews/user/:userID Request: nada, el ID ya viaja en la URL. 
Response 200 OK: { "id": 5, "nombre": "Juan", "apellido": "Pérez", "valoracion": 4, "reviews":
 [ { "id": 101, "idTrabajo": 42, "valoracion": 5, "review": "Excelente predisposición, muy recomendable." }, 
{ "id": 102, "idTrabajo": 58, "valoracion": 3, "review": "Hizo el trabajo, pero llegó un poco tarde." } ] }*/
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
}