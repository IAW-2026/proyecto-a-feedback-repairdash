'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Briefcase, Calendar, Send, AlertCircle, CheckCircle } from 'lucide-react';

// Rating labels
const ratingLabels: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Extract initials from name
function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

interface Trabajo {
  id: string;
  tipoDeTrabajo: string;
  fechaInicio: Date;
  fechaFin: Date | null;
}

interface UsuarioAEvaluar {
  id: string;
  nombre: string | null;
  apellido: string | null;
  rol: string;
}

interface RealizarReviewFormProps {
  reviewId: string;
  trabajo: Trabajo;
  usuarioAEvaluar: UsuarioAEvaluar;
}

export default function RealizarReviewForm({
  reviewId,
  trabajo,
  usuarioAEvaluar,
}: RealizarReviewFormProps) {
  const router = useRouter();

  const [puntaje, setPuntaje] = useState<number | null>(null);
  const [hoverPuntaje, setHoverPuntaje] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState<{
    puntaje?: string;
    review?: string;
    api?: string;
  }>({});

  // Validar y enviar
  const handleEnviar = async () => {
    const nuevosErrores: { puntaje?: string; review?: string; api?: string } =
      {};

    if (puntaje === null) {
      nuevosErrores.puntaje = 'Seleccioná un puntaje para continuar';
    }

    if (review.length < 10) {
      nuevosErrores.review =
        'La opinión debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true);
      setErrores({});

      try {
        const response = await fetch(`/api/reviews/realizar`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewId,
            valoracion: puntaje,
            review,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            setErrores({ api: data.error || 'Error de validación' });
          } else {
            setErrores({
              api: data.error || 'Hubo un error al enviar la review',
            });
          }
          setEnviando(false);
          return;
        }

        setEnviando(false);
        setEnviado(true);

        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      } catch (error) {
        console.error('Error enviando review:', error);
        setErrores({ api: 'Hubo un error al enviar la review' });
        setEnviando(false);
      }
    }
  };

  // Pantalla de éxito
  if (enviado) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-[#3a1f52] rounded-xl border border-[#8d62a5]/20 p-8 max-w-xl w-full text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-[#f500f1]" />
            </div>
            <h2 className="text-2xl font-bold text-[#fbdaf9] mb-4">
              ¡Review completada!
            </h2>
            <p className="text-[#c392dd]">
              Gracias por tu feedback. Redirigiendo...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const initials = getInitials(
    usuarioAEvaluar.nombre || '',
    usuarioAEvaluar.apellido || ''
  );

  return (
    <div className="p-8">
      {/* Header de sección — FUERA de la card */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-[#f500f1]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#c392dd]">
            Review Pendiente
          </span>
        </div>
        <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
          Antes de continuar...
        </h1>
        <p className="text-[#c392dd]">
          Tenés una review pendiente. Completala para seguir usando la app.
        </p>
      </div>

      {/* Card con formulario */}
      <div className="max-w-2xl">
        <div className="bg-[#3a1f52] rounded-xl border border-[#8d62a5]/20 p-6">
          {/* Sección 1: Usuario a evaluar */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#8d62a5] mb-4 block">
              Estás evaluando a
            </label>

            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#8d62a5] flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {initials}
                </span>
              </div>

              {/* Nombre */}
              <div className="text-center">
                <h2 className="text-lg font-bold text-[#fbdaf9]">
                  {usuarioAEvaluar.nombre} {usuarioAEvaluar.apellido}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 bg-[#8d62a5]/20 rounded-full text-xs text-[#c392dd] font-medium">
                  {usuarioAEvaluar.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-[#8d62a5]/20 mb-6" />

          {/* Sección 2: Trabajo realizado */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest font-semibold text-[#8d62a5] mb-4 block">
              Trabajo realizado
            </label>

            <div className="space-y-3">
              {/* Tipo de trabajo */}
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-[#c392dd] flex-shrink-0" />
                <span className="text-sm text-[#fbdaf9]">
                  {trabajo.tipoDeTrabajo}
                </span>
              </div>

              {/* Rango de fechas */}
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-[#c392dd] flex-shrink-0" />
                <span className="text-sm text-[#fbdaf9]">
                  {formatDate(trabajo.fechaInicio.toString())} →{' '}
                  {trabajo.fechaFin ? formatDate(trabajo.fechaFin.toString()) : 'Fecha no definida'}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-[#8d62a5]/20 mb-6" />

          {/* Sección 3: Formulario */}
          <div className="space-y-6">
            {/* Campo 1: Puntaje */}
            <div>
              <label className="text-sm font-semibold text-[#fbdaf9] mb-3 block">
                Calificación
              </label>

              {/* Estrellas interactivas */}
              <div className="flex gap-3 mb-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isSelected = puntaje !== null && star <= puntaje;
                  const isHovered =
                    hoverPuntaje !== null && star <= hoverPuntaje;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setPuntaje(star);
                        setErrores({ ...errores, puntaje: undefined });
                      }}
                      onMouseEnter={() => setHoverPuntaje(star)}
                      onMouseLeave={() => setHoverPuntaje(null)}
                      className="transition-all duration-200 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          isSelected || isHovered
                            ? 'fill-[#f500f1] text-[#f500f1] scale-110'
                            : 'text-[#8d62a5] opacity-30'
                        } transition-all duration-200`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Texto dinámico del puntaje */}
              <p className="text-center text-sm font-medium">
                {puntaje !== null ? (
                  <span className="text-[#c392dd]">
                    {ratingLabels[puntaje]}
                  </span>
                ) : (
                  <span className="text-[#8d62a5]">
                    Seleccioná un puntaje
                  </span>
                )}
              </p>

              {/* Error puntaje */}
              {errores.puntaje && (
                <p className="text-red-400 text-xs mt-2 text-center">
                  {errores.puntaje}
                </p>
              )}
            </div>

            {/* Campo 2: Textarea */}
            <div>
              <label className="text-sm font-semibold text-[#fbdaf9] mb-2 block">
                Tu opinión
              </label>

              <textarea
                value={review}
                onChange={(e) => {
                  setReview(e.target.value.slice(0, 1000));
                  setErrores({ ...errores, review: undefined });
                }}
                placeholder="Contá tu experiencia con este usuario..."
                rows={5}
                className="w-full bg-[#271033] border border-[#8d62a5] rounded-lg text-[#fbdaf9] placeholder-[#8d62a5]/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f500f1] transition-all duration-200 resize-none"
              />

              {/* Contador y error */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  {errores.review && (
                    <p className="text-red-400 text-xs">
                      {errores.review}
                    </p>
                  )}
                  {errores.api && (
                    <p className="text-red-400 text-xs">{errores.api}</p>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    review.length > 1000
                      ? 'text-red-400 font-semibold'
                      : review.length < 10
                      ? 'text-red-400'
                      : 'text-[#8d62a5]'
                  }`}
                >
                  {review.length} / 1000
                </span>
              </div>
            </div>

            {/* Botón enviar */}
            <button
              onClick={handleEnviar}
              disabled={
                puntaje === null ||
                review.length < 10 ||
                review.length > 1000 ||
                enviando
              }
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                puntaje !== null &&
                review.length >= 10 &&
                review.length <= 1000 &&
                !enviando
                  ? 'bg-[#f500f1] text-white cursor-pointer hover:scale-[1.02]'
                  : 'bg-[#f500f1] text-white opacity-50 cursor-not-allowed'
              }`}
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}