Módulo de reseñas y reportes del ecosistema RepairDash. Permite a riders y
drivers calificarse mutuamente y reportar incidencias tras un trabajo.
Aplicación **Feedback** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `RepairDash`.

Esta app corresponde al módulo de reseñas y calificaciones en los proyectos de tipo **A (Transporte)**

## Deploy

[https://proyecto-a-feedback-repairdash.vercel.app/](https://proyecto-a-feedback-repairdash.vercel.app/)

## Tecnologías

- Next.js 16 (App Router)
- PostgreSQL (Neon) + Prisma
- Clerk (autenticación)
- Cloudinary (almacenamiento de evidencias)
- Tailwind CSS v4
- Zod (validaciones)

## Flujo de Reviews

1. Una app externa (Rider App / Driver App) finaliza un trabajo llamando a `POST /api/reviews/user`.
2. El sistema crea automáticamente dos reviews pendientes (una para cada parte).
3. El usuario ingresa a la Feedback App y tiene un bloqueo que le exige completar la review pendiente antes de navegar.
4. Completa la review con puntuación (1-5) y texto (20-1000 caracteres).
5. Una vez enviada, la review queda registrada y el usuario puede usar la app con normalidad.

## Flujo de Reportes

1. Una app externa crea un reporte contra un usuario vía `POST /api/reports` (asociado a un trabajo).
2. El reportado recibe un bloqueo similar al de reviews: debe cargar evidencia (descripción + archivos) para resolverlo.
3. Las evidencias se suben a Cloudinary y se asocian al reporte.
4. Un administrador revisa el reporte con las pruebas cargadas y dictamina **A favor** o **En contra** del reportante.
5. Según la decisión, el reporte se marca como resuelto y se actualiza el estado del usuario.

## Roles

### Usuario normal (rider / driver)

- Accede a: inicio, buscar usuarios, ver reviews recibidas, ver reportes (enviados y recibidos), perfil con estadísticas.
- Tiene bloqueos por review o reporte pendiente.
- Puede escribir reviews y cargar evidencias de reportes.

### Administrador (feedbackAdmin)

- Accede a panel de administración con gestión de usuarios y reportes.
- Puede listar, buscar y filtrar usuarios por nombre y rol.
- Puede listar, buscar y filtrar reportes por estado, ordenados por prioridad.
- Resuelve reportes decidiendo a favor o en contra del reportante.
- No tiene bloqueos de reviews/reportes.

## Credenciales de prueba

### Admin

| Email | Contraseña |
| ----- | ---------- |
| <adminfeedback+clerk_test@iaw.com> | proporcionada por la catedra | 

### Driver

| Email | Contraseña | Notas |
| ----- | ---------- | ----- |
|<rider+clerk_test@iaw.com> |proporcionada por la catedra  | Flujo de un reporte pendiente. |

### Rider

| Email | Contraseña | Notas |
| ----- | ---------- | ----- |
| <driver+clerk_test@iaw.com> |proporcionada por la catedra  | Flujo de una reviews pendientes. |

## Otros Usuarios

### Driver

| Email | Contraseña |
| ----- | ---------- |
| <macarena+clerk_test@example.com> | contraseña$2026 |
| <federico+clerk_test@gmail.com> | contraseña$2026 |
| <giuli+clerk_test@gmail.com> | contraseña$2026 |

### Rider

| Email | Contraseña | Notas |
| ----- | ---------- | ----- |
| <recalde+clerk_test@example.com> | contraseña$2026 | tiene 2 reviews pendientes. |
| <agustin+clerk_test@example.com> |contraseña$2026| tiene flujo de 2 reportes pendientes. |
| <tiagodriver2+clerk_test@gmail.com> | contraseña$2026 | tiene una review y un reporte por hacer. |

> Las contraseñas corresponden a las configuradas en Clerk.

## Scripts

```bash
npm run dev       # Desarrollo
npm run build     # Build de producción
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string a PostgreSQL (Neon) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clave pública de Clerk |
| `CLERK_SECRET_KEY` | Clave secreta de Clerk |
| `WEBHOOK_SECRET` | Secreto para verificar webhooks de Clerk |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Ruta de registro (siempre `/login`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirección post-login (`/`) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
