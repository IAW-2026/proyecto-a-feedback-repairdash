'use client';

import Link from 'next/link';
import { Briefcase, Calendar, ArrowRight, Flag } from 'lucide-react';
import { formatDate } from '@/lib/dates';

interface PendingReportScreenProps {
  reporte: any;
  trabajo: any;
  reportado: any;
  userId: string;
}

export default function PendingReportScreen({
  reporte,
  trabajo,
  reportado,
  userId,
}: PendingReportScreenProps) {
  const linkHref = `/reportes/${reporte.id}/nuevo`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-brand-bg rounded-2xl p-8 max-w-md w-full mx-4 border border-brand-accent-soft/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="text-brand-accent-strong" size={24} />
          <span className="text-brand-accent-mid font-bold uppercase tracking-widest text-sm">
            REPORTE PENDIENTE
          </span>
        </div>

        <h1 className="text-3xl font-bold text-brand-text-light mb-3">
          Tenés un reporte pendiente
        </h1>

        <p className="text-brand-accent-mid mb-6">
          Completalo antes de seguir usando la app
        </p>

        <div className="bg-brand-card rounded-xl p-5 border border-brand-accent-soft/20 mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-accent-soft/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-text-light">
                {reportado?.nombre?.charAt(0)?.toUpperCase() ?? '?'}{reportado?.apellido?.charAt(0)?.toUpperCase() ?? ''}
              </span>
            </div>
            <div>
              <p className="text-xs text-brand-accent-mid uppercase">Usuario Reportado</p>
              <span className="font-semibold text-brand-text-light">
                {reportado?.nombre} {reportado?.apellido}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="text-brand-accent-soft" size={18} />
            <span className="text-brand-accent-mid">{trabajo.tipoDeTrabajo}</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-brand-accent-soft" size={18} />
            <span className="text-brand-accent-mid capitalize">
              {trabajo.fechaFin ? formatDate(trabajo.fechaFin) : 'Por confirmar'}
            </span>
          </div>
        </div>

        <Link
          href={linkHref}
          className="w-full flex items-center justify-center gap-2 bg-brand-accent-strong text-white py-3 px-4 rounded-lg hover:scale-[1.02] transition-transform duration-300 shadow-lg font-semibold"
        >
          Resolver reporte
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
