import { Plus, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import PendingReviewGuard from '@/components/PendingReviewGuard';

// Mock data para reportes enviados (que yo hice)
const reportesEnviados = [
  {
    id: '1',
    nombreUsuario: 'Carlos Pérez',
    tipoDeTrabajo: 'Plomería',
    fecha: '2025-05-10',
    resolucion: 'SinResolver' as const,
    decision: null,
  },
  {
    id: '2',
    nombreUsuario: 'Laura Gómez',
    tipoDeTrabajo: 'Electricidad',
    fecha: '2025-04-20',
    resolucion: 'Resuelto' as const,
    decision: 'AFavor' as const,
  },
];

// Mock data para reportes recibidos (que me hicieron a mí)
const reportesRecibidos = [
  {
    id: '3',
    nombreUsuario: 'Marcos Silva',
    tipoDeTrabajo: 'Pintura',
    fecha: '2025-05-01',
    resolucion: 'Resuelto' as const,
    decision: 'EnContra' as const,
  },
];

interface ReporteCard {
  id: string;
  nombreUsuario: string;
  tipoDeTrabajo: string;
  fecha: string;
  resolucion: 'SinResolver' | 'Resuelto';
  decision: 'AFavor' | 'EnContra' | null;
}

function ReporteCard({ reporte }: { reporte: ReporteCard }) {
  return (
    <Link href={`/reportes/${reporte.id}`}>
      <div className="bg-[#3a1f52] rounded-lg p-[clamp(1rem,4vw,1.5rem)] border border-[#8d62a5]/30 hover:border-[#f500f1]/40 hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(0.75rem,2vw,1rem)]">
          <div className="min-w-0">
            <h3 className="font-gilroy font-bold text-[#fbdaf9] break-words" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
              {reporte.nombreUsuario}
            </h3>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              {reporte.tipoDeTrabajo}
            </p>
          </div>
          <div className="flex gap-[clamp(0.5rem,1vw,0.75rem)] flex-wrap sm:flex-nowrap">
            {/* Badge de estado */}
            {reporte.resolucion === 'SinResolver' ? (
              <span className="bg-[#8d62a5]/20 text-[#c392dd] text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
                <AlertTriangle size={14} />
                Sin resolver
              </span>
            ) : (
              <span className="bg-green-500/20 text-green-300 text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-1.5 whitespace-nowrap min-h-[28px]">
                <CheckCircle2 size={14} />
                Resuelto
              </span>
            )}

            {/* Badge de decisión (solo si está resuelto) */}
            {reporte.resolucion === 'Resuelto' && reporte.decision && (
              <span
                className={`text-xs font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-1.5 whitespace-nowrap min-h-[28px] ${
                  reporte.decision === 'AFavor'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {reporte.decision === 'AFavor' ? (
                  <>
                    <CheckCircle2 size={14} />
                    A favor
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    En contra
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#8d62a5]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
          <span>📅 {reporte.fecha}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="bg-[#3a1f52]/50 rounded-lg p-[clamp(1.5rem,4vw,3rem)] border border-dashed border-[#8d62a5]/30 text-center">
      <AlertTriangle size={48} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#8d62a5]" />
      <h4 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
        Sin reportes
      </h4>
      <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
        No hay reportes en "{title}" por el momento
      </p>
    </div>
  );
}

export default function ReportesPage() {
  return (
    <PendingReviewGuard>
      <div className="w-full">
      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[clamp(1rem,3vw,2rem)]">
          <div className="min-w-0">
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Reportes
            </p>
            <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              Mis Reportes
            </h1>
            <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              Seguimiento de reportes enviados y recibidos
            </p>
          </div>
          <Link
            href="/reportes/nuevo"
            className="flex items-center justify-center gap-2 bg-[#f500f1] hover:bg-[#f500f1]/90 text-white font-gilroy font-bold px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer min-h-[44px] whitespace-nowrap flex-shrink-0"
          >
            <Plus size={20} />
            <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Nuevo reporte</span>
          </Link>
        </div>
      </div>

      {/* Sección: Reportes enviados */}
      <section className="mb-[clamp(2rem,6vw,3rem)]">
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reportes enviados
        </h2>
        {reportesEnviados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,2vw,1.75rem)]">
            {reportesEnviados.map((reporte) => (
              <ReporteCard key={reporte.id} reporte={reporte} />
            ))}
          </div>
        ) : (
          <EmptyState title="Reportes enviados" />
        )}
      </section>

      {/* Sección: Reportes recibidos */}
      <section>
        <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,1.5rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          Reportes recibidos
        </h2>
        {reportesRecibidos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,2vw,1.75rem)]">
            {reportesRecibidos.map((reporte) => (
              <ReporteCard key={reporte.id} reporte={reporte} />
            ))}
          </div>
        ) : (
          <EmptyState title="Reportes recibidos" />
        )}
      </section>
    </div>
    </PendingReviewGuard>
  );
}
