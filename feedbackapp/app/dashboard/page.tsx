import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const user = await currentUser();

  const publicMetadata = user?.publicMetadata as { role?: string } | undefined;
  const isAdmin = publicMetadata?.role === "admin";

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-8">
      <h1>Panel de Control de Administrador</h1>
    </div>
  );
}
