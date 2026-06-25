'use client';

import { Star, Briefcase, Calendar, Send, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import type { Trabajo, UsuarioBase } from '@/types';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useRouter } from 'next/navigation';

const ratingLabels: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

import { formatDate } from '@/lib/dates'
import { getRolLabel } from '@/lib/roles'

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function sameDay(a: Date | string | null | undefined, b: Date | string | null | undefined): boolean {
  if (!a || !b) return false
  const da = typeof a === 'string' ? new Date(a) : a
  const db = typeof b === 'string' ? new Date(b) : b
  return da.toDateString() === db.toDateString()
}

interface RealizarReviewFormProps {
  reviewId: string;
  trabajo: Trabajo;
  usuarioAEvaluar: UsuarioBase;
}

export default function RealizarReviewForm({
  reviewId,
  trabajo,
  usuarioAEvaluar,
}: RealizarReviewFormProps) {
  const {
    puntaje,
    hoverPuntaje,
    review,
    enviando,
    enviado,
    errores,
    onPuntajeClick,
    onPuntajeEnter,
    onPuntajeLeave,
    onReviewChange,
    onSubmit,
  } = useReviewForm(reviewId);
  const router = useRouter();

  if (enviado) {
    return (
              <div className="bg-brand-bg px-[clamp(1rem,4vw,2rem)]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-brand-accent-mid hover:text-brand-text-light transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Volver</span>
        </button>
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-brand-card rounded-xl border border-brand-accent-soft/20 p-8 max-w-xl w-full text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-brand-accent-strong" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text-light mb-4">
              Ã‚Â¡Review completada!
            </h2>
            <p className="text-brand-accent-mid">
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
    <div className="bg-brand-bg px-[clamp(1rem,4vw,2rem)]">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-brand-accent-mid hover:text-brand-text-light transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Volver</span>
        </button>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={16} className="text-brand-accent-strong" />
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-accent-mid">
            Review Pendiente
          </span>
        </div>
        <h1 className="text-4xl font-bold text-brand-text-light mb-3">
          CompletÃƒÂ¡ tu review
        </h1>
        <p className="text-brand-accent-mid">
          ValorÃƒÂ¡ tu experiencia con este usuario
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-brand-card rounded-xl border border-brand-accent-soft/20 p-6">
          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest font-semibold text-brand-accent-mid mb-4 block">
              EstÃƒÂ¡s evaluando a
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-accent-soft flex items-center justify-center">
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-brand-text-light">
                  {usuarioAEvaluar.nombre} {usuarioAEvaluar.apellido}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 bg-brand-accent-soft/20 rounded-full text-xs text-brand-accent-mid font-medium">
                  {getRolLabel(usuarioAEvaluar.rol)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-brand-accent-soft/20 mb-6" />

          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest font-semibold text-brand-accent-mid mb-4 block">
              Trabajo realizado
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-brand-accent-mid flex-shrink-0" />
                <span className="text-sm text-brand-text-light">{trabajo.tipoDeTrabajo}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-brand-accent-mid flex-shrink-0" />
                <span className="text-sm text-brand-text-light">
                  {trabajo.fechaInicio && trabajo.fechaFin && sameDay(trabajo.fechaInicio, trabajo.fechaFin)
                    ? formatDate(trabajo.fechaInicio)
                    : `${trabajo.fechaInicio ? formatDate(trabajo.fechaInicio) : 'Fecha no definida'} Ã¢â€ â€™ ${trabajo.fechaFin ? formatDate(trabajo.fechaFin) : 'Fecha no definida'}`
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-brand-accent-soft/20 mb-6" />

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-brand-text-light mb-3 block">
                ValoraciÃƒÂ³n
              </label>
              <div className="flex gap-3 mb-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isSelected = puntaje !== null && star <= puntaje;
                  const isHovered = hoverPuntaje !== null && star <= hoverPuntaje;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onPuntajeClick(star)}
                      onMouseEnter={() => onPuntajeEnter(star)}
                      onMouseLeave={onPuntajeLeave}
                      className="transition-all duration-200 focus:outline-none"
                      aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
                    >
                      <Star
                        size={32}
                        className={`${
                          isSelected || isHovered
                            ? 'fill-brand-accent-strong text-brand-accent-strong scale-110'
                            : 'text-brand-accent-soft opacity-30'
                        } transition-all duration-200`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-sm font-medium">
                {puntaje !== null ? (
                  <span className="text-brand-accent-mid">{ratingLabels[puntaje]}</span>
                ) : (
                  <span className="text-brand-accent-mid">SeleccionÃƒÂ¡ una valoraciÃƒÂ³n</span>
                )}
              </p>
              {errores.puntaje && (
                <p className="text-red-400 text-xs mt-2 text-center">{errores.puntaje}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-text-light mb-2 block">
                Tu experiencia
              </label>
              <textarea
                value={review}
                onChange={onReviewChange}
                placeholder="ContÃƒÂ¡ tu experiencia con este usuario..."
                rows={5}
                className="w-full bg-brand-bg border border-brand-accent-soft rounded-lg text-brand-text-light placeholder-brand-accent-soft/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent-strong transition-all duration-200 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div>
                  {errores.review && (
                    <p className="text-red-400 text-xs">{errores.review}</p>
                  )}
                  {errores.api && (
                    <p className="text-red-400 text-xs">{errores.api}</p>
                  )}
                </div>
                <span className="text-xs text-brand-accent-mid">{review.length} / 1000</span>
              </div>
            </div>

              <button
                onClick={onSubmit}
                disabled={puntaje === null || enviando}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  puntaje !== null && !enviando
                    ? 'bg-brand-accent-strong text-white cursor-pointer hover:scale-[1.02]'
                    : 'bg-brand-accent-strong text-white opacity-50 cursor-not-allowed'
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