'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';

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

/**
 * Componente Client para el formulario de resolución de reporte.
 *
 * Funcionalidad:
 * - Permite al usuario ingresar una descripción del incidente
 * - Permite agregar múltiples pruebas/evidencias con URLs
 * - Valida el formulario antes de enviarlo
 * - Envía los datos al endpoint PUT /api/reports/[id]
 *
 * Cada prueba = 1 llamada a PUT /api/reports/[id] con { descripcion, url, tipo }
 */
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
    newPruebaUrl: '',
    newPruebaTipo: 'imagen',
  });

  // Manejo de cambios en la descripción
  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      descripcion: e.target.value,
    }));
  };

  // Agregar una prueba manual
  const handleAddPrueba = () => {
    if (!formData.newPruebaUrl.trim()) {
      setError('Ingresa una URL válida');
      return;
    }

    try {
      new URL(formData.newPruebaUrl);
    } catch {
      setError('La URL no es válida');
      return;
    }

    const newPrueba: Prueba = {
      id: `temp-${Date.now()}`,
      tipo: formData.newPruebaTipo,
      url: formData.newPruebaUrl,
    };

    setFormData((prev) => ({
      ...prev,
      pruebas: [...prev.pruebas, newPrueba],
      newPruebaUrl: '',
    }));

    setError(null);
  };

  // Remover una prueba
  const handleRemovePrueba = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pruebas: prev.pruebas.filter((p) => p.id !== id),
    }));
  };

  // Submit del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // VALIDACIÓN LOCAL
      if (!formData.descripcion.trim()) {
        throw new Error('La descripción del reporte es obligatoria');
      }

      if (formData.descripcion.trim().length < 20) {
        throw new Error('La descripción debe tener al menos 20 caracteres');
      }

      if (formData.pruebas.length === 0) {
        throw new Error('Debes agregar al menos una prueba');
      }

      // Enviar primera prueba con descripción
      const firstPrueba = formData.pruebas[0];

      const response = await fetch(`/api/reports/${reporteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: formData.descripcion,
          url: firstPrueba.url,
          tipo: firstPrueba.tipo,
        }),
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descripcion: `Prueba adicional`,
            url: prueba.url,
            tipo: prueba.tipo,
          }),
        });
      }

      // ÉXITO
      setSuccess(true);

      // Redirigir después de 2 segundos
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#fbdaf9] mb-2">Resolver Reporte</h1>
          <p className="text-[#c392dd]">Proporciona detalles sobre el incidente y adjunta evidencias</p>
        </div>

        {/* Resumen de la situación */}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Descripción */}
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

          {/* Pruebas/Evidencias */}
          <div>
            <label className="block text-[#fbdaf9] font-semibold mb-2">
              Pruebas / Evidencias *
            </label>
            <p className="text-xs text-[#c392dd] mb-3">
              Ingresa URLs de tus evidencias (imágenes, videos, documentos). Mínimo 1 prueba requerida.
            </p>

            {/* Agregar prueba */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-[#c392dd] mb-2">Tipo de Prueba</label>
                <select
                  value={formData.newPruebaTipo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPruebaTipo: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="w-full bg-[#3a1f52] border border-[#8d62a5]/30 rounded-lg p-2 text-[#fbdaf9] focus:outline-none focus:border-[#f500f1] disabled:opacity-50"
                >
                  <option value="imagen">Imagen</option>
                  <option value="video">Video</option>
                  <option value="documento">Documento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#c392dd] mb-2">URL de la Prueba</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.newPruebaUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newPruebaUrl: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                    placeholder="https://example.com/evidencia.jpg"
                    className="flex-1 bg-[#3a1f52] border border-[#8d62a5]/30 rounded-lg p-2 text-[#fbdaf9] placeholder-[#8d62a5] focus:outline-none focus:border-[#f500f1] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrueba}
                    disabled={isLoading}
                    className="bg-[#f500f1] text-white px-4 py-2 rounded-lg hover:bg-[#d400c9] transition-colors disabled:opacity-50"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de pruebas agregadas */}
            {formData.pruebas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-[#fbdaf9] font-semibold">
                  Pruebas agregadas ({formData.pruebas.length})
                </p>
                {formData.pruebas.map((prueba, index) => (
                  <div
                    key={prueba.id}
                    className="flex items-center justify-between bg-[#3a1f52] p-3 rounded-lg border border-[#8d62a5]/20"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#c392dd] uppercase">{prueba.tipo}</p>
                      <p className="text-sm text-[#fbdaf9] truncate">{prueba.url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePrueba(prueba.id)}
                      disabled={isLoading}
                      className="text-[#f500f1] hover:text-red-500 transition-colors disabled:opacity-50 ml-2 flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Errores */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Botones de acción */}
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
