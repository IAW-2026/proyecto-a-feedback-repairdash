import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { TipoUsuario } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

const TIPO_METADATA_KEYS = ["tipoUsuario", "tipo", "role", "rol"] as const;
const ADMIN_METADATA_KEYS = ["isAdmin", "isadmin", "is_admin", "admin"] as const;

const VALID_METADATA_VALUES = {
  cliente: TipoUsuario.Cliente,
  client: TipoUsuario.Cliente,
  rider: TipoUsuario.Cliente,
  trabajador: TipoUsuario.Trabajador,
  worker: TipoUsuario.Trabajador,
  driver: TipoUsuario.Trabajador,
} as const;

function normalizeTipoUsuario(value: unknown): TipoUsuario | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue in VALID_METADATA_VALUES) {
    return VALID_METADATA_VALUES[
      normalizedValue as keyof typeof VALID_METADATA_VALUES
    ];
  }

  return null;
}

function getTipoUsuarioFromMetadata(
  ...metadataSources: Array<Record<string, unknown> | null | undefined>
): TipoUsuario | null {
  for (const metadata of metadataSources) {
    for (const key of TIPO_METADATA_KEYS) {
      const tipo = normalizeTipoUsuario(metadata?.[key]);
      if (tipo) {
        return tipo;
      }
    }
  }

  return null;
}

function normalizeIsAdmin(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return false;
  }

  return ["true", "1", "si", "sí", "yes"].includes(
    value.trim().toLowerCase()
  );
}

function getIsAdminFromMetadata(
  ...metadataSources: Array<Record<string, unknown> | null | undefined>
): boolean {
  for (const metadata of metadataSources) {
    if (!metadata) {
      continue;
    }

    for (const key of ADMIN_METADATA_KEYS) {
      if (normalizeIsAdmin(metadata[key])) {
        return true;
      }
    }

    const role = typeof metadata.role === "string" ? metadata.role : metadata.rol;
    if (typeof role === "string" && role.trim().toLowerCase() === "admin") {
      return true;
    }
  }

  return false;
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

  if (event.type === "user.deleted") {
    if (!event.data.id) {
      return NextResponse.json(
        { message: "Falta id de usuario eliminado" },
        { status: 400 }
      );
    }

    await prisma.usuario.updateMany({
      where: { id: event.data.id },
      data: { activo: false },
    });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = getPrimaryEmail(event.data);
    const tipo = getTipoUsuarioFromMetadata(
      event.data.public_metadata,
      event.data.private_metadata,
      event.data.unsafe_metadata
    );
    const isAdmin = getIsAdminFromMetadata(
      event.data.public_metadata,
      event.data.private_metadata,
      event.data.unsafe_metadata
    );

    if (!email || !tipo) {
      return NextResponse.json(
        { message: "Faltan email principal o metadata.tipoUsuario/tipo/role/rol valido" },
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
        isAdmin,
        activo: true,
      },
      create: {
        id: event.data.id,
        mail: email,
        nombre: event.data.first_name ?? "",
        apellido: event.data.last_name ?? "",
        valoracion: 0,
        tipo,
        isAdmin,
        activo: true,
      },
    });
  }

  return NextResponse.json({ received: true, type: event.type });
}
