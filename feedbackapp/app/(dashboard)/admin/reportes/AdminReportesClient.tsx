'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AlertCircle, Search, User, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

// ============================================
// INTERFACES Y TIPOS
// ============================================

interface Usuario {
  id: string
  nombre: string | null
  apellido: string | null
  rol: string
}

interface Trabajo {
  id: string
  tipoDeTrabajo: string
  fechaFin: Date | null
}

interface Reporte {
  id: string
  trabajo: Trabajo
  reportante: Usuario
  reportado: Usuario
  resolucion: string
  decision: string | null
  estaCompleto: boolean
}

interface AdminReportesClientProps {
  reportes: Reporte[]
  page: number
  totalPaginas: number
  search: string
  total: number
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Formatea una fecha al formato "12 de Marzo de 2026"
 */
function formatDate(date: Date | null): string {
  if (!date) return 'Fecha no disponible'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

/**
 * Obtiene el nombre completo de un usuario
 */
function getNombreCompleto(usuario: Usuario): string {
  if (!usuario) return 'Usuario desconocido'
  const nombre = usuario.nombre || ''
  const apellido = usuario.apellido || ''
  return `${nombre} ${apellido}`.trim()
}

/**
 * Obtiene el badge de estado del reporte
 */
function getEstadoBadge(resolucion: string): { label: string; color: string } {
  const estados: Record<string, { label: string; color: string }> = {
    SinResolver: { label: 'Sin Resolver', color: 'bg-[#8d62a5]/20 text-[#f500f1]' },
    Resuelto: { label: 'Resuelto', color: 'bg-[#6ba587]/20 text-[#4ade80]' },
  }
  return estados[resolucion] || { label: 'Desconocido', color: 'bg-[#8d62a5]/20 text-[#c392dd]' }
}

/**
 * Obtiene el badge de decisión (si existe)
 */
function getDecisionBadge(decision: string | null): { label: string; color: string } | null {
  if (!decision) return null
  const decisiones: Record<string, { label: string; color: string }> = {
    AFavor: { label: 'A Favor del Reportante', color: 'bg-[#4ade80]/20 text-[#6ba587]' },
    EnContra: { label: 'En Contra del Reportante', color: 'bg-[#ef5350]/20 text-[#ff6b6b]' },
  }
  return decisiones[decision] || null
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function AdminReportesClient({
  reportes,
  page,
  totalPaginas,
  search,
  total,
}: AdminReportesClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // ============================================
  // EFECTO: Debounce de búsqueda
  // ============================================
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      const newSearch = searchValue.trim()
      router.push(
        `${pathname}?search=${encodeURIComponent(newSearch)}&page=1`
      )
    }, 400)

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [searchValue, router, pathname])

