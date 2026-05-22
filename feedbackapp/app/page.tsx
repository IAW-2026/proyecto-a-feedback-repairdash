'use client';

import Link from 'next/link';
import { BarChart3, Star, User } from 'lucide-react';

export default function Home() {
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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-[clamp(1.5rem,4vw,2.5rem)]">
          <h1 
            className="font-gilroy font-bold text-white"
            style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}
          >
            Feedback App
          </h1>
        </div>
          {/* Welcome Section */}
          <div className="text-center mb-[clamp(2rem,6vw,4rem)]">
            <h2
              className="font-gilroy font-bold text-white mb-[clamp(0.5rem,2vw,1rem)]"
              style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)' }}
            >
              ¿Qué querés hacer hoy?
            </h2>
            <p
              className="text-brand-accent-mid"
              style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)' }}
            >
              Accede a las principales funciones de la app
            </p>
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
                        bg-brand-card border border-brand-accent-soft/20 rounded-xl
                        flex flex-col items-center justify-center gap-[clamp(0.75rem,2vw,1rem)]
                        cursor-pointer
                        transition-all duration-300 ease-out
                        hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-brand-accent-strong/60
                        hover:shadow-xl hover:shadow-brand-accent-strong/20
                        active:scale-95
                      "
                    >
                      {/* Icon */}
                      <div className="bg-brand-accent-strong/10 p-[clamp(0.75rem,2vw,1rem)] rounded-lg">
                        <Icon
                          size={48}
                          className="text-brand-accent-strong"
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
