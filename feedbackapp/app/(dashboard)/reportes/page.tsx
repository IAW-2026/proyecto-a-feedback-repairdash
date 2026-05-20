import { Plus, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

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
      <div className="bg-[#3a1f52] rounded-lg p-6 border border-[#8d62a5]/30 hover:border-[#f500f1]/40 hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-gilroy font-bold text-[#fbdaf9] text-lg">{reporte.nombreUsuario}</h3>
          <p className="text-[#c392dd] text-sm">{reporte.tipoDeTrabajo}</p>
        </div>
        <div className="flex gap-2">
          {/* Badge de estado */}
          {reporte.resolucion === 'SinResolver' ? (
            <span className="bg-[#8d62a5]/20 text-[#c392dd] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <AlertTriangle size={14} />
              Sin resolver
            </span>
          ) : (
            <span className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Resuelto
            </span>
          )}

          {/* Badge de decisión (solo si está resuelto) */}
          {reporte.resolucion === 'Resuelto' && reporte.decision && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${
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

      <div className="flex items-center gap-2 text-[#8d62a5] text-sm">
        <span>📅 {reporte.fecha}</span>
      </div>
      </div>
    </Link>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="bg-[#3a1f52]/50 rounded-lg p-12 border border-dashed border-[#8d62a5]/30 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-[#8d62a5]" />
      <h4 className="font-gilroy font-bold text-[#fbdaf9] mb-2">Sin reportes</h4>
      <p className="text-[#c392dd]">No hay reportes en "{title}" por el momento</p>
    </div>
  );
}

export default function ReportesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-2">
              Reportes
            </p>
            <h1 className="font-gilroy font-bold text-4xl text-[#fbdaf9] mb-2">
              Mis Reportes
            </h1>
            <p className="text-[#c392dd]">Seguimiento de reportes enviados y recibidos</p>
          </div>
          <Link
            href="/reportes/nuevo"
            className="flex items-center gap-2 bg-[#f500f1] hover:bg-[#f500f1]/90 text-white font-gilroy font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={20} />
            Nuevo reporte
          </Link>
        </div>
      </div>

      {/* Sección: Reportes enviados */}
      <section className="mb-12">
        <h2 className="font-gilroy font-bold text-2xl text-[#fbdaf9] mb-6">Reportes enviados</h2>
        {reportesEnviados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <h2 className="font-gilroy font-bold text-2xl text-[#fbdaf9] mb-6">Reportes recibidos</h2>
        {reportesRecibidos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportesRecibidos.map((reporte) => (
              <ReporteCard key={reporte.id} reporte={reporte} />
            ))}
          </div>
        ) : (
          <EmptyState title="Reportes recibidos" />
        )}
      </section>
    </div>
  );
}
