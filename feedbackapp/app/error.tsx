'use client';

import ErrorDisplay from '@/components/ErrorDisplay';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <ErrorDisplay
          code="500"
          titulo="Algo salió mal"
          descripcion="Ocurrió un error inesperado. Intentalo de nuevo o volvé al inicio."
          botonTexto="Reintentar"
          botonAccion={reset}
        />
      </body>
    </html>
  );
}
