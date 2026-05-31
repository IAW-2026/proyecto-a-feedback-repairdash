import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { BarChart3, Star, User, Shield, Users } from 'lucide-react'

export default async function Home() {
  const { sessionClaims } = await auth()
  const clerkUser = await currentUser()
  const role = (sessionClaims?.metadata as any)?.role
  const nombre = clerkUser?.firstName ?? ''
  const apellido = clerkUser?.lastName ?? ''

  if (role === 'feedbackAdmin') {
    const adminSections = [
      { label: 'Usuarios', href: '/admin', icon: Users, description: 'Listado de usuarios del sistema' },
      { label: 'Reportes', href: '/admin/reportes', icon: Shield, description: 'Gestionar reportes' },
    ]

    return (
      <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
        <div className="w-full max-w-[1100px]">
          <div className="mb-[clamp(2rem,6vw,4rem)]">
            <div className="text-xs uppercase tracking-widest text-[#c392dd] font-semibold mb-2">
              Feedback App
            </div>
            <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
              RepairDash
            </h1>
            <div className="bg-[#3a1f52] p-6 rounded-xl border border-[#8d62a5]/20 mb-6">
              <p className="text-[#c392dd] text-sm uppercase tracking-wider mb-1">Bienvenido Administrador</p>
              <p className="text-[#fbdaf9] text-xl font-bold">
                {nombre} {apellido}
              </p>
            </div>
          </div>

          <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
            {adminSections.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.href} href={section.href} className="block w-full">
                  <div className="w-full min-h-[120px] p-[clamp(1rem,3vw,1.5rem)] bg-[#3a1f52] border border-[#8d62a5]/20 rounded-xl flex flex-col items-center justify-center gap-[clamp(0.75rem,2vw,1rem)] cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-[#f500f1]/60 hover:shadow-xl hover:shadow-[#f500f1]/20 active:scale-95">
                    <div className="bg-[#f500f1]/10 p-[clamp(0.75rem,2vw,1rem)] rounded-lg">
                      <Icon size={48} className="text-[#f500f1]" style={{ width: 'min(48px, 12vw)', height: 'min(48px, 12vw)' }} />
                    </div>
                    <span className="font-semibold text-white text-center" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
                      {section.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const userSections = [
    { label: 'Reportes', href: '/reportes', icon: BarChart3, description: 'Ver y crear reportes' },
    { label: 'Reviews', href: '/reviews', icon: Star, description: 'Reviews pendientes' },
    { label: 'Perfil', href: '/perfil', icon: User, description: 'Tu información' },
  ]

  return (
    <div className="min-h-screen bg-[#271033] flex flex-col items-center justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)]">
      <div className="w-full max-w-[1100px]">
        <div className="mb-[clamp(2rem,6vw,4rem)]">
          <div className="text-xs uppercase tracking-widest text-[#c392dd] font-semibold mb-2">
            Feedback App
          </div>
          <h1 className="text-4xl font-bold text-[#fbdaf9] mb-3">
            RepairDash
          </h1>
          <p className="text-[#c392dd] mb-4">
            Accedé a las principales funciones de la app
          </p>
          <div className="bg-[#3a1f52] p-4 rounded-xl border border-[#8d62a5]/20 inline-block mb-4">
            <p className="text-[#fbdaf9]">No tenés reviews pendientes. Dashboard en construcción.</p>
          </div>
        </div>

        <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
          {userSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href} className="block w-full">
                <div className="w-full min-h-[120px] p-[clamp(1rem,3vw,1.5rem)] bg-[#3a1f52] border border-[#8d62a5]/20 rounded-xl flex flex-col items-center justify-center gap-[clamp(0.75rem,2vw,1rem)] cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#4a2a6a] hover:border-[#f500f1]/60 hover:shadow-xl hover:shadow-[#f500f1]/20 active:scale-95">
                  <div className="bg-[#f500f1]/10 p-[clamp(0.75rem,2vw,1rem)] rounded-lg">
                    <Icon size={48} className="text-[#f500f1]" style={{ width: 'min(48px, 12vw)', height: 'min(48px, 12vw)' }} />
                  </div>
                  <span className="font-semibold text-white text-center" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
                    {section.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
