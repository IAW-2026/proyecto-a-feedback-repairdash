'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { reportEvidenceSchema } from '@/lib/validation/reportEvidence'

const STORAGE_KEY = (id: string) => `report_draft_${id}`

export interface Prueba {
  id: string
  tipo: string
  url: string
}

interface UseReportFormReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  uploading: boolean
  formData: { descripcion: string; pruebas: Prueba[] }
  handleDescripcionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleRemovePrueba: (id: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useReportForm(reporteId: string): UseReportFormReturn {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState<{ descripcion: string; pruebas: Prueba[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY(reporteId))
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          descripcion: typeof parsed.descripcion === 'string' ? parsed.descripcion : '',
          pruebas: Array.isArray(parsed.pruebas) ? parsed.pruebas : [],
        }
      }
    } catch { /* ignorar JSON inválido */ }
    return { descripcion: '', pruebas: [] }
  })

  useEffect(() => {
    if (!success) {
      localStorage.setItem(STORAGE_KEY(reporteId), JSON.stringify(formData))
    }
  }, [formData, reporteId, success])

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const body = new FormData()
      body.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al subir archivo')
      }

      const { url, tipo } = await res.json()

      const newPrueba: Prueba = {
        id: `temp-${Date.now()}`,
        tipo,
        url,
      }

      setFormData((prev) => ({
        ...prev,
        pruebas: [...prev.pruebas, newPrueba],
      }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir archivo'
      setError(message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemovePrueba = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pruebas: prev.pruebas.filter((p) => p.id !== id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!formData.descripcion.trim()) {
      setError('La descripción del reporte es obligatoria')
      return
    }

    if (formData.descripcion.trim().length < 20) {
      setError('La descripción debe tener al menos 20 caracteres')
      return
    }

    if (formData.pruebas.length === 0) {
      setError('Debes agregar al menos una prueba')
      return
    }

    setIsLoading(true)

    try {
      const firstPrueba = formData.pruebas[0]
      const result = reportEvidenceSchema.safeParse({
        descripcion: formData.descripcion,
        url: firstPrueba.url,
        tipo: firstPrueba.tipo,
      })

      if (!result.success) {
        throw new Error(result.error.issues[0].message)
      }

      const response = await fetch(`/api/reports/${reporteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al resolver el reporte')
      }

      for (let i = 1; i < formData.pruebas.length; i++) {
        const prueba = formData.pruebas[i]
        await fetch(`/api/reports/${reporteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            descripcion: 'Prueba adicional',
            url: prueba.url,
            tipo: prueba.tipo,
          }),
        })
      }

      localStorage.removeItem(STORAGE_KEY(reporteId))
      setSuccess(true)

      setTimeout(() => {
        router.push('/reportes')
        router.refresh()
      }, 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    success,
    uploading,
    formData,
    handleDescripcionChange,
    handleFileUpload,
    handleRemovePrueba,
    handleSubmit,
  }
}