  // ============================================
  // HANDLERS: Navegación de paginación
  // ============================================

  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(
        `${pathname}?search=${encodeURIComponent(search)}&page=${page - 1}`
      )
    }
  }

  const handleNextPage = () => {
    if (page < totalPaginas) {
      router.push(
        `${pathname}?search=${encodeURIComponent(search)}&page=${page + 1}`
      )
    }
  }

  // ============================================
  // ESTADO: Determinar si hay resultados
  // ============================================
  const hasNoReportes = reportes.length === 0
  const hasSearch = search.trim() !== ''

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="p-8">
      {/* ========== HEADER ========== */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#f500f1] mb-2 font-semibold">
              PANEL DE ADMINISTRACIÓN
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Gestión de Conflictos
            </h1>
            <p className="text-[#c392dd]">
              Revisa y resuelve los {total} reporte{total !== 1 ? 's' : ''} pendiente{total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Badge de contador */}
          <div className="bg-[#3a1f52] px-6 py-3 rounded-xl border border-[#f500f1]/30 flex items-center gap-3">
            <AlertCircle size={24} className="text-[#f500f1]" />
            <div>
              <div className="text-[#c392dd] text-sm">Pendientes</div>
              <div className="text-[#f500f1] font-bold text-2xl">{total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BARRA DE BÚSQUEDA ========== */}
      <div className="mb-8 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d62a5]"
        />
        <input
          type="text"
          placeholder="Buscar por nombre del reportante o reportado..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#271033] border border-[#8d62a5] rounded-lg text-[#fbdaf9] placeholder-[#8d62a5]/50 focus:outline-none focus:ring-2 focus:ring-[#f500f1] transition-all duration-200"
        />
      </div>

      {/* ========== ESTADO VACÍO ========== */}
      {hasNoReportes ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-[#3a1f52]/50 p-6 rounded-lg mb-4">
            <FileText size={48} className="text-[#8d62a5] mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-[#c392dd] mb-2">
            {hasSearch ? 'No se encontraron reportes' : 'No hay reportes pendientes'}
          </h3>
          <p className="text-[#8d62a5] text-sm">
            {hasSearch
              ? 'Intenta con otros criterios de búsqueda'
              : 'Todos los conflictos han sido resueltos'}
          </p>
        </div>
      ) : (
        <>
          {/* ========== LISTA DE REPORTES ========== */}
          <div className="space-y-4 mb-8">
            {reportes.map((reporte) => {
              const estadoBadge = getEstadoBadge(reporte.resolucion)
              const decisionBadge = getDecisionBadge(reporte.decision)
              const reportanteNombre = getNombreCompleto(reporte.reportante)
              const reportadoNombre = getNombreCompleto(reporte.reportado)

              return (
                <div
                  key={reporte.id}
                  className="bg-[#3a1f52]/40 border border-[#8d62a5]/30 rounded-lg p-6 hover:border-[#f500f1]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#f500f1]/10 cursor-pointer"
                >
                  {/* Encabezado del reporte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Nombre de usuarios */}
                      <div className="flex items-center gap-3 mb-2">
                        <User size={18} className="text-[#f500f1]" />
                        <span className="text-sm text-[#c392dd]">
                          <span className="font-semibold text-white">{reportanteNombre}</span>
                          <span className="text-[#8d62a5]"> reportó a </span>
                          <span className="font-semibold text-white">{reportadoNombre}</span>
                        </span>
                      </div>

                      {/* Tipo de trabajo */}
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-[#8d62a5]" />
                        <span className="text-sm text-[#c392dd]">
                          Trabajo: <span className="font-medium text-white">{reporte.trabajo.tipoDeTrabajo}</span>
                        </span>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#8d62a5]" />
                        <span className="text-sm text-[#c392dd]">
                          {formatDate(reporte.trabajo.fechaFin)}
                        </span>
                      </div>
                    </div>

                    {/* Badges de estado y decisión */}
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoBadge.color}`}>
                        {estadoBadge.label}
                      </span>
                      {decisionBadge && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${decisionBadge.color}`}>
                          {decisionBadge.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Línea divisoria */}
                  <div className="h-px bg-gradient-to-r from-[#8d62a5]/20 to-transparent mb-4" />

                  {/* CTA: Botón para ver detalles */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        // TODO: Implementar navegación a página de detalles del reporte
                        // router.push(`/admin/reportes/${reporte.id}`)
                      }}
                      className="px-4 py-2 bg-[#f500f1]/20 text-[#f500f1] rounded-lg text-sm font-medium hover:bg-[#f500f1]/30 transition-all duration-200"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ========== PAGINACIÓN ========== */}
          <div className="flex items-center justify-between">
            <div className="text-[#c392dd] text-sm">
              Página <span className="font-bold text-white">{page}</span> de{' '}
              <span className="font-bold text-white">{totalPaginas}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  page === 1
                    ? 'border-[#8d62a5]/20 text-[#8d62a5]/50 cursor-not-allowed'
                    : 'border-[#8d62a5] text-[#8d62a5] hover:bg-[#8d62a5]/20 hover:text-[#f500f1]'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextPage}
                disabled={page === totalPaginas}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  page === totalPaginas
                    ? 'border-[#8d62a5]/20 text-[#8d62a5]/50 cursor-not-allowed'
                    : 'border-[#8d62a5] text-[#8d62a5] hover:bg-[#8d62a5]/20 hover:text-[#f500f1]'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
