'use client';

import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

type ErrorDisplayProps = {
  code?: string;
  titulo: string;
  descripcion: string;
  botonTexto?: string;
  botonAccion?: () => void;
  botonHref?: string;
};

export default function ErrorDisplay({
  code = 'Error',
  titulo,
  descripcion,
  botonTexto,
  botonAccion,
  botonHref,
}: ErrorDisplayProps) {
  const Icon = code === '404' ? AlertTriangle : AlertTriangle;

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-brand-card border border-brand-accent-soft/20 rounded-2xl p-8 shadow-xl">
          <div className="bg-brand-accent-strong/10 p-4 rounded-full w-fit mx-auto mb-6">
            <Icon size={48} className="text-brand-accent-strong" />
          </div>

          {code && (
            <p className="text-brand-accent-strong font-bold text-6xl mb-2">
              {code}
            </p>
          )}

          <h1 className="text-brand-text-light text-2xl font-bold mb-3">
            {titulo}
          </h1>

          <p className="text-brand-accent-mid mb-8 leading-relaxed">
            {descripcion}
          </p>

          {botonTexto && (botonAccion || botonHref) && (
            <>
              {botonHref ? (
                <Link
                  href={botonHref}
                  className="inline-flex items-center gap-2 bg-brand-accent-strong hover:bg-brand-accent-strong/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Home size={18} />
                  {botonTexto}
                </Link>
              ) : botonAccion ? (
                <button
                  onClick={botonAccion}
                  className="inline-flex items-center gap-2 bg-brand-accent-strong hover:bg-brand-accent-strong/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={18} />
                  {botonTexto}
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
