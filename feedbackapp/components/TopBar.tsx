'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, LogOut, User, Star, Shield, Search, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useClerk, useAuth } from '@clerk/nextjs';

export function TopBar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { sessionClaims } = useAuth();
  const role = (sessionClaims?.metadata as any)?.role;
  const isAdmin = role === 'feedbackAdmin';
  const isRider = role === 'rider';
  const isDriver = role === 'driver';
  const appUrl = isRider ? process.env.NEXT_PUBLIC_RIDER_APP_URL : isDriver ? process.env.NEXT_PUBLIC_DRIVER_APP_URL : null;
  const appLabel = isRider ? 'Volver a Rider App' : 'Volver a Driver App';
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navItems = isAdmin
    ? [
      { label: 'Inicio', href: '/', icon: Home },
      { label: 'Usuarios', href: '/admin/usuarios', icon: Users },
      { label: 'Gestionar Reportes', href: '/admin/reportes', icon: Shield },
    ]
    : [
      { label: appLabel, href: appUrl ?? '/', icon: Home },
      { label: 'Reviews', href: '/reviews', icon: Star },
      { label: 'Reportes', href: '/reportes', icon: BarChart3 },
      { label: 'Perfil', href: '/perfil', icon: User },
    ];

  const rightItems = !isAdmin
    ? [
      { label: 'Buscar', href: '/buscar', icon: Search },
    ]
    : [];

  const renderNavLink = (item: { label: string; href: string; icon: React.ComponentType<{ size?: number }> }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    const isExternal = item.href.startsWith('http');
    if (isExternal) {
      return (
        <a
          key={item.href}
          href={item.href}
          onClick={closeMenu}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${isActive
            ? 'bg-brand-accent-soft text-white'
            : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
            }`}
        >
          <Icon size={18} />
          <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
        </a>
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeMenu}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${isActive
          ? 'bg-brand-accent-soft text-white'
          : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
          }`}
      >
        <Icon size={18} />
        <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay - mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-brand-card border-b border-brand-accent-soft/20">
        <div className="flex items-center h-full px-[clamp(0.75rem,2vw,1.5rem)] max-w-[1400px] mx-auto">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 mr-2 text-brand-accent-mid hover:text-brand-text-light transition-colors"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href={appUrl ?? '/'} onClick={closeMenu} className="flex flex-col items-center shrink-0 leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-gilroy">RepairDash</span>
              <span className="text-xs text-brand-accent-mid tracking-wide hidden sm:inline">Feedback</span>
            </div>
            {isAdmin && (
              <span className="text-[11px] font-bold text-[#e879f9] tracking-wide -mt-0.5">Admin View</span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center ml-6 gap-1" aria-label="Navegación principal">
            {navItems.map((item) => renderNavLink(item))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop right items */}
          <div className="hidden lg:flex items-center gap-1">
            {rightItems.map((item) => renderNavLink(item))}
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-accent-mid transition-all duration-200 hover:text-brand-text-light hover:bg-brand-accent-soft/30 min-h-[44px]"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
            </button>
          </div>

          {/* Mobile logout button */}
          <div className="lg:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="p-2 text-brand-accent-mid hover:text-brand-text-light transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-50 lg:hidden bg-brand-card border-b border-brand-accent-soft/20 shadow-xl"
          role="navigation"
          aria-label="Navegación principal"
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => renderNavLink(item))}
            <hr className="border-brand-accent-soft/20 my-2" />
            {rightItems.map((item) => renderNavLink(item))}
            <button
              onClick={() => {
                signOut({ redirectUrl: '/' });
                closeMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-3 rounded-lg text-brand-accent-mid transition-all duration-200 hover:text-brand-text-light hover:bg-brand-accent-soft/30 min-h-[44px]"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed top bar */}
      <div className="h-16" />
    </>
  );
}
