'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, User, FileText, Calendar } from 'lucide-react'
import EstadoBadge from '@/components/EstadoBadge'
import DecisionBadge from '@/components/DecisionBadge'
import DropdownFilter from '@/components/DropdownFilter'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import { useSearch } from '@/hooks/useSearch'
import type { Reporte, UsuarioBase } from '@/types'

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
import { formatDate } from '@/lib/dates'

/**
 * Obtiene el nombre completo de un usuario
 */
function getNombreCompleto(usuario: UsuarioBase): string {
  if (!usuario) return 'Usuario desconocido'
  const nombre = usuario.nombre || ''
  const apellido = usuario.apellido || ''
  return `${nombre} ${apellido}`.trim()
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

  const { searchValue, setSearchValue, handlePage, handleFilterChange } = useSearch({
    search,
    filters: { estado },
  })

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
            <div className="text-xs uppercase tracking-widest text-brand-accent-mid mb-2 font-semibold">
              PANEL DE ADMINISTRACIÃ“N
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              GestiÃ³n de Conflictos
            </h1>
            <p className="text-brand-accent-mid">
              RevisÃ¡ y resolvÃ© los {totalPendientes} reporte{totalPendientes !== 1 ? 's' : ''} pendiente{totalPendientes !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Badge de contador */}
          <div className="bg-brand-card px-6 py-3 rounded-xl border border-brand-accent-strong/30 flex items-center gap-3">
            <AlertCircle size={24} className="text-brand-accent-strong" />
            <div>
              <div className="text-brand-accent-mid text-sm">Pendientes</div>
              <div className="text-brand-accent-strong font-bold text-2xl">{totalPendientes}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BARRA DE BÃšSQUEDA + FILTRO ========== */}
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
          onChange={(e) => handleFilterChange('estado', e)}
          options={[
            { value: '', label: 'Todos' },
            { value: 'CREADO', label: 'Creado' },
            { value: 'PRUEBAS_AGREGADAS', label: 'Pruebas Agregadas' },
            { value: 'RESUELTO', label: 'Resuelto' },
          ]}
        />
      </div>

      {/* ========== ESTADO VACÃO ========== */}
      {hasNoReportes ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-brand-card/50 p-6 rounded-lg mb-4">
            <FileText size={48} className="text-brand-accent-soft mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-brand-accent-mid mb-2">
            {hasSearch ? 'No se encontraron reportes' : 'No hay reportes en este estado'}
          </h3>
          <p className="text-brand-accent-soft text-sm">
            {hasSearch
              ? 'Intenta con otros criterios de bÃºsqueda'
              : 'Prueba seleccionando otro filtro de estado'}
          </p>
        </div>
      ) : (
        <>
          {/* ========== LISTA DE REPORTES ========== */}
          <div className="space-y-4 mb-8">
            {reportes.map((reporte) => {
              const reportanteNombre = getNombreCompleto(reporte.reportante)
              const reportadoNombre = getNombreCompleto(reporte.reportado)

              return (
                <div
                  key={reporte.id}
                  onClick={() => router.push(`/admin/reportes/${reporte.id}`)}
                  className="bg-brand-card/40 border border-brand-accent-soft/30 rounded-lg p-6 hover:border-brand-accent-strong/50 transition-all duration-200 hover:shadow-lg hover:shadow-brand-accent-strong/10 cursor-pointer"
                >
                  {/* Encabezado del reporte */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Nombre de usuarios */}
                      <div className="flex items-center gap-3 mb-2">
                        <User size={18} className="text-brand-accent-strong" />
                        <span className="text-sm text-brand-accent-mid">
                          <span className="font-semibold text-white">{reportanteNombre}</span>
                          <span className="text-brand-accent-mid"> reportÃ³ a </span>
                          <span className="font-semibold text-white">{reportadoNombre}</span>
                        </span>
                      </div>

                      {/* Tipo de trabajo */}
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-brand-accent-soft" />
                        <span className="text-sm text-brand-accent-mid">
                          Trabajo: <span className="font-medium text-white">{reporte.trabajo.tipoDeTrabajo}</span>
                        </span>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-brand-accent-soft" />
                        <span className="text-sm text-brand-accent-mid">
                          {formatDate(reporte.trabajo.fechaFin)}
                        </span>
                      </div>
                    </div>

                    {/* Badges de estado y decisiÃ³n */}
                    <div className="flex flex-col gap-2 items-end">
                      <EstadoBadge estado={reporte.resolucion as 'SinResolver' | 'Resuelto'} />
                      {reporte.decision && (
                        <DecisionBadge favorable={reporte.decision === 'AFavor'} />
                      )}
                    </div>
                  </div>

                  {/* LÃ­nea divisoria */}
                  <div className="h-px bg-gradient-to-r from-brand-accent-soft/20 to-transparent mb-4" />

                  {/* CTA: BotÃ³n para ver detalles */}
                  <div className="flex justify-end">
                    <span className="px-4 py-2 bg-brand-accent-strong/20 text-brand-text-light rounded-lg text-sm font-medium">
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
