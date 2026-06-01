'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AlertCircle, User, FileText, Calendar } from 'lucide-react'
import DropdownFilter from '@/components/DropdownFilter'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'

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
  estado: string
}

interface AdminReportesClientProps {
  reportes: Reporte[]
  page: number
  totalPaginas: number
  search: string
  total: number
  totalPendientes: number
  estado: string
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
    AFavor: { label: 'A Favor del Reportante', color: 'bg-[#4ade80]/20 text-[#8ae0a5]' },
    EnContra: { label: 'En Contra del Reportante', color: 'bg-[#ef5350]/20 text-[#ff9999]' },
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
  totalPendientes,
  estado,
}: AdminReportesClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams()
    const s = overrides.search ?? search
    const e = overrides.estado ?? estado
    const p = overrides.page ?? String(page)
    if (s) params.set('search', s)
    if (e) params.set('estado', e)
    params.set('page', p)
    return `${pathname}?${params.toString()}`
  }

  // ============================================
  // EFECTO: Debounce de búsqueda
  // ============================================
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      const newSearch = searchValue.trim()
      router.push(buildUrl({ search: newSearch, page: '1' }))
    }, 400)

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [searchValue, router, pathname, estado])

  // ============================================
  // HANDLERS: Navegación de paginación
  // ============================================

  const handlePage = (p: number) => {
    router.push(buildUrl({ page: String(p) }))
  }

  const handleEstadoFilter = (e: string) => {
    router.push(buildUrl({ estado: e, page: '1' }))
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
              Revisa y resuelve los {totalPendientes} reporte{totalPendientes !== 1 ? 's' : ''} pendiente{totalPendientes !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Badge de contador */}
          <div className="bg-[#3a1f52] px-6 py-3 rounded-xl border border-[#f500f1]/30 flex items-center gap-3">
            <AlertCircle size={24} className="text-[#f500f1]" />
            <div>
              <div className="text-[#c392dd] text-sm">Pendientes</div>
              <div className="text-[#f500f1] font-bold text-2xl">{totalPendientes}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BARRA DE BÚSQUEDA + FILTRO ========== */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar por nombre del reportante o reportado..."
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>
        <DropdownFilter
          value={estado}
          onChange={handleEstadoFilter}
          options={[
            { value: '', label: 'Todos' },
            { value: 'CREADO', label: 'Creado' },
            { value: 'PRUEBAS_AGREGADAS', label: 'Pruebas Agregadas' },
            { value: 'RESUELTO', label: 'Resuelto' },
          ]}
        />
      </div>

      {/* ========== ESTADO VACÍO ========== */}
      {hasNoReportes ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-[#3a1f52]/50 p-6 rounded-lg mb-4">
            <FileText size={48} className="text-[#8d62a5] mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-[#c392dd] mb-2">
            {hasSearch ? 'No se encontraron reportes' : 'No hay reportes en este estado'}
          </h3>
          <p className="text-[#8d62a5] text-sm">
            {hasSearch
              ? 'Intenta con otros criterios de búsqueda'
              : 'Prueba seleccionando otro filtro de estado'}
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
                  onClick={() => router.push(`/admin/reportes/${reporte.id}`)}
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
                          <span className="text-[#c392dd]"> reportó a </span>
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
                    <span className="px-4 py-2 bg-[#f500f1]/20 text-[#ff66ff] rounded-lg text-sm font-medium">
                      Ver detalles
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
