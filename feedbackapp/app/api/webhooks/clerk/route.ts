import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { TipoUsuario } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

const VALID_CREATED_BY_APP_VALUES = {
  driver: TipoUsuario.Trabajador,
  rider: TipoUsuario.Cliente,
} as const;

function normalizeTipoUsuario(value: unknown): TipoUsuario | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === TipoUsuario.Cliente.toLowerCase()) {
    return TipoUsuario.Cliente;
  }

  if (normalizedValue === TipoUsuario.Trabajador.toLowerCase()) {
    return TipoUsuario.Trabajador;
  }

  return null;
}

function getTipoUsuario(publicMetadata: Record<string, unknown> | null | undefined): TipoUsuario | null {
  const tipoDirecto = normalizeTipoUsuario(publicMetadata?.tipoUsuario);
  if (tipoDirecto) {
    return tipoDirecto;
  }

  const createdByApp =
    typeof publicMetadata?.createdByApp === "string"
      ? publicMetadata.createdByApp.toLowerCase()
      : null;

  if (createdByApp && createdByApp in VALID_CREATED_BY_APP_VALUES) {
    return VALID_CREATED_BY_APP_VALUES[
      createdByApp as keyof typeof VALID_CREATED_BY_APP_VALUES
    ];
  }

  return null;
}

function getPrimaryEmail(data: {
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string | null;
}) {
  const primaryEmail = data.email_addresses?.find(
    (email) => email.id === data.primary_email_address_id
  );

  return primaryEmail?.email_address ?? data.email_addresses?.[0]?.email_address;
}

export async function POST(request: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    console.error("Falta configurar CLERK_WEBHOOK_SIGNING_SECRET para verificar webhooks de Clerk.");
    return NextResponse.json(
      { message: "Webhook no configurado" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Error verificando webhook de Clerk:", error);
    return NextResponse.json({ message: "Webhook invalido" }, { status: 400 });
  }

  const prisma = getPrisma();

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = getPrimaryEmail(event.data);
    const tipo = getTipoUsuario(event.data.public_metadata);

    if (!email || !tipo) {
      return NextResponse.json(
        { message: "Faltan email principal o publicMetadata.tipoUsuario/createdByApp valido" },
        { status: 400 }
      );
    }

    await prisma.usuario.upsert({
      where: { id: event.data.id },
      update: {
        mail: email,
        nombre: event.data.first_name ?? "",
        apellido: event.data.last_name ?? "",
        tipo,
      },
      create: {
        id: event.data.id,
        mail: email,
        nombre: event.data.first_name ?? "",
        apellido: event.data.last_name ?? "",
        valoracion: 0,
        tipo,
      },
    });
  }

  return NextResponse.json({ received: true, type: event.type });
}
