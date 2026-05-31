'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Star, User, Mail } from 'lucide-react'
import DropdownFilter from '@/components/DropdownFilter'
import Pagination from '@/components/Pagination'

interface UserRow {
  id: string
  nombre: string
  apellido: string
  mail: string
  rol: string
  valoracion: number
  activo: boolean
}

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
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d62a5]" />
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#271033] border border-[#8d62a5] rounded-lg text-[#fbdaf9] placeholder-[#8d62a5]/50 focus:outline-none focus:ring-2 focus:ring-[#f500f1] transition-all duration-200"
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <User size={48} className="text-[#8d62a5] mx-auto opacity-50 mb-4" />
          <p className="text-[#c392dd] text-lg">
            {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {usuarios.map((u) => (
              <Link
                key={u.id}
                href={`/usuarios/${u.id}`}
                className="block group"
              >
                <div className="bg-[#3a1f52] rounded-lg px-4 py-2.5 border border-[#8d62a5]/30 hover:border-[#f500f1]/40 hover:shadow-lg hover:shadow-[#f500f1]/10 transition-all duration-200 hover:scale-[1.01] min-h-[56px] flex items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <span className="font-gilroy font-bold text-[#fbdaf9] whitespace-nowrap text-sm">
                      {u.apellido}, {u.nombre}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={13} className={u.valoracion > 0 ? 'fill-[#f500f1] text-[#f500f1]' : 'text-[#8d62a5] opacity-30'} />
                      <span className="text-[#fbdaf9] text-xs font-medium">{u.valoracion}/5</span>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-[#8d62a5]/20 text-[#c392dd] text-xs font-medium rounded-full whitespace-nowrap">
                      {rolLabels[u.rol] || u.rol}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 ml-auto min-w-0">
                    <div className="flex items-center gap-1.5 text-[#c392dd] text-xs whitespace-nowrap">
                      <Mail size={13} className="flex-shrink-0" />
                      <span>{u.mail}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap ${u.activo ? 'text-green-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-green-400' : 'bg-red-400'}`} />
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination page={page} totalPaginas={totalPaginas} onPageChange={handlePage} />
        </>
      )}
    </div>
  )
}
