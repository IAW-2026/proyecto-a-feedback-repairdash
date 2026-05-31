'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { reportEvidenceSchema } from '@/lib/validation/reportEvidence';

interface ReportFormClientProps {
  reporteId: string;
  reportado: any;
  trabajo: any;
}

interface Prueba {
  id: string;
  tipo: string;
  url: string;
}

const STORAGE_KEY = (id: string) => `report_draft_${id}`;

export default function ReportFormClient({
  reporteId,
  reportado,
  trabajo,
}: ReportFormClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    descripcion: '',
    pruebas: [] as Prueba[],
  });

  const [uploading, setUploading] = useState(false);

  // Restaurar borrador de localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(reporteId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.descripcion === 'string') {
          setFormData({
            descripcion: parsed.descripcion,
            pruebas: Array.isArray(parsed.pruebas) ? parsed.pruebas : [],
          });
        }
      } catch { /* ignorar JSON inválido */ }
    }
  }, [reporteId]);

  // Guardar borrador en localStorage al cambiar
  useEffect(() => {
    if (!success) {
      localStorage.setItem(STORAGE_KEY(reporteId), JSON.stringify(formData));
    }
  }, [formData, reporteId, success]);

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      descripcion: e.target.value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al subir archivo');
      }

      const { url, tipo } = await res.json();

      const newPrueba: Prueba = {
        id: `temp-${Date.now()}`,
        tipo,
        url,
      };

      setFormData((prev) => ({
        ...prev,
        pruebas: [...prev.pruebas, newPrueba],
      }));
    } catch (err: any) {
      setError(err.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemovePrueba = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pruebas: prev.pruebas.filter((p) => p.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.descripcion.trim()) {
      setError('La descripción del reporte es obligatoria');
      return;
    }

    if (formData.descripcion.trim().length < 20) {
      setError('La descripción debe tener al menos 20 caracteres');
      return;
    }

    if (formData.pruebas.length === 0) {
      setError('Debes agregar al menos una prueba');
      return;
    }

    setIsLoading(true);

    try {
      // Validar primera prueba con Zod
      const firstPrueba = formData.pruebas[0];
      const result = reportEvidenceSchema.safeParse({
        descripcion: formData.descripcion,
        url: firstPrueba.url,
        tipo: firstPrueba.tipo,
      });

      if (!result.success) {
        throw new Error(result.error.issues[0].message);
      }

      const response = await fetch(`/api/reports/${reporteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al resolver el reporte');
      }

      // Enviar pruebas adicionales
      for (let i = 1; i < formData.pruebas.length; i++) {
        const prueba = formData.pruebas[i];
        await fetch(`/api/reports/${reporteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            descripcion: `Prueba adicional`,
            url: prueba.url,
            tipo: prueba.tipo,
          }),
        });
      }

      // Limpiar borrador
      localStorage.removeItem(STORAGE_KEY(reporteId));
      setSuccess(true);

      setTimeout(() => {
        router.push('/reportes');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
        <div className="w-full max-w-[600px] text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-3xl font-bold text-[#fbdaf9] mb-2">¡Reporte enviado!</h2>
          <p className="text-[#c392dd] mb-6">
            Tu reporte ha sido registrado correctamente. Serás redirigido...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#271033] py-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[700px] mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#fbdaf9] mb-2">Resolver Reporte</h1>
          <p className="text-[#c392dd]">Proporciona detalles sobre el incidente y adjunta evidencias</p>
        </div>

        <div className="bg-[#3a1f52] rounded-xl p-6 border border-[#8d62a5]/20 mb-6 text-[#fbdaf9]">
          <h3 className="text-lg font-semibold mb-4">Información del Reporte</h3>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-[#c392dd]">Usuario reportado:</span> {reportado?.nombre}{' '}
              {reportado?.apellido}
            </p>
            <p>
              <span className="text-[#c392dd]">Tipo de trabajo:</span> {trabajo?.tipoDeTrabajo}
            </p>
            <p>
              <span className="text-[#c392dd]">ID del trabajo:</span> <code className="bg-[#2a0f3a] px-2 py-1 rounded">{trabajo?.id}</code>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#fbdaf9] font-semibold mb-2">
              Descripción del Incidente *
            </label>
            <p className="text-xs text-[#c392dd] mb-3">
              Cuéntanos qué sucedió. Mínimo 20 caracteres.
            </p>
            <textarea
              value={formData.descripcion}
              onChange={handleDescripcionChange}
              disabled={isLoading}
              className="w-full bg-[#3a1f52] border border-[#8d62a5]/30 rounded-lg p-4 text-[#fbdaf9] placeholder-[#8d62a5] focus:outline-none focus:border-[#f500f1] disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              rows={6}
              placeholder="Describe el incidente de forma clara y detallada..."
            />
            <p className="text-xs text-[#8d62a5] mt-2">
              {formData.descripcion.length} / 500 caracteres
            </p>
          </div>

          <div>
            <label className="block text-[#fbdaf9] font-semibold mb-2">
              Pruebas / Evidencias *
            </label>
            <p className="text-xs text-[#c392dd] mb-3">
              Sube imágenes o videos como evidencia. Mínimo 1 prueba requerida.
            </p>

            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploading
                    ? 'border-[#f500f1]/50 bg-[#3a1f52]/50'
                    : 'border-[#8d62a5]/30 bg-[#3a1f52] hover:border-[#f500f1]/40 hover:bg-[#3a1f52]/80'
                }`}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading || isLoading}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader size={24} className="animate-spin text-[#f500f1]" />
                    <span className="text-[#c392dd] text-sm">Subiendo archivo...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-[#c392dd]" />
                    <span className="text-[#c392dd] text-sm">
                      Haz clic para seleccionar archivos
                    </span>
                    <span className="text-[#8d62a5] text-xs">
                      Imágenes o videos
                    </span>
                  </div>
                )}
              </label>
            </div>

            {formData.pruebas.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[#fbdaf9] font-semibold">
                  Pruebas agregadas ({formData.pruebas.length})
                </p>
                {formData.pruebas.map((prueba) => (
                  <div
                    key={prueba.id}
                    className="bg-[#3a1f52] p-3 rounded-lg border border-[#8d62a5]/20"
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
                            Tu navegador no soporta la reproducción de video.
                          </video>
                        ) : null}
                        <p className="text-xs text-[#c392dd] uppercase">{prueba.tipo}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrueba(prueba.id)}
                        disabled={isLoading}
                        className="text-[#f500f1] hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0"
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
              className="flex-1 flex items-center justify-center gap-2 bg-[#f500f1] text-white py-3 px-4 rounded-lg transform transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold"
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
