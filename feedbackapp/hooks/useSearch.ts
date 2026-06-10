'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UseSearchParams {
  search: string
  filters?: Record<string, string>
}

export function useSearch({ search, filters = {} }: UseSearchParams) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search)
  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentFilters = JSON.parse(filterKey) as Record<string, string>
      const params = new URLSearchParams()
      if (searchValue.trim()) params.set('search', searchValue.trim())
      for (const [key, value] of Object.entries(currentFilters)) {
        if (value) params.set(key, value)
      }
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchValue, router, pathname, filterKey])

  const handlePage = useCallback((p: number) => {
    const currentFilters = JSON.parse(filterKey) as Record<string, string>
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    for (const [key, value] of Object.entries(currentFilters)) {
      if (value) params.set(key, value)
    }
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }, [search, router, pathname, filterKey])

  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (value) params.set(key, value)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [search, router, pathname])

  return { searchValue, setSearchValue, handlePage, handleFilterChange }
}
