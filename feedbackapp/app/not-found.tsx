import type { Metadata } from 'next';
import ErrorDisplay from '@/components/ErrorDisplay';

export const metadata: Metadata = {
  title: '404 - Página no encontrada | Feedback App',
};

export default function NotFound() {
  return (
    <ErrorDisplay
      code="404"
      titulo="Página no encontrada"
      descripcion="La página que estás buscando no existe o fue movida. Revisá la URL o volvé al inicio."
      botonTexto="Volver al inicio"
      botonHref="/"
    />
  );
}
