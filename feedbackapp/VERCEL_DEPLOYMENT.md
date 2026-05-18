# Deployment en Vercel - Configuración de Prisma 7

## Problema Resuelto
Con Prisma 7.8.0, se requiere configuración adicional para serverless environments como Vercel. El error `PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions` ocurría porque faltaba configurar un `adapter` o `accelerateUrl`.

## Solución Implementada

### 1. Configuración del Schema (prisma/schema.prisma)
- Removida la URL directa del datasource (Prisma 7 no lo permite)
- La configuración ahora está centralizada en `prisma.config.ts`

### 2. Configuración de Prisma (prisma.config.ts)
- Configurado para leer `DATABASE_URL` de las variables de entorno
- Soporta conexión directo a PostgreSQL para desarrollo local

### 3. Cliente de Prisma (lib/prisma.ts)
- Actualizado para soportar Prisma Accelerate
- Lee `PRISMA_ACCELERATE_URL` para entornos serverless

## Pasos para Deploy en Vercel

### Opción A: Usar Prisma Accelerate (RECOMENDADO para Vercel)
1. **Crear cuenta en Prisma Data Platform**
   - Ir a https://www.prisma.io/data-platform/accelerate
   - Crear una cuenta o iniciar sesión

2. **Configurar Accelerate**
   - Crear un proyecto en Prisma Data Platform
   - Conectar tu base de datos PostgreSQL
   - Obtener la URL de Accelerate (algo como: `prisma://...`)

3. **En Vercel Dashboard**
   - Ir a Settings → Environment Variables
   - Agregar variable: `PRISMA_ACCELERATE_URL` = `[tu_url_de_accelerate]`
   - Verificar que `DATABASE_URL` esté correctamente configurada
   - Verificar que `CLERK_WEBHOOK_SIGNING_SECRET` esté configurada
   - Redeploy la aplicación

### Opción B: Usar un Adapter (Neon, D1, etc.)
1. **Instalar adapter para tu base de datos**
   ```bash
   npm install @prisma/adapter-neon
   ```

2. **Actualizar lib/prisma.ts** para usar el adapter:
   ```typescript
   import { PrismaClient } from "@prisma/client";
   import { Pool } from "@neondatabase/serverless";
   import { PrismaNeon } from "@prisma/adapter-neon";

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined;
   };

   export const getPrisma = () => {
     if (!globalForPrisma.prisma) {
       const connectionString = process.env.DATABASE_URL;
       const pool = new Pool({ connectionString });
       const adapter = new PrismaNeon(pool);

       globalForPrisma.prisma = new PrismaClient({
         adapter,
         log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
       });
     }
     return globalForPrisma.prisma;
   };
   ```

3. **En Vercel Dashboard**
   - Agregar variable: `DATABASE_URL` (URL de tu base de datos)
   - Redeploy

## Verificación Local
```bash
# Generar cliente de Prisma
npm run postinstall

# Testear conexión
npx prisma db push
```

## Troubleshooting

### Si aún ves el error después del deploy:
1. ✅ Verifica que las variables de entorno estén en Vercel (Settings → Environment Variables)
2. ✅ Haz redeploy con "Redeploy without cache" en Vercel
3. ✅ Revisa los logs en Vercel → Deployment → Logs
4. ✅ Asegúrate que `DATABASE_URL` o `PRISMA_ACCELERATE_URL` esté correctamente configurada

### Variables de entorno requeridas en Vercel:
- `DATABASE_URL` - Tu cadena de conexión a PostgreSQL
- `PRISMA_ACCELERATE_URL` - (Alternativa a DATABASE_URL) URL de Prisma Accelerate
- `CLERK_WEBHOOK_SIGNING_SECRET` - De tu Dashboard de Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - De tu Dashboard de Clerk
- `CLERK_SECRET_KEY` - De tu Dashboard de Clerk
- `INTERNAL_API_TOKEN` - Token interno para API calls

## Recursos
- [Prisma 7 Migration Guide](https://www.prisma.io/docs/orm/reference/upgrade-guide/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
- [Prisma Adapters](https://www.prisma.io/docs/orm/reference/prisma-client-reference#adapter)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
