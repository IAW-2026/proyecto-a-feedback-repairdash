import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'
/**
 * RUTAS PÚBLICAS (sin necesidad de login en Clerk)
 * 
 */
const isPublicRoute = createRouteMatcher([
  "/bienvenida",                   // UI: Página de bienvenida pública
  "/login(.*)",                    // UI: Página de login
  "/api/webhooks/clerk(.*)",       // Webhook: Clerk → BD
  "/api/reports(.*)",              // API: otras apps consultan reportes 
  "/api/reviews(.*)",              // API: otras apps leen/agregan reviews  
  "/api/trabajos(.*)",             // API: otras apps consultan trabajos   
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isUserRoute = createRouteMatcher(['/buscar(.*)', '/reviews(.*)', '/perfil(.*)']);
export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/sign-up')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!isPublicRoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/bienvenida', req.url))
    }

    const role = (sessionClaims?.metadata as any)?.role;
    const isAdmin = role === 'feedbackAdmin';

    if (isAdminRoute(req) && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isAdmin && isUserRoute(req)) {
      return NextResponse.redirect(new URL('/admin/usuarios', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};