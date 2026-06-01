import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Briefcase } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import StarRating from '@/components/StarRating';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: Date | null): string {
  if (!date) return 'Fecha no disponible';
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      autor: true,
      trabajo: true,
    },
  });

  if (!review) {
    notFound();
  }

  const tipoLabel = review.autor.rol === 'rider' ? 'Cliente' : 'Trabajador';

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
          className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2"
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
              className="bg-[#8d62a5]/30 text-[#fbdaf9] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full font-medium whitespace-nowrap"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              {tipoLabel}
            </span>
          </div>
        </div>

        {/* Puntaje */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          {review.valoracion !== null && (
            <>
              <div className="mb-[clamp(0.75rem,2vw,1rem)]">
                <StarRating rating={review.valoracion} size={28} />
              </div>
              <div
                className="font-gilroy font-bold text-[#f500f1]"
                style={{ fontSize: "clamp(1.5rem, 4vw, 1.75rem)" }}
              >
                {review.valoracion} / 5
              </div>
            </>
          )}
        </div>

        {/* Separador */}
        <div className="border-t border-[#8d62a5]/20 my-[clamp(1.5rem,4vw,2rem)]" />

        {/* Texto de review */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <p
            className="text-[#fbdaf9] leading-relaxed"
            style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
          >
            {review.review ?? 'Sin comentario'}
          </p>
        </div>

        {/* Separador */}
        <div className="border-t border-[#8d62a5]/20 my-[clamp(1.5rem,4vw,2rem)]" />

        {/* Trabajo relacionado */}
        <div className="mb-[clamp(1.5rem,4vw,2rem)]">
          <p
            className="text-[#c392dd] font-semibold uppercase tracking-wider mb-[clamp(0.75rem,2vw,1rem)]"
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
                {formatDate(review.trabajo.fechaFin)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
