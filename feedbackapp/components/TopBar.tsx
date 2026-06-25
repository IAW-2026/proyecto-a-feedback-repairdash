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
  const [mobileReviewsOpen, setMobileReviewsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const closeMenu = () => { setMenuOpen(false); setMobileReviewsOpen(false); };

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
              <span className="text-[11px] font-bold text-brand-accent-mid tracking-wide -mt-0.5">Admin View</span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center ml-6 gap-1" aria-label="Navegación principal">
            {renderNavLink(navItems[0])}
            {renderNavLink(navItems[1])}

            {!isAdmin && (
              /* Reviews dropdown */
              <div
                className="relative group"
              >
                <button
                  className={`relative flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${pathname.startsWith('/reviews')
                    ? 'bg-brand-accent-soft text-white'
                    : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                    }`}
                >
                  <Star size={16} />
                  <span className="text-sm font-medium whitespace-nowrap">Reviews</span>
                  {pendingReviewsCount > 0 && (
                    <span className="absolute -top-0.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent-strong px-1 text-[10px] font-bold text-white animate-pulse">
                      {pendingReviewsCount}
                    </span>
                  )}
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>


                 <div className="absolute top-full left-0 pt-1 w-52 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="bg-brand-bg border border-brand-accent-soft/20 rounded-xl shadow-2xl py-2">
                    <Link
                      href="/reviews"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === '/reviews'
                        ? 'text-brand-accent-strong bg-brand-accent-strong/10'
                        : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-card'
                        }`}
                    >
                      <Star size={16} />
                      Reviews recibidas
                    </Link>
                    <Link
                      href="/reviews/pendientes"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === '/reviews/pendientes'
                        ? 'text-brand-accent-strong bg-brand-accent-strong/10'
                        : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-card'
                        }`}
                    >
                      <Clock size={16} />
                      Reviews pendientes
                      {pendingReviewsCount > 0 && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-brand-accent-strong animate-pulse" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {renderNavLink(navItems[2])}

            {!isAdmin && (
              /* Perfil con avatar */
              <Link
                href="/perfil"
                onClick={closeMenu}
                className={`flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${pathname === '/perfil'
                  ? 'bg-brand-accent-soft text-white'
                  : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                  }`}
              >
                <div className="w-6 h-6 rounded-full bg-brand-accent-soft flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {inicial}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{nombreCompleto}</span>
              </Link>
            )}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop right items */}
          <div className="hidden lg:flex items-center gap-1">
            {!isAdmin && (
              <Link
                href="/buscar"
                onClick={closeMenu}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200"
                aria-label="Buscar"
              >
                <Search size={18} />
              </Link>
            )}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium whitespace-nowrap hidden xl:inline">Cerrar sesión</span>
            </button>
          </div>

          {/* Mobile logout button */}
          <div className="lg:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={() => setShowLogoutConfirm(true)}
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
          className="fixed top-16 left-0 right-0 z-[55] lg:hidden bg-brand-card border-b border-brand-accent-soft/20 shadow-xl"
          role="navigation"
          aria-label="Navegación principal"
        >
          <div className="p-4 space-y-2">
            {renderNavLink(navItems[0])}
            {renderNavLink(navItems[1])}

            {!isAdmin && (
              <div>
                <button
                  onClick={() => setMobileReviewsOpen(!mobileReviewsOpen)}
                  className="flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30"
                >
                  <div className="flex items-center gap-2 relative">
                    <Star size={16} />
                    <span className="text-sm font-medium">Reviews</span>
                    {pendingReviewsCount > 0 && (
                      <span className="absolute -top-2 -right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent-strong px-1 text-[10px] font-bold text-white">
                        {pendingReviewsCount}
                      </span>
                    )}
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobileReviewsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileReviewsOpen && (
                  <div className="pl-3 border-l-2 border-brand-accent-soft/20 space-y-1 mt-1">
                    <Link
                      href="/reviews"
                      onClick={closeMenu}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${pathname === '/reviews'
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
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${pathname === '/reviews/pendientes'
                        ? 'bg-brand-accent-soft text-white'
                        : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                        }`}
                    >
                      <Clock size={16} />
                      <span className="text-sm font-medium">Pendientes</span>
                      {pendingReviewsCount > 0 && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-brand-accent-strong animate-pulse" />
                      )}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {renderNavLink(navItems[2])}

            {!isAdmin && (
              <Link
                href="/perfil"
                onClick={closeMenu}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 min-h-[44px] ${pathname === '/perfil'
                  ? 'bg-brand-accent-soft text-white'
                  : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30'
                  }`}
              >
                <div className="w-6 h-6 rounded-full bg-brand-accent-soft flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {inicial}
                </div>
                <span className="text-sm font-medium">{nombreCompleto}</span>
              </Link>
            )}

            <hr className="border-brand-accent-soft/20 my-2" />
            {!isAdmin && (
              <Link
                href="/buscar"
                onClick={closeMenu}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200 min-h-[44px]"
                aria-label="Buscar"
              >
                <Search size={18} />
                <span className="text-sm font-medium">Buscar</span>
              </Link>
            )}
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                closeMenu();
              }}
              className="flex items-center gap-2 w-full px-3 py-3 rounded-lg text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 transition-all duration-200 min-h-[44px]"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed top bar */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            className="relative bg-brand-card border border-brand-accent-soft/20 rounded-2xl shadow-2xl p-6 w-[90vw] max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-accent-soft/20 flex items-center justify-center">
                <LogOut size={24} className="text-brand-accent-soft" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cerrar sesión</h3>
                <p className="text-sm text-brand-accent-mid mt-1">
                  ¿Estás seguro de que deseas cerrar sesión?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-accent-mid bg-brand-accent-soft/10 hover:bg-brand-accent-soft/20 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-accent-soft hover:bg-brand-accent-strong transition-all duration-200"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-16" />
    </>
  );
}
