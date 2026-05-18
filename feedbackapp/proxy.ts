import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Mapeamos lo que SI es de libre acceso
const isPublicRoute = createRouteMatcher([
  "/login(.*)",               // Pantalla de Login
  "/api/reports/public(.*)",  // API pública de reportes resueltos
  "/api/reports(.*)",         // APIs usadas por otras apps (token interno)
  "/api/reviews/user(.*)",    // APIs usadas por otras apps (token interno)
  "/api/trabajos(.*)",        // APIs usadas por otras apps (token interno)
  "/api/usuarios(.*)",        // API donde Rider App te inyecta los usuarios creados allá
  "/api/webhooks/clerk(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Si la pantalla o API no es pública, Clerk exige login. 
    // Si es una pantalla web y no hay sesión, Next.js lo redirecciona solo a /login
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
