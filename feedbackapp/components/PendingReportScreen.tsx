'use client';

import Link from 'next/link';
import { User, Briefcase, Calendar, ArrowRight, Flag } from 'lucide-react';
import { formatDate } from '@/lib/dates';

interface PendingReportScreenProps {
  reporte: any;
  trabajo: any;
  reportado: any;
  userId: string;
}

/**
 * Pantalla que se muestra cuando el usuario tiene un reporte pendiente por resolver.
 * 
 * Información mostrada:
 * - El usuario reportado
 * - El tipo de trabajo
 * - Fecha del trabajo
 * - CTA para ir al formulario del reporte
 */
export default function PendingReportScreen({
  reporte,
  trabajo,
  reportado,
  userId,
}: PendingReportScreenProps) {
  const linkHref = `/reportes/${reporte.id}/nuevo`;

  return (
    <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Flag className="text-[#f500f1]" size={24} />
          <span className="text-[#f500f1] font-bold uppercase tracking-widest text-sm">
            REPORTE PENDIENTE
          </span>
        </div>

        <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3 text-center">
          Tenés un reporte pendiente
        </h1>

        <p className="text-[#c392dd] text-center mb-8">
          Completalo antes de seguir usando la app
        </p>

        {/* Card con información del reporte */}
        <div className="w-full bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20 text-[#fbdaf9]">
          {/* Usuario reportado */}
          <div className="flex items-center gap-3 mb-4">
            <User className="text-[#8d62a5]" size={20} />
            <div>
              <p className="text-xs text-[#c392dd] uppercase">Usuario Reportado</p>
              <span className="font-semibold text-lg">
                {reportado?.nombre} {reportado?.apellido}
              </span>
            </div>
          </div>

          {/* Tipo de trabajo */}
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="text-[#8d62a5]" size={20} />
            <div>
              <p className="text-xs text-[#c392dd] uppercase">Tipo de Trabajo</p>
              <span>{trabajo.tipoDeTrabajo}</span>
            </div>
          </div>

          {/* Fecha del trabajo */}
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="text-[#8d62a5]" size={20} />
            <div>
              <p className="text-xs text-[#c392dd] uppercase">Fecha</p>
              <span className="capitalize">
                {trabajo.fechaFin ? formatDate(trabajo.fechaFin) : 'Por confirmar'}
              </span>
            </div>
          </div>

          {/* Botón CTA */}
          <Link
            href={linkHref}
            className="w-full flex items-center justify-center gap-2 bg-[#f500f1] text-[#1a0a2e] py-3 px-4 rounded-lg transform transition-transform duration-300 hover:scale-[1.02] shadow-lg font-semibold"
          >
            Resolver reporte
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Pie de página informativo */}
        <p className="text-[#c392dd] text-sm mt-6 text-center max-w-sm">
          Necesitamos que resuelvas este reporte para poder continuar usando la plataforma.
        </p>
      </div>
    </div>
  );
}
