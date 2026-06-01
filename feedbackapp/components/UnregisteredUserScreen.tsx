'use client';

import { useClerk } from '@clerk/nextjs';
import { AlertTriangle, LogOut } from 'lucide-react';

export default function UnregisteredUserScreen() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-brand-card border border-brand-accent-soft/20 rounded-2xl p-8 shadow-xl">
          <div className="bg-red-500/10 p-4 rounded-full w-fit mx-auto mb-6">
            <AlertTriangle size={48} className="text-red-400" />
          </div>

          <h1 className="text-brand-text-light text-2xl font-bold mb-3">
            Acceso denegado
          </h1>

          <p className="text-brand-accent-mid mb-8 leading-relaxed">
            Tu usuario no está registrado en repairdash-feedback, por favor inicia
            sesión con otra cuenta.
          </p>

          <button
            onClick={() => signOut({ redirectUrl: '/' })}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
