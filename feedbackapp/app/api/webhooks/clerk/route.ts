import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const prisma = getPrisma();
  // Configura CLERK_WEBHOOK_SIGNING_SECRET en tu .env o Vercel
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Por favor agrega CLERK_WEBHOOK_SIGNING_SECRET de Clerk Dashboard en las variables de entorno o .env"
    );
  }

  // Obtiene las cabeceras Headers para la validación de svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si no hay headers para Svix, lanzar error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("No svix headers", {
      status: 400,
    });
  }

  // Obtener el body JSON
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Crear instancia de Webhook de Svix
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Validar el payload con los headers y the secret
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error al verificar el webhook:", err);
    return new Response("Error procesando el payload", {
      status: 400,
    });
  }

  // Procesar eventos
  const eventType = evt.type;
  
  try {
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;
    
      await prisma.usuario.create({
        data: {
          id: id,
          mail: email,
          nombre: first_name || "Sin Nombre",
          apellido: last_name || "Sin Apellido",
          valoracion: 0,
          tipo: "Cliente", // Por defecto Cliente
        },
      });
      console.log(`Usuario creado correctamente en BD: ${id}`);
    } 
    
    else if (eventType === "user.updated") {
       const { id, email_addresses, first_name, last_name } = evt.data;
       const email = email_addresses[0]?.email_address;

       await prisma.usuario.update({
         where: { id: id },
         data: {
           mail: email,
           nombre: first_name || "Sin Nombre",
           apellido: last_name || "Sin Apellido",
         },
       });
       console.log(`Usuario actualizado correctamente en BD: ${id}`);
    } 
    
    else if (eventType === "user.deleted") {
      const { id } = evt.data;
      
      if (id) {
        // En vez de borrar físicamente el registro (para evitar perder relaciones de Trabajos/Reportes), 
        // pasamos al usuario a `activo = false` o bien se lo borra usando active.
        await prisma.usuario.update({
          where: { id: id },
          data: {
            activo: false,
          },
        });
        console.log(`Usuario ${id} marcado como inactivo (borrado en clerk).`);
      }
    }
    
    return new Response("Webhook recibido y procesado correctamente", { status: 200 });

  } catch (dbError) {
    console.error("Error operando en la base de datos dentro del webhook de clerk:", dbError);
    return new Response("Error interno procesando en BD", { status: 500 });
  }
}
