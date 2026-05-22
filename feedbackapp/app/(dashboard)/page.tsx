'use client';

import { Star, Briefcase, Calendar } from 'lucide-react';

// Mock data
const reviewsPendientes = [
  {
    id: '1',
    trabajo: {
      tipoDeTrabajo: 'Plomería',
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-10',
    },
    usuarioAEvaluar: {
      nombre: 'Carlos',
      apellido: 'Pérez',
    },
  },
  {
    id: '2',
    trabajo: {
      tipoDeTrabajo: 'Electricidad',
      fechaInicio: '2025-04-15',
      fechaFin: '2025-05-05',
    },
    usuarioAEvaluar: {
      nombre: 'María',
      apellido: 'López',
    },
  },
  {
    id: '3',
    trabajo: {
      tipoDeTrabajo: 'Carpintería',
      fechaInicio: '2025-03-20',
      fechaFin: '2025-04-30',
    },
    usuarioAEvaluar: {
      nombre: 'Juan',
      apellido: 'González',
    },
  },
];

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

export default function DashboardHome() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[#c392dd] font-semibold mb-2">
          Feedback App
        </div>
        <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
          ¿Qué querés hacer hoy?
        </h1>
        <p className="text-[#c392dd]">
          Accedé a las principales funciones de la app
        </p>
      </div>

      {/* Reviews pendientes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviewsPendientes.map((review) => {
          const initials = getInitials(
            review.usuarioAEvaluar.nombre,
            review.usuarioAEvaluar.apellido
          );

          return (
            <a
              key={review.id}
              href={`/reviews/realizar/${review.id}`}
              className="bg-[#3a1f52] rounded-xl border border-[#8d62a5]/20 p-5 hover:border-[#f500f1]/40 hover:bg-[#4a2a6a] hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer block"
            >
              {/* Avatar y nombre */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#8d62a5] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#fbdaf9] truncate">
                    {review.usuarioAEvaluar.nombre} {review.usuarioAEvaluar.apellido}
                  </p>
                  <p className="text-xs text-[#8d62a5] truncate">Trabajo pendiente</p>
                </div>
              </div>

              {/* Info del trabajo */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-[#c392dd] flex-shrink-0" />
                  <span className="text-xs text-[#fbdaf9] truncate">
                    {review.trabajo.tipoDeTrabajo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#c392dd] flex-shrink-0" />
                  <span className="text-xs text-[#8d62a5] truncate">
                    {new Date(review.trabajo.fechaFin).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 flex items-center gap-2 text-[#f500f1] text-xs font-medium">
                <Star size={14} />
                <span>Evaluar ahora</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
