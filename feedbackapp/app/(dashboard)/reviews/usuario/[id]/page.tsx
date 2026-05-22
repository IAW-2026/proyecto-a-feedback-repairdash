import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';

// Mock data - perfil de reviews de un usuario específico
const usuario = {
  id: "u1",
  nombre: "Carlos",
  apellido: "Pérez",
  tipo: "Trabajador" as const,
  valoracionPromedio: 4.3,
  totalReviews: 8,
  distribucion: { 5: 5, 4: 2, 3: 1, 2: 0, 1: 0 },
  reviews: [
    {
      id: "r1",
      valoracion: 5,
      review: "Excelente trabajo, muy puntual y prolijo.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-05-10",
    },
    {
      id: "r2",
      valoracion: 5,
      review: "Muy buen profesional, resolvió todo rápido.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-04-15",
    },
    {
      id: "r3",
      valoracion: 3,
      review:
        "Trabajo correcto pero tardó más de lo esperado.",
      tipoDeTrabajo: "Gasista",
      fecha: "2025-03-20",
    },
    {
      id: "r4",
      valoracion: 4,
      review:
        "Bueno en general, podría mejorar en algunos detalles.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-02-28",
    },
    {
      id: "r5",
      valoracion: 5,
      review: "Impecable, muy profesional y confiable.",
      tipoDeTrabajo: "Electricidad",
      fecha: "2025-01-20",
    },
    {
      id: "r6",
      valoracion: 4,
      review: "Trabajo de calidad, cumplió con lo prometido.",
      tipoDeTrabajo: "Pintura",
      fecha: "2024-12-30",
    },
    {
      id: "r7",
      valoracion: 5,
      review: "Excelente, totalmente recomendado.",
      tipoDeTrabajo: "Plomería",
      fecha: "2024-11-25",
    },
    {
      id: "r8",
      valoracion: 5,
      review:
        "Profesional dedicado, conoce muy bien su oficio.",
      tipoDeTrabajo: "Gasista",
      fecha: "2024-10-15",
    },
  ],
};

function StarRating({
  rating,
  max = 5,
  size = 16,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <div className="flex gap-[clamp(0.25rem,0.5vw,0.5rem)]">
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

function RatingBar({
  rating,
  count,
  total,
}: {
  rating: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)]">
      <div className="flex items-center gap-1 w-12 flex-shrink-0">
        <span
          className="font-gilroy font-bold text-[#fbdaf9]"
          style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
        >
          {rating}
        </span>
        <Star size={14} className="fill-[#f500f1] text-[#f500f1]" />
      </div>
      <div className="flex-1 h-[clamp(0.5rem,1vw,0.75rem)] bg-[#8d62a5]/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#f500f1] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className="text-[#8d62a5] w-8 text-right flex-shrink-0"
        style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
      >
        {count}
      </span>
    </div>
  );
}

export default function UserReviewsPage() {
  return (
    <div className="w-full">
      {/* Botón Volver */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-[#f500f1] hover:text-[#f500f1]/80 transition-colors font-medium"
          style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
        >
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <p
          className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2"
          style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
        >
          Perfil de Usuario
        </p>
        <h1
          className="font-gilroy font-bold text-[#fbdaf9]"
          style={{ fontSize: "clamp(1.75rem, 6vw, 2.25rem)" }}
        >
          {usuario.nombre} {usuario.apellido}
        </h1>
      </div>

      {/* Sección superior - Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,2.5rem)] mb-[clamp(2rem,6vw,3rem)]">
        {/* Columna izquierda - Info general */}
        <div>
          <div className="mb-[clamp(1rem,3vw,1.5rem)]">
            <span
              className="bg-[#8d62a5]/30 text-[#c392dd] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full font-medium inline-block whitespace-nowrap"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              {usuario.tipo}
            </span>
          </div>

          {/* Rating */}
          <div className="mb-[clamp(1rem,3vw,1.5rem)]">
            <div
              className="font-gilroy font-bold text-[#f500f1] mb-2"
              style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)" }}
            >
              {usuario.valoracionPromedio}
            </div>
            <StarRating rating={usuario.valoracionPromedio} size={20} />
            <p
              className="text-[#8d62a5] mt-2"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              {usuario.totalReviews} calificaciones
            </p>
          </div>
        </div>

        {/* Columna derecha - Distribución */}
        <div className="space-y-[clamp(0.75rem,2vw,1rem)]">
          <p
            className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-[clamp(1rem,3vw,1.5rem)]"
            style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
          >
            Distribución de puntajes
          </p>
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={usuario.distribucion[rating as keyof typeof usuario.distribucion]}
              total={usuario.totalReviews}
            />
          ))}
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-[#8d62a5]/20 my-[clamp(2rem,6vw,3rem)]" />

      {/* Sección inferior - Lista de reviews */}
      <div>
        <h3
          className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1.5rem,4vw,2rem)]"
          style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}
        >
          Opiniones ({usuario.totalReviews})
        </h3>

        <div className="space-y-[clamp(1.5rem,4vw,2rem)]">
          {usuario.reviews.map((review, index) => (
            <div key={review.id}>
              <div className="mb-[clamp(0.75rem,2vw,1rem)]">
                <div className="flex items-start justify-between gap-[clamp(0.75rem,2vw,1rem)] mb-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[#c392dd]"
                      style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
                    >
                      {review.tipoDeTrabajo}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <StarRating rating={review.valoracion} size={14} />
                    <p
                      className="text-[#8d62a5] mt-1"
                      style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)" }}
                    >
                      {review.fecha}
                    </p>
                  </div>
                </div>

                <p
                  className="text-[#fbdaf9]"
                  style={{ fontSize: "clamp(0.875rem, 2.5vw, 1rem)" }}
                >
                  {review.review}
                </p>
              </div>

              {index < usuario.reviews.length - 1 && (
                <div className="border-t border-[#8d62a5]/20 mt-[clamp(1rem,3vw,1.5rem)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
