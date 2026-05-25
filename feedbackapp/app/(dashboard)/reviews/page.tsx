import { Star, User, Calendar } from 'lucide-react';import PendingReviewGuard from '@/components/PendingReviewGuard';
// Mock data - reviews sobre mí
const myReviewProfile = {
  nombre: "Carlos",
  apellido: "Méndez",
  tipo: "Trabajador" as const,
  valoracionPromedio: 4.3,
  totalReviews: 8,
  distribucion: { 5: 5, 4: 2, 3: 1, 2: 0, 1: 0 },
  reviews: [
    {
      id: "r1",
      autor: { id: "u1", nombre: "Juan", apellido: "González", tipo: "Cliente" as const },
      valoracion: 5,
      review:
        "Excelente trabajo, muy puntual y prolijo. Resolvió el problema rápidamente y dejó todo limpio.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-05-10",
    },
    {
      id: "r2",
      autor: { id: "u2", nombre: "María", apellido: "López", tipo: "Cliente" as const },
      valoracion: 5,
      review: "Muy buen profesional, resolvió todo rápido y de excelente calidad.",
      tipoDeTrabajo: "Electricidad",
      fecha: "2025-04-15",
    },
    {
      id: "r3",
      autor: { id: "u3", nombre: "Pedro", apellido: "Sánchez", tipo: "Cliente" as const },
      valoracion: 4,
      review:
        "Trabajo correcto, llegó a tiempo y fue profesional. Recomendado.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-03-20",
    },
    {
      id: "r4",
      autor: { id: "u4", nombre: "Ana", apellido: "Martínez", tipo: "Cliente" as const },
      valoracion: 4,
      review:
        "Muy bueno en general. Podría haber mejorado un poco en los detalles finales.",
      tipoDeTrabajo: "Pintura",
      fecha: "2025-02-28",
    },
    {
      id: "r5",
      autor: { id: "u5", nombre: "Rodrigo", apellido: "García", tipo: "Cliente" as const },
      valoracion: 3,
      review:
        "Trabajo correcto pero tardó más de lo esperado. De todas formas, el resultado fue bueno.",
      tipoDeTrabajo: "Gasista",
      fecha: "2025-02-10",
    },
    {
      id: "r6",
      autor: { id: "u1", nombre: "Juan", apellido: "González", tipo: "Cliente" as const },
      valoracion: 5,
      review:
        "Segunda vez que lo contrató y nuevamente excelente. Totalmente confiable.",
      tipoDeTrabajo: "Plomería",
      fecha: "2025-01-15",
    },
    {
      id: "r7",
      autor: { id: "u6", nombre: "Laura", apellido: "Fernández", tipo: "Cliente" as const },
      valoracion: 5,
      review: "Impecable en todos los aspectos. Muy recomendado.",
      tipoDeTrabajo: "Electricidad",
      fecha: "2024-12-20",
    },
    {
      id: "r8",
      autor: { id: "u7", nombre: "Diego", apellido: "Ruiz", tipo: "Cliente" as const },
      valoracion: 5,
      review:
        "Profesional de verdad. Conoce su oficio y se nota la dedicación.",
      tipoDeTrabajo: "Plomería",
      fecha: "2024-11-30",
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

export default function MyReviewsPage() {
  return (
    <PendingReviewGuard>
      <div className="w-full">
      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <p
          className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2"
          style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
        >
          Mis Reviews
        </p>
        <h1
          className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]"
          style={{ fontSize: "clamp(1.75rem, 6vw, 2.25rem)" }}
        >
          Mi perfil
        </h1>
        <p
          className="text-[#c392dd]"
          style={{ fontSize: "clamp(0.875rem, 2.5vw, 1rem)" }}
        >
          Resumen de valoraciones recibidas
        </p>
      </div>

      {/* Sección superior - Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,4vw,2.5rem)] mb-[clamp(2rem,6vw,3rem)]">
        {/* Columna izquierda - Info general */}
        <div>
          <div className="mb-[clamp(1rem,3vw,1.5rem)]">
            <h2
              className="font-gilroy font-bold text-[#fbdaf9] mb-2"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}
            >
              {myReviewProfile.nombre} {myReviewProfile.apellido}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="bg-[#8d62a5]/30 text-[#c392dd] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full font-medium whitespace-nowrap"
                style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
              >
                {myReviewProfile.tipo}
              </span>
              <span
                className="bg-[#f500f1]/20 text-[#fbdaf9] border border-[#f500f1]/40 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full font-medium flex items-center gap-1 whitespace-nowrap"
                style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
              >
                <User size={14} />
                Este es tu perfil
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-[clamp(1rem,3vw,1.5rem)]">
            <div
              className="font-gilroy font-bold text-[#f500f1] mb-2"
              style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)" }}
            >
              {myReviewProfile.valoracionPromedio}
            </div>
            <StarRating rating={myReviewProfile.valoracionPromedio} size={20} />
            <p
              className="text-[#8d62a5] mt-2"
              style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
            >
              {myReviewProfile.totalReviews} calificaciones
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
              count={myReviewProfile.distribucion[rating as keyof typeof myReviewProfile.distribucion]}
              total={myReviewProfile.totalReviews}
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
          Opiniones ({myReviewProfile.totalReviews})
        </h3>

        <div className="space-y-[clamp(1.5rem,4vw,2rem)]">
          {myReviewProfile.reviews.map((review, index) => (
            <div key={review.id}>
              <div className="mb-[clamp(0.75rem,2vw,1rem)]">
                <div className="flex items-start justify-between gap-[clamp(0.75rem,2vw,1rem)] mb-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-gilroy font-bold text-[#fbdaf9]"
                      style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
                    >
                      {review.autor.nombre} {review.autor.apellido}
                    </div>
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

              {index < myReviewProfile.reviews.length - 1 && (
                <div className="border-t border-[#8d62a5]/20 mt-[clamp(1rem,3vw,1.5rem)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </PendingReviewGuard>
  );
}
