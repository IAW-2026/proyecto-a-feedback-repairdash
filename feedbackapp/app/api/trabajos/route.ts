//api para recibir trabajos. Cuando se confirma, que me mande toda la data
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function validarStringID(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
   // const authError = validateInternalApiKey(request);
   // if (authError) return authError;
    if (!body) {
      return NextResponse.json(
        { message: 'El cuerpo de la solicitud no es un JSON válido' },
        { status: 401 }
      );
    }

    const { idTrabajo, idRider, idDriver, tipoDeTrabajo } = body;

    // Validar que todos los campos sean strings no vacíos
    /*if (
      !validarStringID(idTrabajo) ||
      !validarStringID(idRider) ||
      !validarStringID(idDriver) ||
      !validarStringID(tipoDeTrabajo)
    ) {
      return NextResponse.json(
        {
          message:
            'idTrabajo, idRider, idDriver y tipoDeTrabajo deben ser strings válidos',
        },
        { status: 402 }
      );
    }*/

    // Verificar que idRider !== idDriver
    if (idRider === idDriver) {
      return NextResponse.json(
        { message: 'El rider y el driver no pueden ser el mismo usuario' },
        { status: 403 }
      );
    }

    // Verificar que ambos usuarios existen y tienen los roles correctos
    const [riderUser, driverUser] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id: idRider },
      }),
      prisma.usuario.findUnique({
        where: { id: idDriver },
      }),
    ]);

    if (!riderUser || !driverUser) {
      return NextResponse.json(
        { message: 'Uno o ambos usuarios no existen en el sistema' },
        { status: 404 }
      );
    }

    // Verificar que los roles son correctos
    if (riderUser.rol !== 'rider' || driverUser.rol !== 'driver') {
      return NextResponse.json(
        { message: 'Los roles de los usuarios no son correctos' },
        { status: 405 }
      );
    }

    // Verificar que no existe un trabajo con ese idTrabajo
    const trabajoExistente = await prisma.trabajo.findUnique({
      where: { id: idTrabajo },
    });

    if (trabajoExistente) {
      return NextResponse.json(
        { message: 'Ya existe un trabajo con ese ID' },
        { status: 409 }
      );
    }

    // Crear el trabajo
    const nuevoTrabajo = await prisma.trabajo.create({
      data: {
        id: idTrabajo,
        idRider,
        idDriver,
        tipoDeTrabajo,
        fechaInicio: new Date(),
        activo: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Trabajo creado exitosamente',
        idTrabajo: nuevoTrabajo.id,
        tipoDeTrabajo: nuevoTrabajo.tipoDeTrabajo,
        rider: {
          id: riderUser.id,
          nombre: riderUser.nombre,
          apellido: riderUser.apellido,
        },
        driver: {
          id: driverUser.id,
          nombre: driverUser.nombre,
          apellido: driverUser.apellido,
        },
        estado: 'activo',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar el trabajo externo:', error);
    return NextResponse.json(
      { error: 'Error al mapear el trabajo en el sistema de feedback' },
      { status: 500 }
    );
  }
}