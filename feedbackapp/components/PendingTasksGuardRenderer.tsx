'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import PendingReportScreen from './PendingReportScreen';
import PendingReviewScreen from './PendingReviewScreen';

interface PendingTasksGuardRendererProps {
  reportePendiente: any;
  reviewPendientes: any[];
  children: React.ReactNode;
}

export default function PendingTasksGuardRenderer({
  reportePendiente,
  reviewPendientes,
  children,
}: PendingTasksGuardRendererProps) {
  const pathname = usePathname();
  const [showReviewModal, setShowReviewModal] = useState(true);

  const isResolvingReport = pathname.includes('/reportes/') && pathname.includes('/nuevo');
  const isResolvingReview = pathname.includes('/reviews/realizar/');

  if (isResolvingReport || isResolvingReview) {
    return <>{children}</>;
  }

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

  if (reviewPendientes.length > 0 && showReviewModal) {
    return (
      <>
        {children}
        <PendingReviewScreen
          reviewCount={reviewPendientes.length}
          primerTrabajoId={reviewPendientes[0].idTrabajo}
          onClose={() => setShowReviewModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
}
