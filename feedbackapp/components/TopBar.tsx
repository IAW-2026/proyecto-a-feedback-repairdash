'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Flag, LogOut, User, Star, Shield, Search, Users, Menu, X, ChevronDown, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useClerk, useAuth, useUser } from '@clerk/nextjs';

export function TopBar({ pendingReviewsCount = 0 }: { pendingReviewsCount?: number }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { sessionClaims } = useAuth();
  const { user } = useUser();
  const nombreCompleto = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Perfil';
  const inicial = user?.firstName?.charAt(0)?.toUpperCase() || '?';
  const role = (sessionClaims?.metadata as any)?.role;
  const isAdmin = role === 'feedbackAdmin';
  const isRider = role === 'rider';
  const isDriver = role === 'driver';
  const appUrl = isRider ? process.env.NEXT_PUBLIC_RIDER_APP_URL : isDriver ? process.env.NEXT_PUBLIC_DRIVER_APP_URL : null;
  const appLabel = isRider ? 'Panel Rider' : 'Panel Driver';
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const closeMenu = () => { setMenuOpen(false); setReviewsOpen(false); };

  const navItems = isAdmin
    ? [
      { label: 'Inicio', href: '/', icon: Home },
      { label: 'Usuarios', href: '/admin/usuarios', icon: Users },
      { label: 'Gestionar Reportes', href: '/admin/reportes', icon: Shield },
    ]
    : [
      { label: 'Inicio', href: '/', icon: Home },
      { label: appLabel, href: appUrl ?? '#', icon: ExternalLink },
      { label: 'Reportes', href: '/reportes', icon: Flag },
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
          className={`flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${isActive
            ? 'bg-brand-accent-soft text-white'
            : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
            }`}
        >
          <Icon size={16} />
          <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
        </a>
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeMenu}
        className={`flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${isActive
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
          <Link href="/" onClick={closeMenu} className="flex flex-col items-center shrink-0 leading-tight">
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
            {renderNavLink(navItems[0])}
            <a
              href={navItems[1].href}
              onClick={closeMenu}
              className="flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30"
            >
              <ExternalLink size={13} className="text-brand-accent-mid/60" />
              <span className="text-sm font-medium whitespace-nowrap">{navItems[1].label}</span>
            </a>

            {/* Reviews dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setReviewsOpen(true)}
              onMouseLeave={() => setReviewsOpen(false)}
            >
              <button
                className={`relative flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                  pathname.startsWith('/reviews')
                    ? 'bg-brand-accent-soft text-white'
                    : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                }`}
              >
                <Star size={16} />
                <span className="text-sm font-medium whitespace-nowrap">Reviews</span>
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f500f1] px-1 text-[10px] font-bold text-[#1a0a2e] animate-pulse">
                    {pendingReviewsCount}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform duration-200 ${reviewsOpen ? 'rotate-180' : ''}`} />
              </button>

              {reviewsOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-[#271033] border border-[#8d62a5]/20 rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/reviews"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      pathname === '/reviews'
                        ? 'text-[#f500f1] bg-[#f500f1]/10'
                        : 'text-[#c392dd] hover:text-[#fbdaf9] hover:bg-[#3a1f52]'
                    }`}
                  >
                    <Star size={16} />
                    Reviews recibidas
                  </Link>
                  <Link
                    href="/reviews/pendientes"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      pathname === '/reviews/pendientes'
                        ? 'text-[#f500f1] bg-[#f500f1]/10'
                        : 'text-[#c392dd] hover:text-[#fbdaf9] hover:bg-[#3a1f52]'
                    }`}
                  >
                    <Clock size={16} />
                    Reviews pendientes
                    {pendingReviewsCount > 0 && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-[#f500f1] animate-pulse" />
                    )}
                  </Link>
                </div>
              )}
            </div>
            {renderNavLink(navItems[2])}

            {/* Perfil con avatar */}
            <Link
              href="/perfil"
              onClick={closeMenu}
              className={`flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                pathname === '/perfil'
                  ? 'bg-brand-accent-soft text-white'
                  : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#8d62a5] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {inicial}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{nombreCompleto}</span>
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop right items */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/buscar"
              onClick={closeMenu}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200"
              aria-label="Buscar"
            >
              <Search size={18} />
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
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
            {renderNavLink(navItems[0])}

            <a
              href={navItems[1].href}
              onClick={closeMenu}
              className="flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30"
            >
              <ExternalLink size={14} className="text-brand-accent-mid/60" />
              <span className="text-sm font-medium">{navItems[1].label}</span>
            </a>

            <div className="pl-3 border-l-2 border-brand-accent-soft/20 space-y-1">
              <p className="text-xs uppercase tracking-widest text-brand-accent-mid px-3 pt-1">Reviews</p>
              <Link
                href="/reviews"
                onClick={closeMenu}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                  pathname === '/reviews'
                    ? 'bg-brand-accent-soft text-white'
                    : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                }`}
              >
                <Star size={16} />
                <span className="text-sm font-medium">Recibidas</span>
              </Link>
              <Link
                href="/reviews/pendientes"
                onClick={closeMenu}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                  pathname === '/reviews/pendientes'
                    ? 'bg-brand-accent-soft text-white'
                    : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                }`}
              >
                <Clock size={16} />
                <span className="text-sm font-medium">Pendientes</span>
                {pendingReviewsCount > 0 && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#f500f1] animate-pulse" />
                )}
              </Link>
            </div>

            {renderNavLink(navItems[2])}

            <Link
              href="/perfil"
              onClick={closeMenu}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${
                pathname === '/perfil'
                  ? 'bg-brand-accent-soft text-white'
                  : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#8d62a5] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {inicial}
              </div>
              <span className="text-sm font-medium">{nombreCompleto}</span>
            </Link>

            <hr className="border-brand-accent-soft/20 my-2" />
            <Link
              href="/buscar"
              onClick={closeMenu}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200 min-h-[44px]"
              aria-label="Buscar"
            >
              <Search size={18} />
              <span className="text-sm font-medium">Buscar</span>
            </Link>
            <button
              onClick={() => {
                signOut({ redirectUrl: '/' });
                closeMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-3 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200 min-h-[44px]"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed top bar */}
      <div className="h-16" />
    </>
  );
}
