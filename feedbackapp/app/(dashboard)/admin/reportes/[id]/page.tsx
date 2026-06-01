import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/getCurrentUser'
import AdminResolveClient from './AdminResolveClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminReporteDetallePage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user || user.rol !== 'feedbackAdmin') {
    throw new Error('No autorizado')
  }

  const { id } = await params

  const reporte = await prisma.reporte.findUnique({
    where: { id },
    include: {
      trabajo: {
        include: {
          rider: true,
          driver: true,
        },
      },
      reportante: true,
      reportado: true,
      pruebas: true,
    },
  })

  if (!reporte) {
    notFound()
  }

  const imagenes = reporte.pruebas.filter(p => p.tipo === 'imagen')
  const videos = reporte.pruebas.filter(p => p.tipo === 'video')
  const pdfs = reporte.pruebas.filter(p => p.tipo === 'pdf')

  const isResuelto = reporte.estado === 'RESUELTO'
  const isPendiente = reporte.estado === 'PRUEBAS_AGREGADAS'

  return (
    <div className="p-8 max-w-full md:max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/reportes"
          className="flex items-center gap-2 text-[#c392dd] hover:text-[#f500f1] transition-colors mb-6 w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver a reportes</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2 text-sm">
              Detalle de Reporte
            </p>
            <h1 className="font-bold text-[#fbdaf9] mb-2 text-2xl">
              Reporte #{reporte.id.slice(0, 8)}
            </h1>
          </div>

          {isResuelto ? (
            reporte.decision === 'AFavor' ? (
              <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 font-medium px-3 py-1.5 rounded-full text-sm whitespace-nowrap">
                <CheckCircle size={16} />
                Resuelto - A favor
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 font-medium px-3 py-1.5 rounded-full text-sm whitespace-nowrap">
                <XCircle size={16} />
                Resuelto - En contra
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-2 bg-[#8d62a5]/20 text-[#c392dd] font-medium px-3 py-1.5 rounded-full text-sm whitespace-nowrap">
              <AlertTriangle size={16} />
              Pendiente de revisión
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trabajo info */}
          <div className="bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20">
            <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-4 text-sm">
              Trabajo Relacionado
            </p>
            <h2 className="font-bold text-[#fbdaf9] mb-4 text-xl">
              {reporte.trabajo.tipoDeTrabajo}
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-[#c392dd]">
                <Calendar size={20} className="text-[#8d62a5] flex-shrink-0" />
                <span>
                  {reporte.trabajo.fechaInicio.toLocaleDateString('es-ES')} —{' '}
                  {reporte.trabajo.fechaFin?.toLocaleDateString('es-ES') ?? 'Sin fecha fin'}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#8d62a5]/20">
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-[#c392dd]" />
                </div>
                <div>
                  <p className="text-[#8d62a5] uppercase font-semibold text-xs">Reportante</p>
                  <p className="text-[#fbdaf9] font-bold">
                    {reporte.reportante.nombre} {reporte.reportante.apellido}
                  </p>
                  <p className="text-[#c392dd] text-sm">{reporte.reportante.rol}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-[#8d62a5]/30 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-[#c392dd]" />
                </div>
                <div>
                  <p className="text-[#8d62a5] uppercase font-semibold text-xs">Reportado</p>
                  <p className="text-[#fbdaf9] font-bold">
                    {reporte.reportado.nombre} {reporte.reportado.apellido}
                  </p>
                  <p className="text-[#c392dd] text-sm">{reporte.reportado.rol}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#8d62a5] font-semibold uppercase tracking-wider text-sm">
                Descripción
              </p>
            </div>
            <p className="text-[#fbdaf9] leading-relaxed whitespace-pre-wrap">
              {reporte.descripcion ?? 'Sin descripción'}
            </p>
          </div>

          {/* Pruebas */}
          <div className="bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-[#c392dd] flex-shrink-0" />
              <p className="text-[#8d62a5] font-semibold uppercase tracking-wider text-sm">
                Pruebas Aportadas
              </p>
            </div>

            {reporte.pruebas.length === 0 ? (
              <p className="text-[#c392dd] text-center py-6">Sin pruebas adjuntas</p>
            ) : (
              <div className="space-y-6">
                {imagenes.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-bold mb-3">Imágenes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {imagenes.map((img) => (
                        <div
                          key={img.id}
                          className="rounded-lg overflow-hidden border border-[#8d62a5]/30 hover:border-[#f500f1]/40 transition-all duration-300"
                        >
                          <img
                            src={img.url}
                            alt={`Prueba ${img.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videos.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-bold mb-3">Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videos.map((video) => (
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

                {pdfs.length > 0 && (
                  <div>
                    <h3 className="text-[#fbdaf9] font-bold mb-3">Documentos</h3>
                    <div className="space-y-2">
                      {pdfs.map((pdf) => (
                        <a
                          key={pdf.id}
                          href={pdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-[#271033] rounded-lg p-3 border border-[#8d62a5]/20 hover:border-[#f500f1]/40 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText size={18} className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors" />
                            <span className="text-[#fbdaf9] font-medium">Documento PDF</span>
                          </div>
                          <span className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors text-sm">Ver</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AdminResolveClient
            reporteId={reporte.id}
            estado={reporte.estado}
            decision={reporte.decision}
            resolucion={reporte.resolucion}
          />
        </div>
      </div>
    </div>
  )
}
