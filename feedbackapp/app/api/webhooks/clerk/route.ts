import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { TipoUsuario } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

function normalizeTipoUsuario(value: unknown): TipoUsuario | null {
  if (value === TipoUsuario.Cliente || value === "cliente") {
    return TipoUsuario.Cliente;
  }

  if (value === TipoUsuario.Trabajador || value === "trabajador") {
    return TipoUsuario.Trabajador;
  }

  return null;
}

function getTipoUsuario(publicMetadata: Record<string, unknown> | undefined): TipoUsuario | null {
  const tipoDirecto = normalizeTipoUsuario(publicMetadata?.tipoUsuario);
  if (tipoDirecto) {
    return tipoDirecto;
  }

  if (publicMetadata?.createdByApp === "driver") {
    return TipoUsuario.Trabajador;
  }

  if (publicMetadata?.createdByApp === "rider") {
    return TipoUsuario.Cliente;
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
        { message: "Faltan email principal o publicMetadata.createdByApp valido" },
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

  return NextResponse.json({ received: true });
}
