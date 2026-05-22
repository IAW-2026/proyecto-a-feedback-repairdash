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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/reportes"
          className="flex items-center gap-2 text-[#c392dd] hover:text-[#f500f1] transition-colors mb-6 w-fit group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a reportes
        </Link>

        <div>
          <p className="text-[#8d62a5] text-sm font-semibold uppercase tracking-wider mb-2">
            Nuevo Reporte
          </p>
          <h1 className="font-gilroy font-bold text-4xl text-[#fbdaf9] mb-2">Crear reporte</h1>
          <p className="text-[#c392dd]">Completá los datos del incidente</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-[#3a1f52] rounded-xl p-8 border border-[#8d62a5]/30">
          {/* Campo: Trabajo relacionado */}
          <div className="mb-8">
            <label htmlFor="trabajo" className="block text-[#fbdaf9] font-gilroy font-bold mb-3">
              Trabajo relacionado
            </label>
            <select
              id="trabajo"
              value={trabajoSeleccionado}
              onChange={(e) => setTrabajoSeleccionado(e.target.value)}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 transition-all duration-200"
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
          <div className="mb-8">
            <label htmlFor="descripcion" className="block text-[#fbdaf9] font-gilroy font-bold mb-3">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describí detalladamente lo que ocurrió..."
              rows={4}
              className="w-full bg-[#271033] border border-[#8d62a5] text-[#fbdaf9] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f500f1] focus:border-transparent placeholder-[#8d62a5]/50 resize-none transition-all duration-200"
            />
          </div>

          {/* Campo: Pruebas */}
          <div className="mb-8">
            <label className="block text-[#fbdaf9] font-gilroy font-bold mb-3">
              Pruebas (imágenes o documentos)
            </label>

            {/* Zona de drag & drop */}
            <div className="border-2 border-dashed border-[#8d62a5] rounded-lg p-8 text-center bg-[#271033]/50 hover:border-[#f500f1]/60 hover:bg-[#271033]/70 transition-all duration-200 cursor-pointer group mb-4">
              <Upload size={32} className="mx-auto mb-3 text-[#8d62a5] group-hover:text-[#f500f1] transition-colors" />
              <p className="text-[#fbdaf9] font-gilroy font-medium mb-1">
                Arrastrá archivos o hacé clic para seleccionar
              </p>
              <p className="text-[#c392dd] text-sm">Soportados: JPG, PNG, PDF (máx. 5MB cada uno)</p>
            </div>

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <div className="space-y-2">
                <p className="text-[#c392dd] text-sm font-medium mb-3">Archivos cargados:</p>
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    onMouseEnter={() => setHoveredArchivoId(archivo.id)}
                    onMouseLeave={() => setHoveredArchivoId(null)}
                    className="flex items-center justify-between bg-[#271033] border border-[#8d62a5]/20 rounded-lg px-4 py-3 hover:border-[#f500f1]/40 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText
                        size={18}
                        className="text-[#c392dd] group-hover:text-[#f500f1] transition-colors"
                      />
                      <span className="text-[#fbdaf9] text-sm">{archivo.nombre}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveArchivo(archivo.id)}
                      className="text-[#8d62a5] hover:text-red-400 transition-colors p-1"
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
            className="w-full bg-[#f500f1] hover:bg-[#f500f1]/90 text-white font-gilroy font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Enviar reporte
          </button>
        </div>
      </form>
    </div>
  );
}
