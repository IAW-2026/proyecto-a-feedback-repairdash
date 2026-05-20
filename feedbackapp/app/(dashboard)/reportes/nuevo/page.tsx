'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, X, Send } from 'lucide-react';

// Mock data para trabajos disponibles
const trabajosMock = [
  'Plomería con Carlos Pérez - 10/05/2025',
  'Electricidad con Laura Gómez - 20/04/2025',
  'Pintura con Marco Johnson - 15/05/2025',
];

// Mock data para archivos cargados
const archivosMock = [
  { id: '1', nombre: 'foto_daño_1.jpg' },
  { id: '2', nombre: 'contrato_firmado.pdf' },
];

export default function NuevoReportePage() {
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState(archivosMock);
  const [hoveredArchivoId, setHoveredArchivoId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handler vacío - sin funcionalidad real
    console.log('Formulario enviado:', {
      trabajo: trabajoSeleccionado,
      descripcion,
      archivos,
    });
  };

  const handleRemoveArchivo = (id: string) => {
    setArchivos(archivos.filter((archivo) => archivo.id !== id));
  };

  return (
    <div className="p-[clamp(1rem,4vw,2rem)] max-w-full md:max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-[clamp(1.5rem,4vw,2rem)]">
        <Link
          href="/reportes"
          className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[#c392dd] hover:text-[#f500f1] transition-colors mb-[clamp(1rem,3vw,1.5rem)] w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
          <span style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Volver a reportes</span>
        </Link>

        <div>
          <p className="text-[#8d62a5] font-semibold uppercase tracking-wider mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
            Nuevo Reporte
          </p>
          <h1 className="font-gilroy font-bold text-[#fbdaf9] mb-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)' }}>
            Crear reporte
          </h1>
          <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
            Completá los datos del incidente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-[#3a1f52] rounded-xl p-[clamp(1rem,4vw,2rem)] border border-[#8d62a5]/30">
          {/* Campo: Trabajo relacionado */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label htmlFor="trabajo" className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Trabajo relacionado
            </label>
            <select
              id="trabajo"
              value={trabajoSeleccionado}
              onChange={(e) => setTrabajoSeleccionado(e.target.value)}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 transition-all duration-200 min-h-[44px]"
              style={{ fontSize: '16px' }}
            >
              <option value="">Seleccioná un trabajo...</option>
              {trabajosMock.map((trabajo, index) => (
                <option key={index} value={trabajo}>
                  {trabajo}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Descripción */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label htmlFor="descripcion" className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describí detalladamente lo que ocurrió..."
              rows={4}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 resize-none transition-all duration-200 min-h-[120px]"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Campo: Pruebas */}
          <div className="mb-[clamp(1.5rem,4vw,2rem)]">
            <label className="block text-[#fbdaf9] font-gilroy font-bold mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Pruebas (imágenes o documentos)
            </label>

            {/* Zona de drag & drop */}
            <div className="border-2 border-dashed border-[#8d62a5] rounded-lg p-[clamp(1rem,4vw,2rem)] text-center bg-[#271033]/50 hover:border-[#f500f1]/60 hover:bg-[#271033]/70 transition-all duration-200 cursor-pointer group mb-[clamp(0.75rem,2vw,1rem)]">
              <Upload size={32} className="mx-auto mb-[clamp(0.75rem,2vw,1rem)] text-[#8d62a5] group-hover:text-[#f500f1] transition-colors flex-shrink-0" />
              <p className="text-[#fbdaf9] font-gilroy font-medium mb-[clamp(0.375rem,1vw,0.5rem)]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Arrastrá archivos o hacé clic para seleccionar
              </p>
              <p className="text-[#c392dd]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Soportados: JPG, PNG, PDF (máx. 5MB cada uno)
              </p>
            </div>

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <div className="space-y-[clamp(0.5rem,1vw,0.75rem)]">
                <p className="text-[#c392dd] font-medium mb-[clamp(0.75rem,2vw,1rem)]" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Archivos cargados:
                </p>
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    onMouseEnter={() => setHoveredArchivoId(archivo.id)}
                    onMouseLeave={() => setHoveredArchivoId(null)}
                    className="flex items-center justify-between bg-[#271033] border border-[#8d62a5]/20 rounded-lg px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.625rem,2vw,0.875rem)] hover:border-[#f500f1]/40 transition-all duration-200 group min-h-[44px]"
                  >
                    <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] min-w-0">
                      <FileText
                        size={18}
                        className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors flex-shrink-0"
                      />
                      <span className="text-[#fbdaf9] truncate" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                        {archivo.nombre}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArchivo(archivo.id)}
                      className="text-[#8d62a5] hover:text-red-400 transition-colors p-1 flex-shrink-0"
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
            className="w-full bg-[#f500f1] hover:bg-[#f500f1]/90 text-white font-gilroy font-bold px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
          >
            <Send size={20} />
            Enviar reporte
          </button>
        </div>
      </form>
    </div>
  );
}
