// scripts/sync-users.ts
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from '@/lib/prisma';
import "dotenv/config";

async function syncClerkUsers() {
  const users = await clerkClient.users.getUserList({ limit: 100 });

  let synced = 0;
  let skipped = 0;

  for (const user of users) {
    const rol = user.publicMetadata?.rol as string | undefined;
    const mail = user.emailAddresses[0]?.emailAddress;

    if (!rol) {
      console.log(`⚠️  Saltando ${user.id} — falta rol`);
      skipped++;
      continue;
    }
    if (!mail) {
      console.log(`⚠️  Saltando ${user.id} — falta mail`);
      skipped++;
      continue;
    }
    await prisma.usuario.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        mail,
        nombre: user.firstName ?? "Sin nombre",
        apellido: user.lastName ?? "Sin apellido",
        valoracion: 0.0,
        rol: rol as any,
        activo: true,
      },
    });

    console.log(`✅ ${user.id} — ${mail}`);
    synced++;
  }

  console.log(`\nListo: ${synced} sincronizados, ${skipped} saltados`);
}

syncClerkUsers()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });