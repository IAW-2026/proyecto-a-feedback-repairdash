'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, LogOut, User, X, Star, Shield, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isMobile, setIsMobile] = useState(true);

  // Detectar si estamos en pantalla mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const navItems = [
    {
      label: 'Inicio',
      href: '/',
      icon: Home,
    },
    {
      label: 'Buscar',
      href: '/buscar',
      icon: Search,
    },
    {
      label: 'Reviews',
      href: '/reviews',
      icon: Star,
    },
    {
      label: 'Reportes',
      href: '/reportes',
      icon: BarChart3,
    },
    {
      label: 'Perfil',
      href: '/perfil',
      icon: User,
    },
    {
      label: 'Admin',
      href: '/admin/reportes',
      icon: Shield,
    },
  ];

  return (
    <>
      {/* Overlay - solo visible en mobile cuando sidebar está abierto */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 lg:hidden z-40"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className="fixed lg:sticky left-0 top-0 h-screen w-64 lg:w-[190px] lg:flex-shrink-0 bg-brand-card border-r border-brand-accent-soft/20 flex flex-col overflow-y-auto transition-transform duration-300 ease-out"
        style={{
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          zIndex: isOpen && isMobile ? 1000 : 'auto',
        }}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Close button - solo en mobile */}
        <div className="lg:hidden p-[clamp(0.75rem,2vw,1rem)] flex justify-end border-b border-brand-accent-soft/20">
          <button
            onClick={onClose}
            className="p-2 text-brand-accent-mid hover:text-brand-text-light transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={24} className="flex-shrink-0" />
          </button>
        </div>

        {/* Logo / App Name */}
        <div className="p-[clamp(1rem,4vw,1.5rem)] border-b border-brand-accent-soft/20">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white font-gilroy leading-tight">
              RepairDash
            </span>
            <span className="text-xs font-medium text-[#c392dd] tracking-wide pl-[45%]">
              Feedback App
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-[clamp(0.75rem,2vw,1rem)]">
        <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] rounded-lg transition-all duration-200 ease-out min-h-[44px] ${
                    isActive
                      ? 'bg-brand-accent-soft text-white'
                      : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        </nav>

        {/* Logout */}
        <div className="p-[clamp(0.75rem,2vw,1rem)] border-t border-brand-accent-soft/20">
          <button
            onClick={() => { signOut({ redirectUrl: '/' }); onClose(); }}
            className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] w-full px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] rounded-lg text-brand-accent-mid transition-all duration-200 ease-out hover:text-brand-text-light hover:bg-brand-accent-soft/30 hover:translate-x-1 min-h-[44px]"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-sm md:text-base" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
