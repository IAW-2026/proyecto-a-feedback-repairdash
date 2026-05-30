'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Star, Search, AlertTriangle, Briefcase } from 'lucide-react'

interface UserResult {
  id: string
  nombre: string
  apellido: string
  promedioEstrellas: number
  reportesEnContra: number
  trabajosInvolucrado: number
}

interface BuscarClientProps {
  usuarios: UserResult[]
  page: number
  totalPaginas: number
  search: string
  total: number
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className={
            i < rounded
              ? 'fill-[#f500f1] text-[#f500f1]'
              : 'text-[#8d62a5] opacity-30'
          }
        />
      ))}
    </div>
  )
}

export default function BuscarClient({
  usuarios,
  page,
  totalPaginas,
  search,
  total,
}: BuscarClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

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

  const hasNoUsers = usuarios.length === 0
  const hasSearch = search.trim() !== ''

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[#c392dd] mb-2">
          BUSCAR USUARIOS
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Buscar usuarios</h1>
        <p className="text-[#c392dd]">
          Busca por nombre de usuario registrado en la plataforma
        </p>
      </div>

      <div className="mb-6 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8d62a5]"
        />
        <input
          type="text"
          placeholder="Buscar por nombre de usuario..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#271033] border border-[#8d62a5] rounded-lg text-[#fbdaf9] placeholder-[#8d62a5]/50 focus:outline-none focus:ring-2 focus:ring-[#f500f1] transition-all duration-200"
        />
      </div>

      {hasNoUsers ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            {hasSearch ? (
              <Search size={48} className="text-[#8d62a5] mx-auto opacity-50" />
            ) : (
              <AlertTriangle size={48} className="text-[#8d62a5] mx-auto opacity-50" />
            )}
          </div>
          <p className="text-[#c392dd] text-lg">
            {hasSearch
              ? 'No se encontraron usuarios para tu búsqueda'
              : 'Ingresa un nombre para buscar usuarios'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {usuarios.map((usuario, index) => (
              <div key={usuario.id}>
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-lg font-bold text-[#fbdaf9] mb-2">
                        {usuario.apellido}, {usuario.nombre}
                      </div>
                      <StarRating rating={usuario.promedioEstrellas} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-[#c392dd]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="flex-shrink-0" />
                      <span>
                        Cantidad de reportes en los que se le falló en contra:{' '}
                        <strong className="text-[#fbdaf9]">
                          {usuario.reportesEnContra}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="flex-shrink-0" />
                      <span>
                        Cantidad de trabajos en los que se involucró:{' '}
                        <strong className="text-[#fbdaf9]">
                          {usuario.trabajosInvolucrado}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {index < usuarios.length - 1 && (
                  <div className="border-t border-[#8d62a5]/20 mb-6" />
                )}
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#8d62a5]/20">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 border border-[#8d62a5] rounded-lg font-semibold text-sm transition-all duration-200 ${
                  page === 1
                    ? 'opacity-40 cursor-not-allowed text-[#fbdaf9]'
                    : 'bg-[#3a1f52] text-[#fbdaf9] hover:border-[#f500f1] hover:text-[#f500f1]'
                }`}
              >
                ← Anterior
              </button>

              <span className="text-[#c392dd] text-sm">
                Página {page} de {totalPaginas}
              </span>

              <button
                onClick={handleNextPage}
                disabled={page === totalPaginas}
                className={`px-4 py-2 border border-[#8d62a5] rounded-lg font-semibold text-sm transition-all duration-200 ${
                  page === totalPaginas
                    ? 'opacity-40 cursor-not-allowed text-[#fbdaf9]'
                    : 'bg-[#3a1f52] text-[#fbdaf9] hover:border-[#f500f1] hover:text-[#f500f1]'
                }`}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
