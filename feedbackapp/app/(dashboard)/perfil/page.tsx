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
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={i < Math.floor(rating) ? 'fill-[#f500f1] text-[#f500f1]' : 'text-[#8d62a5]'}
          />
        ))}
      </div>
      <span className="font-gilroy font-bold text-[#fbdaf9]">
        {rating} / {max}
      </span>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-2">
          Mi Perfil
        </p>
        <h1 className="font-gilroy font-bold text-4xl text-[#fbdaf9]">Información de cuenta</h1>
        <p className="text-[#c392dd] mt-2">Visualizá tus datos personales y estadísticas</p>
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        {/* Card 1: Datos del usuario */}
        <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
          <div className="flex items-center gap-3 mb-8">
            <User size={24} className="text-[#c392dd]" />
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
              Datos Personales
            </p>
          </div>

          <div className="space-y-6">
            {/* Nombre completo */}
            <div>
              <label className="block text-[#8d62a5] text-xs uppercase font-semibold mb-2">
                Nombre Completo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={mockUser.nombre}
                  disabled
                  className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-4 py-3 cursor-not-allowed opacity-60"
                />
                <Lock size={20} className="text-[#8d62a5]" />
              </div>
              <p className="text-[#8d62a5] text-xs mt-2">Campo no editable</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#8d62a5] text-xs uppercase font-semibold mb-2">
                Email
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={mockUser.email}
                  disabled
                  className="flex-1 bg-[#271033] border border-[#8d62a5]/20 text-[#fbdaf9] rounded-lg px-4 py-3 cursor-not-allowed opacity-60"
                />
                <Mail size={20} className="text-[#8d62a5]" />
              </div>
              <p className="text-[#8d62a5] text-xs mt-2">Campo no editable</p>
            </div>
          </div>
        </div>

        {/* Card 2: Actividad Laboral */}
        <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase size={24} className="text-[#c392dd]" />
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
              Actividad Laboral
            </p>
          </div>

          <div className="bg-[#271033] rounded-lg p-6 border border-[#8d62a5]/30 text-center">
            <p className="text-[#8d62a5] text-sm uppercase font-semibold mb-3">
              Trabajos en los que te viste involucrado
            </p>
            <div className="text-5xl font-gilroy font-bold text-[#f500f1] mb-2">
              {mockUser.trabajos}
            </div>
            <p className="text-[#c392dd] text-sm">proyectos completados</p>
          </div>
        </div>

        {/* Card 3: Rating Promedio */}
        <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
          <div className="flex items-center gap-3 mb-8">
            <Star size={24} className="text-[#c392dd]" />
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
              Rating Promedio
            </p>
          </div>

          <div className="bg-[#271033] rounded-lg p-6 border border-[#8d62a5]/30">
            <p className="text-[#8d62a5] text-sm uppercase font-semibold mb-4">
              Calificación promedio recibida
            </p>
            <div className="flex items-center justify-center">
              {/* TODO: reemplazar con query a base de datos */}
              <StarRating rating={mockUser.ratingPromedio} />
            </div>
          </div>
        </div>

        {/* Card 4: Reportes */}
        <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle size={24} className="text-[#c392dd]" />
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
              Estado de Reportes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reportes fallados en tu contra */}
            <div className="bg-[#271033] rounded-lg p-6 border border-red-500/30 hover:border-red-500/60 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-red-400" />
                <p className="text-[#8d62a5] text-xs uppercase font-semibold">Fallados en tu contra</p>
              </div>
              <div className="text-4xl font-gilroy font-bold text-red-400 mb-2">
                {mockUser.reportesFallados}
              </div>
              <p className="text-red-300/70 text-sm">reportes resueltos desfavorablemente</p>
            </div>

            {/* Reportes pendientes */}
            <div className="bg-[#271033] rounded-lg p-6 border border-[#c392dd]/30 hover:border-[#c392dd]/60 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-[#c392dd]" />
                <p className="text-[#8d62a5] text-xs uppercase font-semibold">Reportes pendientes</p>
              </div>
              <div className="text-4xl font-gilroy font-bold text-[#c392dd] mb-2">
                {mockUser.reportesPendientes}
              </div>
              <p className="text-[#c392dd]/70 text-sm">en evaluación o realizados por ti</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
