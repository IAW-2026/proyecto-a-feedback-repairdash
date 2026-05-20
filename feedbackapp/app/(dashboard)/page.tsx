import { Star, Briefcase, Calendar } from 'lucide-react';

interface ReviewPendiente {
  id: string;
  nombreUsuario: string;
  tipoDeTrabajo: string;
  fechaFin: string;
}

const reviewsPendientes: ReviewPendiente[] = [
  { id: "1", nombreUsuario: "Carlos Pérez", tipoDeTrabajo: "Plomería", fechaFin: "2025-05-10" },
  { id: "2", nombreUsuario: "Laura Gómez", tipoDeTrabajo: "Electricidad", fechaFin: "2025-05-14" },
  { id: "3", nombreUsuario: "Marcos Silva", tipoDeTrabajo: "Pintura", fechaFin: "2025-05-17" },
];

export default function Home() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header de sección */}
      <div className="mb-12">
        <div className="text-xs uppercase tracking-widest text-brand-accent-mid font-semibold mb-2">
          Pendientes
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Reviews pendientes</h1>
        <p className="text-brand-accent-mid">Estos trabajos esperan tu valoración</p>
      </div>

      {/* Grid de cards */}
      {reviewsPendientes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsPendientes.map((review) => (
            <div
              key={review.id}
              className="review-card bg-brand-card rounded-xl p-6 border border-brand-accent-soft/20 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60 hover:shadow-xl hover:shadow-brand-accent-strong/20"
            >
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{review.nombreUsuario}</h3>
                  <p className="text-sm text-brand-accent-mid mt-1">{review.tipoDeTrabajo}</p>
                </div>
                <div className="bg-brand-accent-strong/10 p-2 rounded-lg">
                  <Star size={18} className="star-icon text-brand-accent-strong transition-transform duration-300" />
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-brand-accent-mid text-sm mb-6">
                <Calendar size={16} />
                <span>{formatDate(review.fechaFin)}</span>
              </div>

              {/* Botón */}
              <button className="w-full bg-brand-accent-strong hover:bg-brand-accent-strong text-white font-semibold py-3 rounded-lg transition-all duration-200 ease-out hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                <Briefcase size={18} className="briefcase-icon transition-transform duration-200" />
                Dejar review
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-brand-accent-soft/10 p-4 rounded-full mb-4">
            <Star size={48} className="text-brand-accent-mid" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sin reviews pendientes</h2>
          <p className="text-brand-accent-mid text-center">
            ¡Excelente! Completaste todas tus valoraciones. Estamos listos para los próximos trabajos.
          </p>
        </div>
      )}
    </div>
  );
}
