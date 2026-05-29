import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';
import ReportFormClient from '../ReportFormClient';

/**
 * Página Server Component para resolver un reporte pendiente.
 *
 * Ruta: /reportes/[id]/nuevo
 *
 * Validaciones:
 * - El usuario debe estar autenticado
 * - El usuario debe ser el reportante (idReportante)
 * - El reporte debe existir
 * - El reporte debe estar incompleto (estaCompleto === false)
 */
export default async function ResolveReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reporteId } = await params;
  const user = await getCurrentUser();

  // VALIDACIÓN: Usuario autenticado
  if (!user) {
    redirect('/login');
  }

  // BUSCAR: El reporte por ID
  const reporte = await prisma.reporte.findUnique({
    where: { id: reporteId },
    include: {
      trabajo: true,
      reportado: true,
      reportante: true,
    },
  });

  // VALIDACIÓN: Reporte existe
  if (!reporte) {
    redirect('/reportes?error=not_found');
  }

  // VALIDACIÓN: El usuario es el reportante
  if (reporte.idReportante !== user.id) {
    redirect('/reportes?error=unauthorized');
  }

  // VALIDACIÓN: El reporte está incompleto
  if (reporte.estaCompleto) {
    redirect('/reportes?error=already_completed');
  }

  // TODO: Aquí puedes agregar más validaciones según tus reglas de negocio:
  // - Verificar que el trabajo existe y es válido
  // - Validar estados específicos del trabajo
  // - Verificar tiempos límite para resolver el reporte

  return (
    <div className="w-full">
      {/* TODO: Puedes agregar un header aquí si lo deseas */}
      <ReportFormClient
        reporteId={reporteId}
        reportado={reporte.reportado}
        trabajo={reporte.trabajo}
      />
    </div>
  );
}
