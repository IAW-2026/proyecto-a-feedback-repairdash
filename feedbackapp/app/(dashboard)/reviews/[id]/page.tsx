import Link from 'next/link';
import { Star, ArrowLeft, Calendar, Briefcase, ChevronRight } from 'lucide-react';

// Mock data - una review específica
const review = {
  id: "1",
  autor: {
    id: "u1",
    nombre: "Carlos",
    apellido: "Pérez",
    tipo: "Cliente" as const,
  },
  valoracion: 5,
  review:
    "Excelente trabajo, muy puntual y prolijo. Resolvió el problema rápidamente y dejó todo limpio. Sin dudas lo volvería a contratar.",
  trabajo: { tipoDeTrabajo: "Plomería", fechaFin: "2025-05-10" },
};

function StarRating({
  rating,
  max = 5,
  size = 24,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <div className="flex gap-[clamp(0.5rem,1vw,0.75rem)]">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.floor(rating)
              ? "fill-[#f500f1] text-[#f500f1]"
              : "text-[#8d62a5] opacity-30"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewDetailPage() {
  return (
    <div className="w-full">
      {/* Botón Volver */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1 text-[#f500f1] hover:text-[#f500f1]/80 transition-colors font-medium"
          style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
        >
          <ArrowLeft size={18} />
          <span>Volver a reviews</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <p
          className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2"
          style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
        >
          Detalle de Review
        </p>
        <h1
          className="font-gilroy font-bold text-[#fbdaf9]"
          style={{ fontSize: "clamp(1.75rem, 6vw, 2.25rem)" }}
        >
          Opinión
        </h1>
      </div>

      {/* Card principal */}
      <div className="bg-[#3a1f52] rounded-xl p-[clamp(1.5rem,4vw,2.5rem)] border border-[#8d62a5]/20 max-w-2xl mx-auto w-full">
        {/* Autor */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] flex-wrap">
            <h2
              className="font-gilroy font-bold text-[#fbdaf9]"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
            >
              {review.autor.nombre} {review.autor.apellido}
            </h2>
            <span
              className="bg-[#8d62a5]/30 text-[#c392dd] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full font-medium whitespace-nowrap"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              {review.autor.tipo}
            </span>
          </div>
        </div>

        {/* Puntaje */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <div className="mb-[clamp(0.75rem,2vw,1rem)]">
            <StarRating rating={review.valoracion} size={28} />
          </div>
          <div
            className="font-gilroy font-bold text-[#f500f1]"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.75rem)" }}
          >
            {review.valoracion} / 5
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-[#8d62a5]/20 my-[clamp(1.5rem,4vw,2rem)]" />

        {/* Texto de review */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <p
            className="text-[#fbdaf9] leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
          >
            {review.review}
          </p>
        </div>

        {/* Separador */}
        <div className="border-t border-[#8d62a5]/20 my-[clamp(1.5rem,4vw,2rem)]" />

        {/* Trabajo relacionado */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <p
            className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-[clamp(0.75rem,2vw,1rem)]"
            style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
          >
            Trabajo relacionado
          </p>
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] flex-wrap">
            <div className="flex items-center gap-1 text-[#fbdaf9]">
              <Briefcase size={18} />
              <span
                className="font-medium"
                style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
              >
                {review.trabajo.tipoDeTrabajo}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#c392dd]">
              <Calendar size={18} />
              <span style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
                {review.trabajo.fechaFin}
              </span>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-[#8d62a5]/20 my-[clamp(1.5rem,4vw,2rem)]" />

        {/* Link al perfil */}
        <Link
          href={`/reviews/usuario/${review.autor.id}`}
          className="inline-flex items-center gap-2 text-[#f500f1] hover:text-[#f500f1]/80 transition-colors font-medium group"
          style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
        >
          <span>
            Ver todas las reviews de {review.autor.nombre} {review.autor.apellido}
          </span>
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}
