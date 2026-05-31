# RepairDash — Feedback App

Módulo de reseñas y reportes del ecosistema RepairDash. Permite a riders y
drivers calificarse mutuamente y reportar incidencias tras un trabajo.

## Deploy

[https://proyecto-a-feedback-repairdash.vercel.app/](https://proyecto-a-feedback-repairdash.vercel.app/)

## Tecnologías

- Next.js 16 (App Router)
- PostgreSQL (Neon) + Prisma
- Clerk (autenticación)
- Cloudinary (almacenamiento de evidencias)
- Tailwind CSS v4
- Zod (validaciones)

## Credenciales de prueba

| Tipo  | Email                     | Rol           |
| ----- | ------------------------- | ------------- |
| Admin | admin@repairdash.com      | feedbackAdmin |
| Rider | rider@repairdash.com      | rider         |
| Driver| driver@repairdash.com     | driver        |

> Las contraseñas corresponden a las configuradas en Clerk.

## Scripts

```bash
npm run dev       # Desarrollo
npm run build     # Build de producción
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar los valores.
