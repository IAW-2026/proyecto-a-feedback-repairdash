import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * RUTAS PÚBLICAS (sin necesidad de login en Clerk)
 * 
 */
const isPublicRoute = createRouteMatcher([
  "/login(.*)",                    // UI: Página de login
  "/api/webhooks/clerk(.*)",       // Webhook: Clerk → tu BD
  "/api/reports(.*)",              // API: otras apps consultan reportes (validación de key en route)
  "/api/reviews(.*)",              // API: otras apps leen/agregan reviews (validación de key en route)
  "/api/trabajos(.*)",             // API: otras apps consultan trabajos (validación de key en route)
  "/api/usuarios(.*)",             // API: Webhook que inyecta usuarios nuevos (validación de key en route)
]);

/**
 */
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    // Proteger: solo usuarios con sesión válida pueden acceder
    auth.protect(); 
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};