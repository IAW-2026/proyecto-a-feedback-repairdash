'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle2, XCircle } from 'lucide-react';

interface Archivo {
  id: string;
  nombre: string;
  tipo: string;
}

interface Reporte {
  id: string;
  usuario: string;
  fecha: string;
  categoria: string;
  descripcion: string;
  trabajoRelacionado: string;
  archivos: Archivo[];
}

const mockReportes: Reporte[] = [
  {
    id: '1',
    usuario: 'Carlos Pérez',
    fecha: '2026-05-22',
    categoria: 'Plomería',
    descripcion: 'El servicio no fue completado correctamente. Las tuberías aún presentan fugas.',
    trabajoRelacionado: 'Reparación de tuberías - Baño principal',
    archivos: [
      { id: '1', nombre: 'foto_daño_1.jpg', tipo: 'image' },
      { id: '2', nombre: 'foto_daño_2.jpg', tipo: 'image' },
    ],
  },
  {
    id: '2',
    usuario: 'María López',
    fecha: '2026-05-21',
    categoria: 'Electricidad',
    descripcion: 'La instalación eléctrica presenta problemas. Hay cortocircuitos intermitentes en varios puntos.',
    trabajoRelacionado: 'Revisión de panel eléctrico',
    archivos: [
      { id: '1', nombre: 'informe_técnico.pdf', tipo: 'pdf' },
      { id: '2', nombre: 'mediciones_voltaje.jpg', tipo: 'image' },
    ],
  },
  {
    id: '3',
    usuario: 'Juan González',
    fecha: '2026-05-20',
    categoria: 'Carpintería',
    descripcion: 'Los muebles entregados no coinciden con las especificaciones acordadas. Las medidas están fuera de tolerancia.',
    trabajoRelacionado: 'Construcción de armarios personalizados',
    archivos: [
      { id: '1', nombre: 'planos_original.pdf', tipo: 'pdf' },
      { id: '2', nombre: 'foto_entrega.jpg', tipo: 'image' },
    ],
  },
];

export default function AdminReportesPage() {
  const [selectedReport, setSelectedReport] = useState<Reporte | null>(null);

  const handleResolverAFavor = () => {
    console.log('Reporte resuelto a favor:', selectedReport?.id);
    setSelectedReport(null);
  };

  const handleResolverEnContra = () => {
    console.log('Reporte resuelto en contra:', selectedReport?.id);
    setSelectedReport(null);
  };

  if (selectedReport) {
    return (
      <div className="w-full">
        {/* Botón Volver */}
        <button
          onClick={() => setSelectedReport(null)}
          className="mb-8 flex items-center gap-2 text-[#c392dd] hover:text-[#fbdaf9] cursor-pointer transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a reportes</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold text-[#c392dd] uppercase tracking-wider mb-2">
            Nuevo Reporte
          </div>
          <h1 className="text-4xl font-bold text-[#fbdaf9] mb-2">Detalle del reporte</h1>
          <p className="text-[#c392dd]">Datos del incidente reportado</p>
        </div>

        {/* Tarjeta Principal */}
        <div className="bg-[#3a1f52] border border-[#8d62a5]/20 rounded-xl p-6 flex flex-col gap-6">
            {/* Sección: Trabajo Relacionado */}
            <div>
              <label className="text-sm font-bold text-[#fbdaf9] mb-2 block">
                Trabajo relacionado
              </label>
              <div className="bg-[#271033]/40 border border-[#8d62a5]/30 rounded-md px-4 py-3 text-[#c392dd]">
                {selectedReport.trabajoRelacionado}
              </div>
            </div>

            {/* Sección: Descripción */}
            <div>
              <label className="text-sm font-bold text-[#fbdaf9] mb-2 block">
                Descripción
              </label>
              <div className="bg-[#271033]/40 border border-[#8d62a5]/20 rounded-md p-4 text-[#c392dd] min-h-24">
                {selectedReport.descripcion}
              </div>
            </div>

            {/* Sección: Pruebas */}
            <div>
              <label className="text-sm font-bold text-[#fbdaf9] mb-3 block">
                Pruebas (imágenes o documentos)
              </label>
              <div className="space-y-2">
                {selectedReport.archivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="bg-[#271033]/20 border border-[#8d62a5]/20 rounded-md p-3 flex items-center justify-between hover:bg-[#3a1f52]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-[#c392dd]" />
                      <span className="text-[#c392dd] text-sm">{archivo.nombre}</span>
                    </div>
                    <button className="text-[#c392dd] hover:text-[#f500f1] transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="border-t border-[#8d62a5]/20 pt-6">
              <p className="text-sm text-[#c392dd] mb-1">
                <span className="font-semibold text-[#fbdaf9]">Reportado por:</span> {selectedReport.usuario}
              </p>
              <p className="text-sm text-[#c392dd]">
                <span className="font-semibold text-[#fbdaf9]">Fecha:</span> {selectedReport.fecha}
              </p>
            </div>

            {/* Botones de Resolución */}
            <div className="flex gap-4 mt-6 border-t border-[#8d62a5]/20 pt-6">
              <button
                onClick={handleResolverAFavor}
                className="flex-1 bg-[#f500f1] hover:bg-[#f500f1]/90 text-[#fbdaf9] font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                <CheckCircle2 size={20} />
                Fallar a favor
              </button>
              <button
                onClick={handleResolverEnContra}
                className="flex-1 bg-transparent border border-[#c392dd] hover:border-[#fbdaf9] text-[#c392dd] hover:text-[#fbdaf9] font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                <XCircle size={20} />
                Fallar en contra
              </button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Título */}
      <h1 className="text-4xl font-bold text-[#fbdaf9] mb-8">Reportes Pendientes</h1>

      {/* Lista de Reportes */}
      <div className="space-y-0">
          {mockReportes.map((reporte, index) => (
            <div
              key={reporte.id}
              onClick={() => setSelectedReport(reporte)}
              className={`border-b border-[#8d62a5]/20 pb-4 mb-4 p-2 -ml-2 rounded-lg cursor-pointer transition-colors hover:bg-[#3a1f52]/30 ${
                index === mockReportes.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {/* Fila 1: Usuario y Fecha */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#fbdaf9] font-semibold">{reporte.usuario}</span>
                <span className="text-[#c392dd] text-sm">{reporte.fecha}</span>
              </div>

              {/* Fila 2: Categoría */}
              <div className="mb-2">
                <span className="text-xs font-medium text-[#f500f1]">{reporte.categoria}</span>
              </div>

              {/* Fila 3: Descripción (extracto) */}
              <div className="text-[#c392dd] text-sm line-clamp-2">
                {reporte.descripcion}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
