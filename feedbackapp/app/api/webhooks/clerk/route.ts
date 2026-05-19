import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { getPrisma } from '@/lib/prisma';
import { TipoUsuario } from '@prisma/client';



export async function POST(req: Request) {
  try {
 
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // Validar que todos los headers estén presentes
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.warn('[WEBHOOK] Headers de firma incompletos');
      return new Response('Missing webhook headers', { status: 401 });
    }

   
    const body = await req.text();

   
    const wh = new Webhook(process.env.WEBHOOK_SECRET || '');

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

/**
 * Crear usuario
 * Se ejecuta cuando Clerk crea un nuevo usuario
 */
async function handleUserCreated(data: any) {
  try {
    // Validar datos obligatorios
    if (!data.id) {
      throw new Error('Clerk ID no proporcionado');
    }

    const email = data.email_addresses?.[0]?.email_address;
    if (!email) {
      throw new Error('Email no proporcionado');
    }

    const firstName = data.first_name || '';
    const lastName = data.last_name || '';

    const userType = data.public_metadata?.tipo || 'Cliente';


    if (!['Cliente', 'Trabajador'].includes(userType)) {
      throw new Error(`Tipo de usuario inválido: ${userType}`);
    }

    const prismaClient = getPrisma();
    const usuarioCreado = await prismaClient.usuario.create({
      data: {
        id: data.id, 
        mail: email,
        nombre: firstName,
        apellido: lastName,
        valoracion: 0, 
        tipo: userType as TipoUsuario,
      },
    });

    console.log(`[WEBHOOK] Usuario creado: ${usuarioCreado.id} - ${usuarioCreado.nombre} ${usuarioCreado.apellido}`);
  } catch (error) {
    console.error('[WEBHOOK] Error creando usuario:', error);
    throw error;
  }
}

/**
 * actualizar usuario
 * Se ejecuta cuando Clerk actualiza datos del usuario
 */
async function handleUserUpdated(data: any) {
  try {
 
    if (!data.id) {
      throw new Error('Clerk ID no proporcionado');
    }

    const prismaClient = getPrisma();
    const usuarioExistente = await prismaClient.usuario.findUnique({
      where: { id: data.id },
    });

    if (!usuarioExistente) {
      console.warn(`[WEBHOOK] Usuario ${data.id} no encontrado en BD. No se actualiza.`);
      return;
    }

  
    const updateData: any = {};

  
    const newEmail = data.email_addresses?.[0]?.email_address;
    if (newEmail && newEmail !== usuarioExistente.mail) {
      updateData.mail = newEmail;
    }

    if (data.first_name && data.first_name !== usuarioExistente.nombre) {
      updateData.nombre = data.first_name;
    }
 
    if (data.last_name && data.last_name !== usuarioExistente.apellido) {
      updateData.apellido = data.last_name;
    }

    if (data.public_metadata?.tipo) {
      const newType = data.public_metadata.tipo;
      if (['Cliente', 'Trabajador'].includes(newType) && newType !== usuarioExistente.tipo) {
        updateData.tipo = newType;
      }
    }

    if (Object.keys(updateData).length > 0) {
      const usuarioActualizado = await prismaClient.usuario.update({
        where: { id: data.id },
        data: updateData,
      });
      console.log(`[WEBHOOK] Usuario actualizado: ${usuarioActualizado.id}`);
    } else {
      console.log(`[WEBHOOK] No hay cambios para actualizar usuario: ${data.id}`);
    }
  } catch (error) {
    console.error('[WEBHOOK] Error actualizando usuario:', error);
    throw error;
  }
}

/**
 * Eliminar
 * Se ejecuta cuando Clerk elimina un usuario

 */
async function handleUserDeleted(data: any) {
  try {
    if (!data.id) {
      throw new Error('Clerk ID no proporcionado');
    }

    const prismaClient = getPrisma();
    const usuarioExistente = await prismaClient.usuario.findUnique({
      where: { id: data.id },
      include: {
        trabajosComoCliente: true,
        trabajosComoTrabajador: true,
        reviews: true,
        reportesHechos: true,
        reportesRecibidos: true,
      },
    });

    if (!usuarioExistente) {
      console.warn(`[WEBHOOK] Usuario ${data.id} no encontrado en BD. No se elimina.`);
      return;
    }

    // Verificar si tiene dependencias activas
    const tieneTrabajos =
      usuarioExistente.trabajosComoCliente.length > 0 ||
      usuarioExistente.trabajosComoTrabajador.length > 0;
    const tieneReviews = usuarioExistente.reviews.length > 0;
    const tieneReportes =
      usuarioExistente.reportesHechos.length > 0 ||
      usuarioExistente.reportesRecibidos.length > 0;

    if (tieneTrabajos || tieneReviews || tieneReportes) {
      console.warn(
        `[WEBHOOK] No se puede eliminar usuario ${data.id}. Tiene dependencias:` +
        `\n  - Trabajos: ${tieneTrabajos}` +
        `\n  - Reviews: ${tieneReviews}` +
        `\n  - Reportes: ${tieneReportes}`
      );

      return;
    }

    // Si no hay dependencias, eliminar
    await prismaClient.usuario.delete({
      where: { id: data.id },
    });

    console.log(`[WEBHOOK] Usuario eliminado: ${data.id}`);
  } catch (error) {
    console.error('[WEBHOOK] Error eliminando usuario:', error);
    throw error;
  }
}
