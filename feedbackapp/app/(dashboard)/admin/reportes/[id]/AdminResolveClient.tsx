'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { adminResolveSchema } from '@/lib/validation/adminResolve'

interface Props {
  reporteId: string
  estado: string
  decision: string | null
  resolucion: string
}

export default function AdminResolveClient({ reporteId, estado, decision, resolucion }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isResuelto = estado === 'RESUELTO'
  const isPendiente = estado === 'PRUEBAS_AGREGADAS'

  if (isResuelto && success === false) {
    return (
      <div className="bg-[#3a1f52] rounded-xl p-6 border-2 border-[#c392dd]">
        <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-4 text-sm">
          Veredicto
        </p>
        <div className="text-center">
          {decision === 'AFavor' ? (
            <>
              <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />
              <h3 className="font-bold text-[#fbdaf9] mb-2 text-xl">
                Reporte aprobado
              </h3>
              <p className="text-[#c392dd] mb-4">
                El administrador falló a favor del reportante
              </p>
              <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 font-medium px-3 py-1.5 rounded-full text-sm">
                <CheckCircle size={14} />
                A favor
              </span>
            </>
          ) : (
            <>
              <XCircle size={56} className="mx-auto mb-4 text-red-500" />
              <h3 className="font-bold text-[#fbdaf9] mb-2 text-xl">
                Reporte rechazado
              </h3>
              <p className="text-[#c392dd] mb-4">
                El administrador falló en contra del reportante
              </p>
              <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 font-medium px-3 py-1.5 rounded-full text-sm">
                <XCircle size={14} />
                En contra
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#3a1f52] rounded-xl p-6 border-2 border-[#c392dd]">
      <p className="text-[#c392dd] font-semibold uppercase tracking-wider mb-4 text-sm">
        Resolver Reporte
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-300 text-sm">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center">
          <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />
          <h3 className="font-bold text-[#fbdaf9] mb-2 text-xl">
            ¡Reporte resuelto!
          </h3>
          <p className="text-[#c392dd] mb-4">
            {decision === 'AFavor'
              ? 'Decidiste a favor del reportante'
              : 'Decidiste en contra del reportante'}
          </p>
          <button
            onClick={() => router.push('/admin/reportes')}
            className="px-4 py-2 bg-[#6ba587]/20 text-[#4ade80] rounded-lg text-sm font-medium hover:bg-[#6ba587]/30 transition-all duration-200"
          >
            Volver a reportes
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <Clock size={48} className="mx-auto mb-3 text-[#c392dd]" />
            <h3 className="font-bold text-[#fbdaf9] mb-2 text-lg">
              Pendiente de resolución
            </h3>
            <p className="text-[#c392dd] text-sm">
              Revisá las pruebas y tomá una decisión
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleResolve('AFavor')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-300 rounded-lg font-medium hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              {loading ? 'Procesando...' : 'A Favor del Reportante'}
            </button>
            <button
              onClick={() => handleResolve('EnContra')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-300 rounded-lg font-medium hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={18} />
              {loading ? 'Procesando...' : 'En Contra del Reportante'}
            </button>
          </div>
        </>
      )}
    </div>
  )

  async function handleResolve(decision: string) {
    // Validar con Zod antes de enviar
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
}
