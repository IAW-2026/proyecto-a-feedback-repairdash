import Link from 'next/link'
import { UserRound, Bike } from 'lucide-react'

export default function BienvenidaPage() {
  const riderUrl = process.env.NEXT_PUBLIC_RIDER_APP_URL ?? '#'
  const driverUrl = process.env.NEXT_PUBLIC_DRIVER_APP_URL ?? '#'

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-brand-accent-mid font-semibold mb-2">
            Feedback App
          </div>
          <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
            RepairDash
          </h1>
          <p className="text-brand-accent-mid leading-relaxed">
            Dejá tu reseña sobre el servicio recibido o creá un reporte si tuviste un inconveniente.
          </p>
        </div>

        <Link
          href="/login"
          className="block w-full bg-brand-accent-strong hover:bg-[#a0009e] text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 hover:scale-[1.02] active:scale-95 mb-8"
        >
          Iniciar sesión
        </Link>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-accent-soft/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-brand-bg px-4 text-sm text-brand-accent-mid">¿No tenés cuenta?</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a
            href={riderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-brand-card border border-brand-accent-soft/20 rounded-xl px-4 py-5 text-brand-accent-mid hover:text-[#fbdaf9] hover:border-brand-accent-strong/60 hover:bg-[#4a2a6a] transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <UserRound size={28} className="text-brand-accent-strong" />
            <span className="text-sm font-semibold">Rider</span>
          </a>
          <a
            href={driverUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-brand-card border border-brand-accent-soft/20 rounded-xl px-4 py-5 text-brand-accent-mid hover:text-[#fbdaf9] hover:border-brand-accent-strong/60 hover:bg-[#4a2a6a] transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Bike size={28} className="text-brand-accent-strong" />
            <span className="text-sm font-semibold">Driver</span>
          </a>
        </div>

        <p className="text-brand-accent-soft text-xs mt-6">
          Al registrarte aceptás los términos del servicio de cada plataforma.
        </p>
      </div>
    </div>
  )
}
