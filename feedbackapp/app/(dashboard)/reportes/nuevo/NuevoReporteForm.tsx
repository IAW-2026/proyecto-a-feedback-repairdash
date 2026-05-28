'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, X, Send, Loader } from 'lucide-react';

interface Trabajo {
  id: string;
  display: string;
  tipo: string;
  nombreOtro: string;
  fecha: string;
}

interface Archivo {
  id: string;
  nombre: string;
  url: string;
  tipo: 'imagen' | 'video' | 'pdf';
  subiendo: boolean;
  tamaño: number;
}

interface Props {
  trabajos: Trabajo[];
}

export default function NuevoReporteForm({ trabajos }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Determinar tipo de archivo
  const getTipo = (file: File): 'imagen' | 'video' | 'pdf' => {
    if (file.type.startsWith('image/')) return 'imagen';
    if (file.type.startsWith('video/')) return 'video';
    return 'pdf';
  };

  // Subir archivo a Cloudinary
  const subirACloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: 'POST', body: formData }
    );

    if (!res.ok) {
      throw new Error('Error al subir archivo a Cloudinary');
    }

    const data = await res.json();
    return data.secure_url as string;
  };

  // Validar tamaño de archivo
  const validarTamano = (file: File, tipo: 'imagen' | 'video' | 'pdf'): string | null => {
    const MAX_IMAGEN = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO = 35 * 1024 * 1024; // 35MB

    if (tipo === 'video' && file.size > MAX_VIDEO) {
      return `El video ${file.name} supera los 35MB`;
    }

    if ((tipo === 'imagen' || tipo === 'pdf') && file.size > MAX_IMAGEN) {
      return `${tipo === 'imagen' ? 'La imagen' : 'El archivo'} ${file.name} supera los 5MB`;
    }

    return null;
  };

  // Manejar selección de archivos
  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;

    const nuevosArchivos = Array.from(files);

    for (const file of nuevosArchivos) {
      const tipo = getTipo(file);
      
      // Validar tamaño
      const errorTamano = validarTamano(file, tipo);
      if (errorTamano) {
        setError(errorTamano);
        continue;
      }

      // Crear ID temporal
      const id = Math.random().toString(36).substr(2, 9);

      // Agregar archivo al estado con subiendo: true
      setArchivos((prev) => [
        ...prev,
        {
          id,
          nombre: file.name,
          url: '',
          tipo,
          subiendo: true,
          tamaño: file.size,
        },
      ]);

      try {
        // Subir a Cloudinary
        const url = await subirACloudinary(file);

        // Actualizar el estado con la URL
        setArchivos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, url, subiendo: false } : a
          )
        );
      } catch (err) {
        // Eliminar archivo si falla la subida
        setArchivos((prev) => prev.filter((a) => a.id !== id));
        setError('Error al subir uno o más archivos. Intenta de nuevo.');
      }
    }
  };

  // Click en la zona de drag & drop
  const handleDropZoneClick = () => {
    inputRef.current?.click();
  };

  // Drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#f500f1]/60', 'bg-[#271033]/70');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-[#f500f1]/60', 'bg-[#271033]/70');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#f500f1]/60', 'bg-[#271033]/70');
    handleFileChange(e.dataTransfer.files);
  };

  // Eliminar archivo
  const handleRemoveArchivo = (id: string) => {
    setArchivos(archivos.filter((archivo) => archivo.id !== id));
  };

  // Validar y enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!trabajoSeleccionado) {
      setError('Seleccioná un trabajo');
      return;
    }

    if (!descripcion.trim()) {
      setError('Escribí una descripción');
      return;
    }

    // Verificar que no hay archivos subiendo
    const haySubiendo = archivos.some((a) => a.subiendo);
    if (haySubiendo) {
      setError('Esperá a que terminen de subir los archivos');
      return;
    }

    setEnviando(true);

    try {
      const response = await fetch('/api/reportes/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTrabajo: trabajoSeleccionado,
          descripcion: descripcion.trim(),
          pruebas: archivos.map((a) => ({ 
            url: a.url, 
            tipo: a.tipo,
            tamaño: a.tamaño,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el reporte');
      }

      // Éxito - redirigir
      router.push('/reportes');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al crear el reporte. Intenta de nuevo.'
      );
      setEnviando(false);
    }
  };

  const haySubiendo = archivos.some((a) => a.subiendo);

  return (
    <>
      {/* Link para volver */}
      <Link
        href="/reportes"
        className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[#c392dd] hover:text-[#f500f1] transition-colors mb-[clamp(1rem,3vw,1.5rem)] w-fit group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
        <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Volver a reportes
        </span>
      </Link>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/30">
          {/* Error */}
          {error && (
            <div className="mb-[clamp(1rem,4vw,1.5rem)] bg-red-900/30 border border-red-500/50 rounded-lg p-[clamp(0.75rem,2vw,1rem)] text-red-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              {error}
            </div>
          )}

          {/* Campo: Trabajo relacionado */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label
              htmlFor="trabajo"
              className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Trabajo relacionado
            </label>
            <select
              id="trabajo"
              value={trabajoSeleccionado}
              onChange={(e) => setTrabajoSeleccionado(e.target.value)}
              disabled={enviando}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 transition-all duration-200 min-h-[44px] disabled:opacity-50"
              style={{ fontSize: '16px' }}
            >
              <option value="">
                {trabajos.length === 0
                  ? 'No tenés trabajos para reportar'
                  : 'Seleccioná un trabajo...'}
              </option>
              {trabajos.map((trabajo) => (
                <option key={trabajo.id} value={trabajo.id}>
                  {trabajo.display}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Descripción */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label
              htmlFor="descripcion"
              className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={enviando}
              placeholder="Describí detalladamente lo que ocurrió..."
              rows={4}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 resize-none transition-all duration-200 min-h-[120px] disabled:opacity-50"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Campo: Pruebas */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label
              className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Pruebas (imágenes, videos o documentos)
            </label>

            {/* Input oculto */}
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
              disabled={enviando}
            />

            {/* Zona de drag & drop */}
            <div
              onClick={handleDropZoneClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#8d62a5] rounded-lg p-[clamp(1rem,4vw,2rem)] text-center bg-[#271033]/50 hover:border-[#f500f1]/60 hover:bg-[#271033]/70 transition-all duration-200 cursor-pointer group mb-[clamp(0.75rem,2vw,1rem)]"
            >
              <Upload
                size={32}
                className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#8d62a5] group-hover:text-[#f500f1] transition-colors flex-shrink-0"
              />
              <p
                className="text-[#fbdaf9] font-gilroy font-medium mb-[clamp(0.375rem,1vw,0.5rem)]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
              >
                Arrastrá archivos o hacé clic para seleccionar
              </p>
              <p
                className="text-[#c392dd]"
                style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
              >
                Soportados: JPG, PNG, MP4, PDF (Imágenes y PDFs: 5MB, Videos: 35MB)
              </p>
            </div>

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <div className="space-y-[clamp(0.5rem,1vw,0.75rem)]">
                <p
                  className="text-[#c392dd] font-medium mb-[clamp(0.75rem,2vw,1rem)]"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                >
                  Archivos cargados:
                </p>
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="flex items-center justify-between bg-[#271033] border border-[#8d62a5]/20 rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] hover:border-[#f500f1]/40 transition-all duration-200 group min-h-[44px]"
                  >
                    <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] min-w-0">
                      <FileText
                        size={18}
                        className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors flex-shrink-0"
                      />
                      <span
                        className="text-[#fbdaf9] truncate"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                      >
                        {archivo.nombre}
                      </span>
                      {archivo.subiendo && (
                        <span className="text-[#f500f1] text-xs ml-2">
                          Subiendo...
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArchivo(archivo.id)}
                      disabled={archivo.subiendo || enviando}
                      className="text-[#8d62a5] hover:text-red-400 transition-colors p-1 flex-shrink-0 disabled:opacity-50"
                      aria-label="Eliminar archivo"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={enviando || haySubiendo}
            className="w-full bg-[#f500f1] hover:bg-[#f500f1]/90 text-white font-gilroy font-bold px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
          >
            {enviando ? (
              <>
                <Loader size={20} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar reporte
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
