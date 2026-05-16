//api para recibir trabajos. Cuando se confirma, que me mande toda la data
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json().catch(() => null);
    
    if(!body){
        return NextResponse.json(
            { message: "El cuerpo de la solicitud no es un JSON valido" },
            { status: 400 }
        );
    }

    const { id, idCliente, idTrabajador, tipoDeTrabajo } = body;

    // Validamos que Driverapp nos mande TODO lo necesario
    if (!id || !idCliente || !idTrabajador || !tipoDeTrabajo) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios (id, idCliente, idTrabajador o tipoDeTrabajo)" },
        { status: 400 }
      );
    }

    const nuevoTrabajo = await prisma.trabajo.create({
      data: {
        id: id,
        idCliente: idCliente,
        idTrabajador: idTrabajador,
        tipoDeTrabajo,
        fechaInicio: new Date(), 
      },
    });

    return NextResponse.json(nuevoTrabajo, { status: 201 });

  } catch (error) {
    console.error("Error al registrar el trabajo externo:", error);
    //"error" puede ser muchas cosas. Por ejemplo si no existe alguno de los 
    //usuarios en mi BD. (detecta problemas de inconsistencia). 
    //también por si esta caido vercel, lo detecta.
    return NextResponse.json(
      { error: "Error al mapear el trabajo en el sistema de feedback" },
      { status: 500 }
    );
  }
}