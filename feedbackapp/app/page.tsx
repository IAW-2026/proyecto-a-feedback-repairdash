import Link from 'next/link';
import { BarChart3, Star, User } from 'lucide-react';

export default function Home() {
  // ESTADO 2: Sin review pendiente (Dashboard normal)
  const sections = [
    {
      label: 'Reportes',
      href: '/reportes',
      icon: BarChart3,
      description: 'Ver y crear reportes',
    },
    {
      label: 'Reviews',
      href: '/reviews',
      icon: Star,
      description: 'Reviews pendientes',
    },
    {
      label: 'Perfil',
      href: '/perfil',
      icon: User,
      description: 'Tu información',
    },
  ];

  return (
    <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
        <div className="w-full max-w-[1100px]">
          {/* Header */}
          <div className="mb-[clamp(2rem,6vw,4rem)]">
            <div className="text-xs uppercase tracking-widest text-[#c392dd] font-semibold mb-2">
              Feedback App
            </div>
            <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
              RepairDash
            </h1>
            <p className="text-[#c392dd] mb-4">
              Accedé a las principales funciones de la app
            </p>
            <div className="bg-[#3a1f52] p-4 rounded-xl border border-[#8d62a5]/20 inline-block mb-4">
              <p className="text-[#fbdaf9]">No tenés reviews pendientes. Dashboard en construcción.</p>
            </div>
          </div>

          {/* Cards Grid - Mobile First */}
          <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="block w-full"
                >
                  <div
                    className="
                      w-full min-h-[120px] p-[clamp(1rem,3vw,1.5rem)]
                      bg-[#3a1f52] border border-[#8d62a5]/20 rounded-xl
                      flex flex-col items-center justify-center gap-[clamp(0.75rem,2vw,1rem)]
                      cursor-pointer
                      transition-all duration-300 ease-out
                      hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-[#f500f1]/60
                      hover:shadow-xl hover:shadow-[#f500f1]/20
                      active:scale-95
                    "
                  >
                    {/* Icon */}
                    <div className="bg-[#f500f1]/10 p-[clamp(0.75rem,2vw,1rem)] rounded-lg">
                      <Icon
                        size={48}
                        className="text-[#f500f1]"
                        style={{ width: 'min(48px, 12vw)', height: 'min(48px, 12vw)' }}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className="font-semibold text-white text-center"
                      style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}
                    >
                      {section.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
  );
}
