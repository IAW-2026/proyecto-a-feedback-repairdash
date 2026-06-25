'use client';

import { Upload, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { useReportForm } from '@/hooks/useReportForm';
import type { Prueba } from '@/hooks/useReportForm';

interface ReportFormClientProps {
  reporteId: string;
  reportado: any;
  trabajo: any;
}

export default function ReportFormClient({
  reporteId,
  reportado,
  trabajo,
}: ReportFormClientProps) {
  const {
    isLoading,
    error,
    success,
    uploading,
    isDragOver,
    formData,
    handleDescripcionChange,
    handleFileSelect,
    handleRemovePrueba,
    handleSubmit,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useReportForm(reporteId);

  if (success) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
        <div className="w-full max-w-[600px] text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-3xl font-bold text-brand-text-light mb-2">Ã‚Â¡Reporte enviado!</h2>
          <p className="text-brand-accent-mid mb-6">
            Tu reporte ha sido registrado correctamente. SerÃƒÂ¡s redirigido...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg py-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[700px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-text-light mb-2">Resolver Reporte</h1>
          <p className="text-brand-accent-mid">ProporcionÃƒÂ¡ detalles sobre el incidente y adjuntÃƒÂ¡ evidencias</p>
        </div>

        <div className="bg-brand-card rounded-xl p-6 border border-brand-accent-soft/20 mb-6 text-brand-text-light">
          <h2 className="text-lg font-semibold mb-4">InformaciÃƒÂ³n del Reporte</h2>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-brand-accent-mid">Usuario reportado:</span> {reportado?.nombre}{' '}
              {reportado?.apellido}
            </p>
            <p>
              <span className="text-brand-accent-mid">Tipo de trabajo:</span> {trabajo?.tipoDeTrabajo}
            </p>
            <p>
              <span className="text-brand-accent-mid">ID del trabajo:</span> <code className="bg-[#2a0f3a] px-2 py-1 rounded">{trabajo?.id}</code>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-text-light font-semibold mb-2">
              DescripciÃƒÂ³n del Incidente *
            </label>
            <p className="text-xs text-brand-accent-mid mb-3">
              CuÃƒÂ©ntanos quÃƒÂ© sucediÃƒÂ³. MÃƒÂ­nimo 20 caracteres.
            </p>
            <textarea
              value={formData.descripcion}
              onChange={handleDescripcionChange}
              disabled={isLoading}
              className="w-full bg-brand-card border border-brand-accent-soft/30 rounded-lg p-4 text-brand-text-light placeholder-brand-accent-soft focus:outline-none focus:border-brand-accent-strong disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              rows={6}
              placeholder="Describe el incidente de forma clara y detallada..."
            />
            <p className="text-xs text-brand-accent-mid mt-2">
              {formData.descripcion.length} / 500 caracteres
            </p>
          </div>

          <div>
            <label className="block text-brand-text-light font-semibold mb-2">
              Pruebas / Evidencias *
            </label>
            <p className="text-xs text-brand-accent-mid mb-3">
              ArrastrÃƒÂ¡ archivos o hacÃƒÂ© clic para seleccionar. MÃƒÂ­nimo 1 prueba requerida.
            </p>

            <div className="mb-4">
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploading
                    ? 'border-brand-accent-strong/50 bg-brand-card/50'
                    : isDragOver
                      ? 'border-brand-accent-strong bg-brand-card/80'
                      : 'border-brand-accent-soft/30 bg-brand-card hover:border-brand-accent-strong/40 hover:bg-brand-card/80'
                }`}
              >
                <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading || isLoading}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader size={24} className="animate-spin text-brand-accent-strong" />
                      <span className="text-brand-accent-mid text-sm">Subiendo archivos...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-brand-accent-mid" />
                      <span className="text-brand-accent-mid text-sm">
                        ArrastrÃƒÂ¡ archivos o hacÃƒÂ© clic
                      </span>
                      <span className="text-brand-accent-mid text-xs">
                        ImÃƒÂ¡genes o videos
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {formData.pruebas.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-brand-text-light font-semibold">
                  Pruebas agregadas ({formData.pruebas.length})
                </p>
                {formData.pruebas.map((prueba: Prueba) => (
                  <div
                    key={prueba.id}
                    className="bg-brand-card p-3 rounded-lg border border-brand-accent-soft/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {prueba.tipo === 'imagen' ? (
                          <img
                            src={prueba.url}
                            alt="Preview"
                            className="w-full max-h-48 object-contain rounded-lg mb-2"
                          />
                        ) : prueba.tipo === 'video' ? (
                          <video
                            src={prueba.url}
                            controls
                            className="w-full max-h-48 rounded-lg mb-2"
                          >
                            Tu navegador no soporta la reproducciÃƒÂ³n de video.
                          </video>
                        ) : null}
                        <p className="text-xs text-brand-accent-mid uppercase">{prueba.tipo}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrueba(prueba.id)}
                        disabled={isLoading}
                        className="text-brand-accent-strong hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent-strong text-white py-3 px-4 rounded-lg transform transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Reporte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}