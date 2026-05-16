/*
GET feedback/api/reviews/user/:userID Request: nada, el ID ya viaja en la URL. 
Response 200 OK: { "id": 5, "nombre": "Juan", "apellido": "Pérez", "valoracion": 4, "reviews":
 [ { "id": 101, "idTrabajo": 42, "valoracion": 5, "review": "Excelente predisposición, muy recomendable." }, 
{ "id": 102, "idTrabajo": 58, "valoracion": 3, "review": "Hizo el trabajo, pero llegó un poco tarde." } ] }*/
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
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
    const usuario = await prisma.usuario.findUnique({
        where: { id: id },
        select: {
            id: true,
            nombre: true,
            apellido: true,
            valoracion: true,
        }
    });

    if (!usuario) {
        return NextResponse.json(
            { message: "Usuario no encontrado." },
            { status: 404 }
        );
    }
    const reviewsRecibidas = await prisma.review.findMany({
        where: {
            trabajo: {
                OR: [
                    { idCliente: id },
                    { idTrabajador: id }
                ]
            },
            idUsuario: { not: id } 
        },
        select: {
            id: true,
            idTrabajo: true,
            valoracion: true,
            review: true
        }
    });

    return NextResponse.json(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            valoracion: usuario.valoracion,
            reviews: reviewsRecibidas
        },
        { status: 200 }
    );



}