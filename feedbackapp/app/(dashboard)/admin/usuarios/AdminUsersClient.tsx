'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, Mail } from 'lucide-react'
import DropdownFilter from '@/components/DropdownFilter'
import Pagination from '@/components/Pagination'
import UserCard from '@/components/UserCard'
import EmptyState from '@/components/EmptyState'
import SearchInput from '@/components/SearchInput'
import type { UserRow } from '@/types'

interface AdminUsersClientProps {
  usuarios: UserRow[]
  page: number
  totalPaginas: number
  search: string
  total: number
  rolFilter: string
}

export default function AdminUsersClient({
  usuarios,
  page,
  totalPaginas,
  search,
  total,
  rolFilter,
}: AdminUsersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchValue.trim()) params.set('search', searchValue.trim())
      if (rolFilter) params.set('rol', rolFilter)
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchValue, rolFilter, router, pathname])

  const handleRoleFilter = (rol: string) => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (rol) params.set('rol', rol)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePage = (p: number) => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (rolFilter) params.set('rol', rolFilter)
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  const rolLabels: Record<string, string> = {
    rider: 'Rider',
    driver: 'Driver',
    feedbackAdmin: 'Admin',
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-2 text-sm">
          Administración
        </p>
        <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
          Usuarios del sistema
        </h1>
        <p className="text-[#c392dd]">
          {total} usuario{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar por nombre o apellido..."
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>
        <DropdownFilter
          value={rolFilter}
          onChange={handleRoleFilter}
          options={[
            { value: '', label: 'Todos' },
            { value: 'rider', label: 'Rider' },
            { value: 'driver', label: 'Driver' },
            { value: 'feedbackAdmin', label: 'Admin' },
          ]}
        />
      </div>

      {usuarios.length === 0 ? (
        <EmptyState
          icon={User}
          title={search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {usuarios.map((u) => (
              <UserCard
                key={u.id}
                id={u.id}
                nombre={u.nombre}
                apellido={u.apellido}
                valoracion={u.valoracion}
                badge={rolLabels[u.rol] || u.rol}
              >
                <div className="flex items-center gap-1.5 text-[#c392dd] text-xs whitespace-nowrap">
                  <Mail size={13} className="flex-shrink-0" />
                  <span>{u.mail}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap ${u.activo ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-green-400' : 'bg-red-400'}`} />
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </UserCard>
            ))}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
