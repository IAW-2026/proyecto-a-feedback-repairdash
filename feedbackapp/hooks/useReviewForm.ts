'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = (id: string) => `review_draft_${id}`

interface UseReviewFormReturn {
  puntaje: number | null
  hoverPuntaje: number | null
  review: string
  enviando: boolean
  enviado: boolean
  errores: { puntaje?: string; review?: string; api?: string }
  onPuntajeClick: (star: number) => void
  onPuntajeEnter: (star: number) => void
  onPuntajeLeave: () => void
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => Promise<void>
}

export function useReviewForm(reviewId: string): UseReviewFormReturn {
  const router = useRouter()

  const [puntaje, setPuntaje] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY(reviewId))
      if (saved) {
        const { puntaje: p } = JSON.parse(saved)
        return typeof p === 'number' ? p : null
      }
    } catch { /* ignorar JSON inválido */ }
    return null
  })
  const [hoverPuntaje, setHoverPuntaje] = useState<number | null>(null)
  const [review, setReview] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY(reviewId))
      if (saved) {
        const { review: r } = JSON.parse(saved)
        return typeof r === 'string' ? r : ''
      }
    } catch { /* ignorar JSON inválido */ }
    return ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errores, setErrores] = useState<{ puntaje?: string; review?: string; api?: string }>({})

  useEffect(() => {
    if (!enviado) {
      localStorage.setItem(STORAGE_KEY(reviewId), JSON.stringify({ puntaje, review }))
    }
  }, [puntaje, review, reviewId, enviado])

  const onPuntajeClick = (star: number) => {
    setPuntaje(star)
    setErrores((prev) => ({ ...prev, puntaje: undefined }))
  }

  const onPuntajeEnter = (star: number) => setHoverPuntaje(star)
  const onPuntajeLeave = () => setHoverPuntaje(null)

  const onReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value.slice(0, 1000))
    setErrores((prev) => ({ ...prev, review: undefined }))
  }

  const onSubmit = async () => {
    if (puntaje === null) {
      setErrores({ puntaje: 'Seleccioná una valoración' })
      return
    }

    setEnviando(true)
    setErrores({})

    try {
      const response = await fetch('/api/reviews/realizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, valoracion: puntaje, review }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrores({ api: data.error || 'Hubo un error al enviar la review' })
        setEnviando(false)
        return
      }

      localStorage.removeItem(STORAGE_KEY(reviewId))
      setEnviado(true)

      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error('Error enviando review:', error)
      setErrores({ api: 'Hubo un error al enviar la review' })
      setEnviando(false)
    }
  }

  return {
    puntaje,
    hoverPuntaje,
    review,
    enviando,
    enviado,
    errores,
    onPuntajeClick,
    onPuntajeEnter,
    onPuntajeLeave,
    onReviewChange,
    onSubmit,
  }
}
