import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'
/**
 * RUTAS PÚBLICAS (sin necesidad de login en Clerk)
 * 
 */
const isPublicRoute = createRouteMatcher([
  "/login(.*)",                    // UI: Página de login
  "/api/webhooks/clerk(.*)",       // Webhook: Clerk → BD
  "/api/reports(.*)",              // API: otras apps consultan reportes 
  "/api/reviews(.*)",              // API: otras apps leen/agregan reviews  
  "/api/trabajos(.*)",             // API: otras apps consultan trabajos  
  "/api/usuarios(.*)",             // API: Webhook que inyecta usuarios nuevos 
  "/"
]);

/**
 */
export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/sign-up')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};