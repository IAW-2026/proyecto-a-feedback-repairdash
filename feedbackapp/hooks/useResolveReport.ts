'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminResolveSchema } from '@/lib/validation/adminResolve'

interface UseResolveReportReturn {
  loading: boolean
  error: string | null
  success: boolean
  handleResolve: (decision: string) => Promise<void>
}

export function useResolveReport(reporteId: string): UseResolveReportReturn {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResolve = async (decision: string) => {
    const result = adminResolveSchema.safeParse({ decision })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/reports/${reporteId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Error al resolver el reporte')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, success, handleResolve }
}
