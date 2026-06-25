'use client'

import { Search, AlertTriangle, Briefcase } from 'lucide-react'
import Pagination from '@/components/Pagination'
import UserCard from '@/components/UserCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import { useSearch } from '@/hooks/useSearch'
import type { UserResult } from '@/types'

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
  const { searchValue, setSearchValue, handlePage } = useSearch({ search })

  const hasNoUsers = usuarios.length === 0
  const hasSearch = search.trim() !== ''

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-brand-accent-mid mb-2">
          BUSCAR USUARIOS
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Buscar usuarios</h1>
        <p className="text-brand-accent-mid">
          BuscÃ¡ por nombre de usuario registrado en la plataforma
        </p>
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Buscar por nombre de usuario..."
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {hasNoUsers ? (
        <EmptyState
          icon={hasSearch ? Search : AlertTriangle}
          title={hasSearch ? 'No se encontraron usuarios para tu bÃºsqueda' : 'Ingresa un nombre para buscar usuarios'}
        />
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
                  <div className="flex items-center gap-1.5 text-brand-accent-mid">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>
                      Reportes: <strong className="text-brand-text-light">{usuario.reportesEnContra}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-accent-mid">
                    <Briefcase size={14} className="flex-shrink-0" />
                    <span>
                      Trabajos: <strong className="text-brand-text-light">{usuario.trabajosInvolucrado}</strong>
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
