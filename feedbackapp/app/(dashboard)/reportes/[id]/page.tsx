import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { prisma } from '@/lib/prisma';

function VerdictoBadge({ resolucion, decision, soyReportante }: { resolucion: string; decision: string | null; soyReportante: boolean }) {
  if (resolucion === 'SinResolver') {
    return (
      <span className="inline-flex items-center gap-2 bg-[#8d62a5]/20 text-[#c392dd] font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        <Clock size={14} />
        En evaluación
      </span>
    );
  }

  const aFavor = soyReportante ? decision === 'AFavor' : decision === 'EnContra';

  if (aFavor) {
    return (
      <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        <CheckCircle size={14} />
        A favor
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
      <XCircle size={14} />
      En contra
    </span>
  );
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
      <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
        Veredicto
      </p>

      <div className="text-center">
        {isSinResolver && (
          <>
            <Clock size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#c392dd]" />
            <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Pendiente de veredicto
            </h3>
            <p className="text-[#c392dd] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              El administrador aún no ha revisado este reporte
            </p>
            <VerdictoBadge resolucion={resolucion} decision={decision} soyReportante={soyReportante} />
          </>
        )}

        {!isSinResolver && aFavor && (
          <>
            <CheckCircle size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-green-500" />
            <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Reporte aprobado
            </h3>
            <p className="text-[#c392dd] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>El administrador falló {soyReportante ? 'a' : 'en'}{' '}tu favor</p>
            <VerdictoBadge resolucion={resolucion} decision={decision} soyReportante={soyReportante} />
          </>
        )}

        {!isSinResolver && !aFavor && (
          <>
            <XCircle size={56} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-red-500" />
            <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(0.5rem,1vw,0.75rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              Reporte rechazado
            </h3>
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

const rolLabel: Record<string, string> = {
  rider: 'Cliente',
  driver: 'Trabajador',
  feedbackAdmin: 'Administrador',
};

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
  const soyReportante = user.id === reporte.idReportante;

  return (
    <div className="p-[clamp(1rem,4vw,2rem)] max-w-full md:max-w-6xl lg:max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-[clamp(2rem,6vw,3rem)]">
        <Link
          href="/reportes"
          className="flex items-center gap-2 text-[#c392dd] hover:text-[#f500f1] transition-colors mb-[clamp(1rem,3vw,2rem)] w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Volver a reportes</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[clamp(1rem,3vw,2rem)]">
          <div>
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Detalle de Reporte
            </p>
            <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
              Reporte #{reporte.id.slice(0, 8)}
            </h1>
          </div>

          {/* Badge de estado */}
          {reporte.resolucion === 'SinResolver' ? (
            <span className="bg-[#8d62a5]/20 text-[#c392dd] font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-2 whitespace-nowrap min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              <AlertTriangle size={16} />
              Sin resolver
            </span>
          ) : (soyReportante ? reporte.decision === 'AFavor' : reporte.decision === 'EnContra') ? (
            <span className="bg-green-500/20 text-green-300 font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-2 whitespace-nowrap min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              <CheckCircle size={16} />
              Resuelto
            </span>
          ) : (
            <span className="bg-red-500/20 text-red-300 font-medium px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full flex items-center gap-2 whitespace-nowrap min-h-[28px]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              <XCircle size={16} />
              Resuelto
            </span>
          )}
        </div>
      </div>

      {/* Contenido: Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[clamp(1rem,3vw,2rem)]">
        {/* Columna principal (2/3) */}
        <div className="lg:col-span-2 space-y-[clamp(1.5rem,4vw,2rem)]">
          {/* Card 1: Información del trabajo */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              Trabajo Relacionado
            </p>

            <h3 className="font-gilroy font-bold text-[#fbdaf9] mb-[clamp(1rem,3vw,2rem)]" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
              {reporte.trabajo.tipoDeTrabajo}
            </h3>

            <div className="space-y-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1.5rem,4vw,2rem)]">
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                <Calendar size={20} className="text-[#8d62a5] flex-shrink-0" />
                <span>
                  {fechaInicio} — {fechaFin}
                </span>
              </div>
            </div>

            {/* Reportante y Reportado */}
            <div className="space-y-[clamp(0.75rem,2vw,1rem)] pt-6 border-t border-[#8d62a5]/20">
              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-[#c392dd]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#8d62a5] uppercase font-semibold" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>Reportante</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {reporte.reportante.nombre} {reporte.reportante.apellido}
                  </p>
                  <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{rolLabel[reporte.reportante.rol] ?? reporte.reportante.rol}</p>
                </div>
              </div>

              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-[#c392dd]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#8d62a5] uppercase font-semibold" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>Reportado</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {reporte.reportado.nombre} {reporte.reportado.apellido}
                  </p>
                  <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{rolLabel[reporte.reportado.rol] ?? reporte.reportado.rol}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Descripción del incidente */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Descripción
              </p>
            </div>

            <p className="text-[#fbdaf9] leading-relaxed whitespace-pre-wrap" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
              {reporte.descripcion ?? 'Sin descripción'}
            </p>
          </div>

          {/* Card 3: Pruebas aportadas */}
          <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/20">
            <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,2rem)]">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#8d62a5] font-semibold uppercase tracking-wider" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
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
                    <h4 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Imágenes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
                      {imagenesProof.map((imagen) => (
                        <div
                          key={imagen.id}
                          className="cursor-pointer rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-[#8d62a5]/30 hover:border-[#f500f1]/40 min-h-[160px]"
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
                    <h4 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Videos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)]">
                      {videosProof.map((video) => (
                        <div
                          key={video.id}
                          className="rounded-lg overflow-hidden border border-[#8d62a5]/30 hover:border-[#f500f1]/40 transition-all duration-300"
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
                    <h4 className="text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Documentos</h4>
                    <div className="space-y-[clamp(0.5rem,1vw,0.75rem)]">
                      {pdfsProof.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="flex items-center justify-between bg-[#271033] rounded-lg p-[clamp(0.75rem,2vw,1rem)] border border-[#8d62a5]/20 hover:border-[#f500f1]/40 transition-all duration-300 group min-h-[44px]"
                        >
                          <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] min-w-0">
                            <FileText
                              size={20}
                              className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors flex-shrink-0"
                            />
                            <span className="text-[#fbdaf9] font-medium truncate" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Documento PDF</span>
                          </div>
                          <button className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[#c392dd] hover:text-[#f500f1] transition-colors px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded flex-shrink-0">
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
