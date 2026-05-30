'use client';

import ErrorDisplay from '@/components/ErrorDisplay';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      code="500"
      titulo="Error en el panel"
      descripcion="Ocurrió un error al cargar esta sección. Intentalo de nuevo."
      botonTexto="Reintentar"
      botonAccion={reset}
    />
  );
}
