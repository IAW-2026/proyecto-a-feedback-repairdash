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

// Mock data
const reporte = {
  id: '1',
  resolucion: 'SinResolver' as const,
  decision: null as null,
  trabajo: {
    tipoDeTrabajo: 'Plomería',
    fechaInicio: '2025-04-01',
    fechaFin: '2025-05-10',
  },
  reportante: { nombre: 'Juan', apellido: 'García', tipo: 'Cliente' as const },
  reportado: { nombre: 'Carlos', apellido: 'Pérez', tipo: 'Trabajador' as const },
  descripcion:
    'El trabajador no completó el trabajo acordado. Dejó las cañerías sin sellar y hubo una pérdida de agua que dañó el piso del baño. Se le avisó en varias ocasiones y no respondió.',
  pruebas: [
    { id: 'p1', tipo: 'imagen' as const, url: 'https://placehold.co/600x400/3a1f52/c392dd?text=Foto+1' },
    { id: 'p2', tipo: 'imagen' as const, url: 'https://placehold.co/600x400/3a1f52/c392dd?text=Foto+2' },
    { id: 'p3', tipo: 'pdf' as const, url: '#' },
  ],
};

function VerdictoBadge() {
  if (reporte.resolucion === 'SinResolver') {
    return (
      <span className="inline-flex items-center gap-2 bg-[#8d62a5]/20 text-[#c392dd] text-sm font-medium px-4 py-2 rounded-full">
        <Clock size={14} />
        En evaluación
      </span>
    );
  }

  if (reporte.decision === 'AFavor') {
    return (
      <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-sm font-medium px-4 py-2 rounded-full">
        <CheckCircle size={14} />
        A favor
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-sm font-medium px-4 py-2 rounded-full">
      <XCircle size={14} />
      En contra
    </span>
  );
}

function VerdictCard() {
  const isSinResolver = reporte.resolucion === 'SinResolver';
  const isAFavor = reporte.decision === 'AFavor';

  let borderColor = 'border-[#c392dd]';
  let bgColorAccent = 'bg-[#c392dd]';
  let iconColor = 'text-[#c392dd]';

  if (!isSinResolver) {
    borderColor = isAFavor ? 'border-green-500' : 'border-red-500';
    bgColorAccent = isAFavor ? 'bg-green-500' : 'bg-red-500';
    iconColor = isAFavor ? 'text-green-500' : 'text-red-500';
  }

  return (
    <div className={`bg-[#3a1f52] rounded-xl p-8 border-2 ${borderColor}`}>
      <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-8">
        Veredicto
      </p>

      <div className="text-center">
        {isSinResolver && (
          <>
            <Clock size={56} className="mx-auto mb-4 text-[#c392dd]" />
            <h3 className="font-gilroy font-bold text-2xl text-[#fbdaf9] mb-2">
              Pendiente de veredicto
            </h3>
            <p className="text-[#c392dd] mb-6">
              El administrador aún no ha revisado este reporte
            </p>
            <VerdictoBadge />
          </>
        )}

        {!isSinResolver && isAFavor && (
          <>
            <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />
            <h3 className="font-gilroy font-bold text-2xl text-[#fbdaf9] mb-2">
              Reporte aprobado
            </h3>
            <p className="text-[#c392dd] mb-6">El administrador falló a tu favor</p>
            <VerdictoBadge />
          </>
        )}

        {!isSinResolver && !isAFavor && (
          <>
            <XCircle size={56} className="mx-auto mb-4 text-red-500" />
            <h3 className="font-gilroy font-bold text-2xl text-[#fbdaf9] mb-2">
              Reporte rechazado
            </h3>
            <p className="text-[#c392dd] mb-6">El administrador falló en tu contra</p>
            <VerdictoBadge />
          </>
        )}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReporteDetailPage({ params }: PageProps) {
  // Los params son dinámicos pero usamos datos hardcodeados
  const imagenesProof = reporte.pruebas.filter((p) => p.tipo === 'imagen');
  const pdfsProof = reporte.pruebas.filter((p) => p.tipo === 'pdf');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/reportes"
          className="flex items-center gap-2 text-[#c392dd] hover:text-[#f500f1] transition-colors mb-6 w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a reportes
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-2">
              Detalle de Reporte
            </p>
            <h1 className="font-gilroy font-bold text-4xl text-[#fbdaf9] mb-2">
              Reporte #{reporte.id}
            </h1>
          </div>

          {/* Badge de estado */}
          {reporte.resolucion === 'SinResolver' ? (
            <span className="bg-[#8d62a5]/20 text-[#c392dd] text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <AlertTriangle size={16} />
              Sin resolver
            </span>
          ) : reporte.decision === 'AFavor' ? (
            <span className="bg-green-500/20 text-green-300 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <CheckCircle size={16} />
              Resuelto
            </span>
          ) : (
            <span className="bg-red-500/20 text-red-300 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <XCircle size={16} />
              Resuelto
            </span>
          )}
        </div>
      </div>

      {/* Contenido: Grid de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Información del trabajo */}
          <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
            <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-6">
              Trabajo Relacionado
            </p>

            <h3 className="font-gilroy font-bold text-3xl text-[#fbdaf9] mb-6">
              {reporte.trabajo.tipoDeTrabajo}
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-[#c392dd]">
                <Calendar size={20} className="text-[#8d62a5]" />
                <span>
                  {reporte.trabajo.fechaInicio} — {reporte.trabajo.fechaFin}
                </span>
              </div>
            </div>

            {/* Reportante y Reportado */}
            <div className="space-y-3 pt-6 border-t border-[#8d62a5]/20">
              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center">
                  <User size={20} className="text-[#c392dd]" />
                </div>
                <div>
                  <p className="text-[#8d62a5] text-xs uppercase font-semibold">Reportante</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold">
                    {reporte.reportante.nombre} {reporte.reportante.apellido}
                  </p>
                  <p className="text-[#c392dd] text-sm">{reporte.reportante.tipo}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center">
                  <Shield size={20} className="text-[#c392dd]" />
                </div>
                <div>
                  <p className="text-[#8d62a5] text-xs uppercase font-semibold">Reportado</p>
                  <p className="text-[#fbdaf9] font-gilroy font-bold">
                    {reporte.reportado.nombre} {reporte.reportado.apellido}
                  </p>
                  <p className="text-[#c392dd] text-sm">{reporte.reportado.tipo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Descripción del incidente */}
          <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={20} className="text-[#c392dd]" />
              <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
                Descripción
              </p>
            </div>

            <p className="text-[#fbdaf9] leading-relaxed whitespace-pre-wrap">
              {reporte.descripcion}
            </p>
          </div>

          {/* Card 3: Pruebas aportadas */}
          <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/20">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={20} className="text-[#c392dd]" />
              <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider">
                Pruebas
              </p>
            </div>

            {reporte.pruebas.length === 0 ? (
              <p className="text-[#c392dd] text-center py-8">Sin pruebas adjuntas</p>
            ) : (
              <div className="space-y-6">
                {/* Imágenes */}
                {imagenesProof.length > 0 && (
                  <div>
                    <h4 className="text-[#fbdaf9] font-gilroy font-bold mb-4">Imágenes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {imagenesProof.map((imagen) => (
                        <div
                          key={imagen.id}
                          className="cursor-pointer rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-[#8d62a5]/30 hover:border-[#f500f1]/40"
                        >
                          <img
                            src={imagen.url}
                            alt={`Prueba ${imagen.id}`}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDFs */}
                {pdfsProof.length > 0 && (
                  <div>
                    <h4 className="text-[#fbdaf9] font-gilroy font-bold mb-4">Documentos</h4>
                    <div className="space-y-2">
                      {pdfsProof.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="flex items-center justify-between bg-[#271033] rounded-lg p-4 border border-[#8d62a5]/20 hover:border-[#f500f1]/40 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <FileText
                              size={20}
                              className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors"
                            />
                            <span className="text-[#fbdaf9] font-medium">Documento PDF</span>
                          </div>
                          <button className="flex items-center gap-2 text-[#c392dd] hover:text-[#f500f1] transition-colors px-3 py-2 rounded">
                            <ExternalLink size={18} />
                            <span className="text-sm">Ver</span>
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
          <VerdictCard />
        </div>
      </div>
    </div>
  );
}
