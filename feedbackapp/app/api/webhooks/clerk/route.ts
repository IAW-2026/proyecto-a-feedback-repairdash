import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { rolDeUsuario } from '@/generated/prisma/client';

// Validar que el rol sea válido
function parseRole(value: unknown): rolDeUsuario | null {
  const validRoles = ['rider', 'driver', 'feedbackAdmin'];
  if (typeof value === 'string' && validRoles.includes(value)) {
    return value as rolDeUsuario;
  }
  return null;
}

// Extraer rol de metadata (private primero, luego public)
function getMetadataRole(user: {
  public_metadata?: Record<string, unknown> | null;
  private_metadata?: Record<string, unknown> | null;
}): rolDeUsuario | null {
  return (
    parseRole(user.private_metadata?.role) ??
    parseRole(user.public_metadata?.role)
  );
}

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.warn('[WEBHOOK] Headers de firma incompletos');
      return new Response('Missing webhook headers', { status: 401 });
    }

    const body = await req.text();

    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('WEBHOOK_SECRET no configurado');
    }

    const wh = new Webhook(webhookSecret);
    let evt: any;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('[WEBHOOK] Error validando firma:', err);
      return new Response('Unauthorized', { status: 401 });
    }

    const eventType = evt?.type as string;

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt?.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt?.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt?.data);
        break;
      default:
        console.log(`[WEBHOOK] Evento no manejado: ${eventType}`);
        return new Response('Event type not handled', { status: 200 });
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('[WEBHOOK] Error general:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function handleUserCreated(data: any) {
   try {
    if (!data.id) throw new Error('Clerk ID no proporcionado');

    const email = data.email_addresses?.[0]?.email_address;
    if (!email) throw new Error('Email no proporcionado');

    // Si no hay rol, usar 'rider' como default
    const role = getMetadataRole(data) ?? 'rider';
    //Luego se actualiza
    const usuarioCreado = await prisma.usuario.create({
      data: {
        id: data.id,
        mail: email,
        nombre: data.first_name || '',
        apellido: data.last_name || '',
        valoracion: 0,
        rol: role,
      },
    });

    console.log(`[WEBHOOK] Usuario creado: ${usuarioCreado.id}`);
  } catch (error) {
    console.error('[WEBHOOK] Error creando usuario:', error);
    throw error;
  }
}

async function handleUserUpdated(data: any) {
  try {
    if (!data.id) throw new Error('Clerk ID no proporcionado');

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: data.id },
    });

    if (!usuarioExistente) {
      console.warn(`[WEBHOOK] Usuario ${data.id} no encontrado.`);
      return;
    }

    const updateData: any = {};

    const newEmail = data.email_addresses?.[0]?.email_address;
    if (newEmail && newEmail !== usuarioExistente.mail) updateData.mail = newEmail;
    if (data.first_name && data.first_name !== usuarioExistente.nombre) updateData.nombre = data.first_name;
    if (data.last_name && data.last_name !== usuarioExistente.apellido) updateData.apellido = data.last_name;

    const newRole = getMetadataRole(data);
    if (newRole && newRole !== usuarioExistente.rol) {
      updateData.rol = newRole;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.usuario.update({ where: { id: data.id }, data: updateData });
      console.log(`[WEBHOOK] Usuario actualizado: ${data.id}`);
    } else {
      console.log(`[WEBHOOK] Sin cambios para: ${data.id}`);
    }
  } catch (error) {
    console.error('[WEBHOOK] Error actualizando usuario:', error);
    throw error;
  }
}

async function handleUserDeleted(data: any) {
  try {
    if (!data.id) throw new Error('Clerk ID no proporcionado');

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: data.id },
    });

    if (!usuarioExistente) {
      console.warn(`[WEBHOOK] Usuario ${data.id} no encontrado.`);
      return;
    }

    await prisma.usuario.update({
      where: { id: data.id },
      data: { activo: false },
    });

    console.log(`[WEBHOOK] Usuario desactivado: ${data.id}`);
  } catch (error) {
    console.error('[WEBHOOK] Error desactivando usuario:', error);
    throw error;
  }
}