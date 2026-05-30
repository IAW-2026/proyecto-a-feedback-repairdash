'use client';

import { usePathname } from 'next/navigation';
import PendingReportScreen from './PendingReportScreen';
import PendingReviewScreen from './PendingReviewScreen';

interface PendingTasksGuardRendererProps {
  reportePendiente: any;
  reviewPendiente: any;
  children: React.ReactNode;
}

/**
 * Componente Cliente que renderiza el guard o el contenido normal.
 * 
 * Decide si bloquear al usuario basándose en:
 * 1. Si hay tareas pendientes (reportes o reviews)
 * 2. Si el usuario está en una ruta de resolución (bypass)
 * 
 * Rutas que permiten bypass (usuario puede resolver sin bloqueo):
 * - /reportes/[id]/nuevo - formulario de resolución de reportes
 * - /reviews/realizar/[id] - formulario de resolución de reviews
 */
export default function PendingTasksGuardRenderer({
  reportePendiente,
  reviewPendiente,
  children,
}: PendingTasksGuardRendererProps) {
  const pathname = usePathname();

  // ✅ BYPASS: Si estamos en rutas de resolución, permitir acceso sin bloquear
  const isResolvingReport = pathname.includes('/reportes/') && pathname.includes('/nuevo');
  const isResolvingReview = pathname.includes('/reviews/realizar/');

  if (isResolvingReport || isResolvingReview) {
    // Permitir acceso directo a las páginas de resolución
    return <>{children}</>;
  }

  // ✅ BLOQUEO: Si hay reporte pendiente, mostrar pantalla de bloqueo
  if (reportePendiente) {
    return (
      <PendingReportScreen
        reporte={reportePendiente}
        trabajo={reportePendiente.trabajo}
        reportado={reportePendiente.reportado}
        userId={reportePendiente.idReportante}
      />
    );
  }

  // ✅ BLOQUEO: Si hay review pendiente, mostrar pantalla de bloqueo
  if (reviewPendiente) {
    return (
      <PendingReviewScreen
        trabajo={reviewPendiente.trabajo}
        userId={reviewPendiente.idUsuario}
      />
    );
  }

  // ✅ SIN TAREAS: Permitir acceso normal al dashboard
  return <>{children}</>;
}
