'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Inicio',
      href: '/',
      icon: Home,
    },
    {
      label: 'Reportes',
      href: '/reportes',
      icon: BarChart3,
    },
    {
      label: 'Configuración',
      href: '/configuracion',
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-card border-r border-brand-accent-soft/20 flex flex-col">
      {/* Logo / App Name */}
      <div className="p-6 border-b border-brand-accent-soft/20">
        <h1 className="text-2xl font-bold text-white font-gilroy">Feedback App</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-out ${
                    isActive
                      ? 'bg-brand-accent-soft text-white'
                      : 'text-brand-accent-mid hover:text-brand-text-light hover:bg-brand-accent-soft/30 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-brand-accent-soft/20">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-brand-accent-mid transition-all duration-200 ease-out hover:text-brand-text-light hover:bg-brand-accent-soft/30 hover:translate-x-1">
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
