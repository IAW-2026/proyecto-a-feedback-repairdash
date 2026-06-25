import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import EstadoBadge from '@/components/EstadoBadge';
import DecisionBadge from '@/components/DecisionBadge';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';

function VerdictoBadge({ resolucion, decision, soyReportante }: { resolucion: string; decision: string | null; soyReportante: boolean }) {
  if (resolucion === 'SinResolver') {
    return (
      <span className="inline-flex items-center gap-2 bg-brand-accent-soft/20 text-[#c392dd] font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        <Clock size={14} />
        En evaluación
      </span>
    );
  }

  const aFavor = soyReportante ? decision === 'AFavor' : decision === 'EnContra';
  return <DecisionBadge favorable={aFavor} />;
}

function sameDay(a: Date | string | null | undefined, b: Date | string | null | undefined): boolean {
  if (!a || !b) return false
  const da = typeof a === 'string' ? new Date(a) : a
  const db = typeof b === 'string' ? new Date(b) : b
  return da.toDateString() === db.toDateString()
}

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function VerdictCard({ resolucion, decision, soyReportante }: { resolucion: string; decision: string | null; soyReportante: boolean }) {
  const aFavor = soyReportante ? decision === 'AFavor' : decision === 'EnContra';
  const isSinResolver = resolucion === 'SinResolver';

  let borderColor = 'border-[#c392dd]';
  let bgColorAccent = 'bg-[#c392dd]';
  let iconColor = 'text-[#c392dd]';

  if (!isSinResolver) {
    borderColor = aFavor ? 'border-green-500' : 'border-red-500';
    bgColorAccent = aFavor ? 'bg-green-500' : 'bg-red-500';
    iconColor = aFavor ? 'text-green-500' : 'text-red-500';
  }

  return (
    <div className={`bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border-2 ${borderColor}`}>
      <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        Veredicto
      </p>

      <div className="text-center">
        {isSinResolver && (
          <>
            <Clock size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#c392dd]" />
            <p className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Pendiente de veredicto
            </p>
            <p className="text-[#c392dd] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              El administrador aún no ha revisado este reporte
            </p>
            <VerdictoBadge resolucion={resolucion} decision={decision} soyReportante={soyReportante} />
          </>
        )}

        {!isSinResolver && aFavor && (
          <>
            <CheckCircle size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-green-500" />
            <p className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Reporte aprobado
            </p>
            <p className="text-[#c392dd] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>El administrador falló {soyReportante ? 'a' : 'en'}{' '}tu favor</p>
            <VerdictoBadge resolucion={resolucion} decision={decision} soyReportante={soyReportante} />
          </>
        )}

        {!isSinResolver && !aFavor && (
          <>
            <XCircle size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-red-500" />
            <p className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Reporte rechazado
            </p>
            <p className="text-[#c392dd] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>El administrador falló en tu contra</p>
            <VerdictoBadge resolucion={resolucion} decision={decision} soyReportante={soyReportante} />
          </>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

import { getRolLabel } from '@/lib/roles';

export default async function ReporteDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { id } = await params;

  const reporte = await prisma.reporte.findUnique({
    where: { id },
    include: {
      trabajo: true,
      reportante: true,
      reportado: true,
      pruebas: true,
    },
  });

  if (!reporte) {
    notFound();
  }

  const imagenesProof = reporte.pruebas.filter((p) => p.tipo === 'imagen');
  const videosProof = reporte.pruebas.filter((p) => p.tipo === 'video');
  const pdfsProof = reporte.pruebas.filter((p) => p.tipo === 'pdf');

  const fechaInicio = reporte.trabajo.fechaInicio.toLocaleDateString('es-ES');
  const fechaFin = reporte.trabajo.fechaFin?.toLocaleDateString('es-ES') ?? 'Sin fecha fin';
  const mismasFechas = reporte.trabajo.fechaInicio && reporte.trabajo.fechaFin && sameDay(reporte.trabajo.fechaInicio, reporte.trabajo.fechaFin);
  const soyReportante = user.id === reporte.idReportante;

  return (
    <div className="max-w-full md:max-w-6xl lg:max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/reportes"
          className="flex items-center gap-2 text-[#c392dd] hover:text-brand-accent-strong transition-colors mb-[clamp(1rem,3vw,2rem)] w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Volver a reportes</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[clamp(1rem,3vw,2rem)]">
          <div>
            <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Detalle de Reporte
            </p>
            <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              Reporte #<span className="font-mono">{reporte.id.slice(0, 8)}</span>
            </h1>
          </div>

          {/* Badge de estado */}
          <div className="flex gap-2 flex-wrap">
            <EstadoBadge estado={reporte.resolucion} />
          </div>
        </div>
      </div>

      {/* Contenido: Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[clamp(1rem,3vw,2rem)]">
        {/* Columna principal (2/3) */}
        <div className="lg:col-span-2 space-y-[clamp(1.5rem,4vw,2rem)]">
          {/* Card 1: Información del trabajo */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Trabajo Relacionado
            </p>

            <h2 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              {reporte.trabajo.tipoDeTrabajo}
            </h2>

            <div className="space-y-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1.5rem,4vw,2rem)]">
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                <Calendar size={20} className="text-brand-accent-soft flex-shrink-0" />
                <span>
                  {mismasFechas ? fechaInicio : `${fechaInicio} — ${fechaFin}`}
                </span>
              </div>
            </div>

            {/* Reportante y Reportado */}
            <div className="space-y-[clamp(0.75rem,2vw,1rem)] pt-6 border-t border-brand-accent-soft/20">
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] py-2">
                <div className="w-10 h-10 rounded-full bg-brand-accent-soft/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#fbdaf9]">{getInitials(reporte.reportante.nombre, reporte.reportante.apellido)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[#c392dd] uppercase font-semibold" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>Reportante</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {reporte.reportante.nombre} {reporte.reportante.apellido}
                  </p>
                  <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{getRolLabel(reporte.reportante.rol)}</p>
                </div>
              </div>

              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] py-2">
                <div className="w-10 h-10 rounded-full bg-brand-accent-soft/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#fbdaf9]">{getInitials(reporte.reportado.nombre, reporte.reportado.apellido)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[#c392dd] uppercase font-semibold" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>Reportado</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {reporte.reportado.nombre} {reporte.reportado.apellido}
                  </p>
                  <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{getRolLabel(reporte.reportado.rol)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Descripción del incidente */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Descripción
              </p>
            </div>

            <p className="text-[#fbdaf9] leading-relaxed whitespace-pre-wrap" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              {reporte.descripcion ?? 'Sin descripción'}
            </p>
          </div>

          {/* Card 3: Pruebas aportadas */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-brand-accent-soft/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#c392dd] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Pruebas
              </p>
            </div>

            {reporte.pruebas.length === 0 ? (
              <p className="text-[#c392dd] text-center py-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>Sin pruebas adjuntas</p>
            ) : (
              <div className="space-y-[clamp(1rem,3vw,2rem)]">
                {/* Imágenes */}
                {imagenesProof.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Imágenes</h3>
                    <div className="flex flex-wrap justify-center gap-[clamp(0.75rem,2vw,1rem)]">
                      {imagenesProof.map((imagen) => (
                        <div
                          key={imagen.id}
                          className="cursor-pointer rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-brand-accent-soft/30 hover:border-brand-accent-strong/40 min-h-[160px] flex-1 basis-[45%] max-w-[500px]"
                        >
                          <img
                            src={imagen.url}
                            alt={`Prueba ${imagen.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {videosProof.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
                      {videosProof.map((video) => (
                        <div
                          key={video.id}
                          className="rounded-lg overflow-hidden border border-brand-accent-soft/30 hover:border-brand-accent-strong/40 transition-all duration-300"
                        >
                          <video
                            src={video.url}
                            controls
                            className="w-full h-full max-h-[300px]"
                          >
                            Tu navegador no soporta la reproducción de video.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDFs */}
                {pdfsProof.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Documentos</h3>
                    <div className="space-y-[clamp(0.5rem,1vw,0.75rem)]">
                      {pdfsProof.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="flex items-center justify-between bg-[#271033] rounded-lg p-[clamp(0.75rem,2vw,1rem)] border border-brand-accent-soft/20 hover:border-brand-accent-strong/40 transition-all duration-300 group min-h-[44px]"
                        >
                          <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] min-w-0">
                            <FileText
                              size={20}
                              className="text-[#c392dd] group-hover:text-brand-accent-strong transition-colors flex-shrink-0"
                            />
                            <span className="text-[#fbdaf9] font-medium truncate" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Documento PDF</span>
                          </div>
                          <button className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[#c392dd] hover:text-brand-accent-strong transition-colors px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded flex-shrink-0">
                            <ExternalLink size={18} />
                            <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>Ver</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral (1/3) */}
        <div className="lg:col-span-1">
          <VerdictCard resolucion={reporte.resolucion} decision={reporte.decision} soyReportante={soyReportante} />
        </div>
      </div>
    </div>
  );
}
