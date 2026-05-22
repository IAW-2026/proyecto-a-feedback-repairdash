'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-brand-card border-b border-brand-accent-soft/20 flex items-center px-[clamp(1rem,4vw,1.5rem)] z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-brand-accent-mid hover:text-brand-text-light transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={24} className="flex-shrink-0" />
        </button>
        <h1 className="font-gilroy font-bold text-white ml-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>
          Feedback App
        </h1>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen flex flex-col items-center overflow-x-hidden lg:pt-[clamp(1.5rem,4vw,3rem)] pt-[calc(4rem+clamp(1.5rem,4vw,3rem))] pb-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,2.5rem)]">
        <div className="w-full max-w-[1100px]">
          {children}
        </div>
      </main>
    </div>
  );
}
