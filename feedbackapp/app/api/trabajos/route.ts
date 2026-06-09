import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateInternalApiKey } from "@/lib/auth";
export const dynamic = "force-dynamic";

function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");

    const authError = validateInternalApiKey(request);
    if (authError) return authError;


    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "El cuerpo de la solicitud no es un JSON valido" },
        { status: 400 },
      );
    }

    const idTrabajo = normalizeString(
      body.idTrabajo ??
      body.id_trabajo ??
      body.Idtrabajo,
    );

    const idRider = normalizeString(
      body.idRider ??
      body.id_rider ??
      body.idCliente ??
      body.IdCliente,
    );

    const idDriver = normalizeString(
      body.idDriver ??
      body.id_driver ??
      body.idTrabajador ??
      body.IdTrabajador,
    );

    const tipoDeTrabajo = normalizeString(
      body.tipoDeTrabajo ??
      body.tipo_de_trabajo ??
      body.tipodeTrabajo,
    );

    if (
      !isValidString(idTrabajo) ||
      !isValidString(idRider) ||
      !isValidString(idDriver) ||
      !isValidString(tipoDeTrabajo)
    ) {
      return NextResponse.json(
        {
          message:
            "idTrabajo, idRider/idCliente, idDriver/idTrabajador y tipoDeTrabajo son obligatorios",
          recibido: body,
        },
        { status: 400 },
      );
    }

    if (idRider === idDriver) {
      return NextResponse.json(
        { message: "El rider y el driver no pueden ser el mismo usuario" },
        { status: 403 },
      );
    }

    const [riderUser, driverUser] = await Promise.all([
      prisma.usuario.findUnique({
        where: {
          id: idRider,
        },
      }),
      prisma.usuario.findUnique({
        where: {
          id: idDriver,
        },
      }),
    ]);

    if (!riderUser || !driverUser) {
      return NextResponse.json(
        {
          message: "Uno o ambos usuarios no existen en el sistema",
          ids: {
            idRider,
            idDriver,
          },
        },
        { status: 404 },
      );
    }

    if (
      riderUser.rol?.toLowerCase() !== "rider" ||
      driverUser.rol?.toLowerCase() !== "driver"
    ) {
      return NextResponse.json(
        {
          message: "Los roles de los usuarios no son correctos",
          roles: {
            rider: riderUser.rol,
            driver: driverUser.rol,
          },
        },
        { status: 405 },
      );
    }

    const trabajoExistente = await prisma.trabajo.findUnique({
      where: {
        id: idTrabajo,
      },
    });

    if (trabajoExistente) {
      return NextResponse.json(
        { message: "Ya existe un trabajo con ese ID" },
        { status: 409 },
      );
    }

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
        idTrabajo: nuevoTrabajo.id,
        idCliente: idRider,
        idTrabajador: idDriver,
        tipoDeTrabajo: nuevoTrabajo.tipoDeTrabajo,
        fechaDeInicio: nuevoTrabajo.fechaInicio,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al registrar el trabajo externo:", error);

    return NextResponse.json(
      { message: "Error interno al registrar el trabajo" },
      { status: 500 },
    );
  }
}