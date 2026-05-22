import { User, Mail, Lock, Star, Briefcase, AlertCircle, Clock } from 'lucide-react';

// Mock data - TODO: reemplazar con query a base de datos
const mockUser = {
  nombre: 'Carlos Méndez',
  email: 'carlos.mendez@email.com',
  trabajos: 8,
  ratingPromedio: 4.3,
  reportesFallados: 2,
  reportesPendientes: 3,
};

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
      <div className="flex gap-[clamp(0.25rem,0.5vw,0.5rem)]">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < Math.floor(rating) ? 'fill-[#f500f1] text-[#f500f1]' : 'text-[#8d62a5]'}
          />
        ))}
      </div>
      <span className="font-gilroy font-bold text-[#fbdaf9]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
        {rating} / {max}
      </span>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
          Mi Perfil
        </p>
        <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
          Información de cuenta
        </h1>
        <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
          Visualizá tus datos personales y estadísticas
        </p>
      </div>

      {/* Contenido principal */}
      <div className="space-y-[clamp(1rem,3vw,2rem)]">
        {/* Card 1: Datos del usuario */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
            <User size={24} className="text-[#c392dd] flex-shrink-0" />
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Datos Personales
            </p>
          </div>

          <div className="space-y-[clamp(1rem,3vw,1.5rem)]">
            <div>
              <label className="block text-[#8d62a5] uppercase font-semibold mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Nombre Completo
              </label>
              <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                <input
                  type="text"
                  value={mockUser.nombre}
                  disabled
                  className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] cursor-not-allowed opacity-60 min-h-[44px]"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                />
                <Lock size={20} className="text-[#8d62a5] flex-shrink-0" />
              </div>
              <p className="text-[#8d62a5] mt-[clamp(0.375rem,1vw,0.5rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Campo no editable
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#8d62a5] uppercase font-semibold mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Email
              </label>
              <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                <input
                  type="email"
                  value={mockUser.email}
                  disabled
                  className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] cursor-not-allowed opacity-60 min-h-[44px]"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                />
                <Mail size={20} className="text-[#8d62a5] flex-shrink-0" />
              </div>
              <p className="text-[#8d62a5] mt-[clamp(0.375rem,1vw,0.5rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Campo no editable
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Actividad Laboral */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
            <Briefcase size={24} className="text-[#c392dd] flex-shrink-0" />
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Actividad Laboral
            </p>
          </div>

          <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/30 text-center">
            <p className="text-[#8d62a5] uppercase font-semibold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Trabajos en los que te viste involucrado
            </p>
            <div className="font-gilroy font-bold text-[#f500f1]" style={{ fontSize: 'clamp(2.5rem, 8vw, 3rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
              {mockUser.trabajos}
            </div>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              proyectos completados
            </p>
          </div>
        </div>

        {/* Card 3: Rating Promedio */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
            <Star size={24} className="text-[#c392dd] flex-shrink-0" />
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Rating Promedio
            </p>
          </div>

          <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-[#8d62a5]/30">
            <p className="text-[#8d62a5] uppercase font-semibold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Calificación promedio recibida
            </p>
            <div className="flex items-center justify-center">
              {/* TODO: reemplazar con query a base de datos */}
              <StarRating rating={mockUser.ratingPromedio} />
            </div>
          </div>
        </div>

        {/* Card 4: Reportes */}
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
          <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
            <AlertCircle size={24} className="text-[#c392dd] flex-shrink-0" />
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Estado de Reportes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,3vw,1.5rem)]">
            {/* Reportes fallados en tu contra */}
            <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-red-500/30 hover:border-red-500/60 transition-all">
              <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-[clamp(0.75rem,2vw,1rem)]">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-[#8d62a5] uppercase font-semibold" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Fallados en tu contra
                </p>
              </div>
              <div className="font-gilroy font-bold text-red-400" style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                {mockUser.reportesFallados}
              </div>
              <p className="text-red-300/70" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                reportes resueltos desfavorablemente
              </p>
            </div>

            {/* Reportes pendientes */}
            <div className="bg-[#271033] rounded-lg p-[clamp(1rem,3vw,1.5rem)] border border-[#c392dd]/30 hover:border-[#c392dd]/60 transition-all">
              <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] mb-[clamp(0.75rem,2vw,1rem)]">
                <Clock size={20} className="text-[#c392dd] flex-shrink-0" />
                <p className="text-[#8d62a5] uppercase font-semibold" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Reportes pendientes
                </p>
              </div>
              <div className="font-gilroy font-bold text-[#c392dd]" style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                {mockUser.reportesPendientes}
              </div>
              <p className="text-[#c392dd]/70" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                en evaluación o realizados por ti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
