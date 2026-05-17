import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const { sessionClaims } = await auth();

  // Validamos si en los metadatos de Clerk figura como admin
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const role = publicMetadata?.role;
  const isAdmin = role === "admin";

  // Si no es admin, lo sacamos de la pantalla inmediatamente
  if (!isAdmin) {
    redirect("/unauthorized"); // Creá una paginita simple que diga "No tenés permisos"
  }

  const prisma = getPrisma();
  // Si pasó el control, cargamos los datos de los reportes para resolver
  const reportesPendientes = await prisma.reporte.findMany({
    where: { resolucion: "SinResolver" },
    include: { trabajo: true }
  });

  return (
    <div className="p-8">
      <h1>Panel de Control de Administrador</h1>
     
    </div>
  );
}