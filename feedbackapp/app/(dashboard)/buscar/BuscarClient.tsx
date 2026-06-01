'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, AlertTriangle, Briefcase } from 'lucide-react'
import Pagination from '@/components/Pagination'
import UserCard from '@/components/UserCard'

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

  const handlePage = (p: number) => {
    router.push(
      `${pathname}?search=${encodeURIComponent(search)}&page=${p}`
    )
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
          <div className="flex flex-col gap-3 mb-8">
            {usuarios.map((usuario) => (
              <UserCard
                key={usuario.id}
                id={usuario.id}
                nombre={usuario.nombre}
                apellido={usuario.apellido}
                valoracion={usuario.promedioEstrellas}
              >
                <div className="flex items-center gap-4" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
                  <div className="flex items-center gap-1.5 text-[#c392dd]">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>
                      Reportes: <strong className="text-[#fbdaf9]">{usuario.reportesEnContra}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#c392dd]">
                    <Briefcase size={14} className="flex-shrink-0" />
                    <span>
                      Trabajos: <strong className="text-[#fbdaf9]">{usuario.trabajosInvolucrado}</strong>
                    </span>
                  </div>
                </div>
              </UserCard>
            ))}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
