import { notFound } from 'next/navigation'
import UserDetailClient from './UserDetailClient'

const mockUsuarios: Record<string, { nombre: string; apellido: string; valoracion: number }> = {
  '1': { nombre: 'Juan', apellido: 'Pérez', valoracion: 4 },
  '2': { nombre: 'María', apellido: 'González', valoracion: 5 },
  '3': { nombre: 'Carlos', apellido: 'López', valoracion: 3 },
  '4': { nombre: 'Ana', apellido: 'Martínez', valoracion: 4 },
  '5': { nombre: 'Pedro', apellido: 'Rodríguez', valoracion: 2 },
  '6': { nombre: 'Laura', apellido: 'Fernández', valoracion: 5 },
  '7': { nombre: 'Diego', apellido: 'García', valoracion: 3 },
  '8': { nombre: 'Sofía', apellido: 'Díaz', valoracion: 4 },
  '9': { nombre: 'Luis', apellido: 'Torres', valoracion: 1 },
  '10': { nombre: 'Valentina', apellido: 'Ramírez', valoracion: 5 },
  '11': { nombre: 'Andrés', apellido: 'Morales', valoracion: 3 },
  '12': { nombre: 'Camila', apellido: 'Castro', valoracion: 4 },
  '13': { nombre: 'Javier', apellido: 'Ortiz', valoracion: 2 },
  '14': { nombre: 'Isabella', apellido: 'Vargas', valoracion: 5 },
  '15': { nombre: 'Miguel', apellido: 'Ríos', valoracion: 4 },
  '16': { nombre: 'Gabriela', apellido: 'Mendoza', valoracion: 3 },
  '17': { nombre: 'Pablo', apellido: 'Herrera', valoracion: 5 },
  '18': { nombre: 'Fernanda', apellido: 'Rojas', valoracion: 4 },
  '19': { nombre: 'Santiago', apellido: 'Castillo', valoracion: 3 },
  '20': { nombre: 'Daniela', apellido: 'Muñoz', valoracion: 4 },
  '21': { nombre: 'Nicolás', apellido: 'Peña', valoracion: 5 },
  '22': { nombre: 'Luciana', apellido: 'Flores', valoracion: 2 },
  '23': { nombre: 'Felipe', apellido: 'Aguilar', valoracion: 4 },
  '24': { nombre: 'Martina', apellido: 'Silva', valoracion: 3 },
  '25': { nombre: 'Alejandro', apellido: 'Navarro', valoracion: 5 },
}

function generateMockReviews(userId: string) {
  const seed = parseInt(userId)
  const reviewTexts = [
    'Excelente servicio, muy puntual y profesional. Lo recomiendo totalmente.',
    'Muy buen trabajo, cumplió con todo lo acordado en tiempo y forma.',
    'La comunicación fue fluida y el resultado final superó mis expectativas.',
    'Podría mejorar en los tiempos de entrega, pero la calidad del trabajo es buena.',
    'No quedé conforme con el servicio, hubo varios problemas durante el proceso.',
    'Muy recomendable, sin duda volvería a trabajar con esta persona.',
    'Trabajo correcto, dentro de lo esperado. Sin mayores inconvenientes.',
    'Una experiencia muy positiva, resolvió todo de manera eficiente.',
  ]

  const tipos = ['Plomería', 'Electricidad', 'Carpintería', 'Pintura', 'Jardinería', 'Limpieza', 'Mudanza', 'Reparación']

  const count = (seed % 5) + 2
  return Array.from({ length: count }, (_, i) => {
    const idx = (seed + i) % reviewTexts.length
    const days = (seed + i) * 7
    return {
      id: `review-${userId}-${i}`,
      valoracion: (seed + i) % 5 + 1,
      review: reviewTexts[idx],
      autor: {
        id: `autor-${i}`,
        nombre: ['Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía', 'Luis', 'Valentina'][(seed + i) % 8],
        apellido: ['López', 'Martínez', 'Rodríguez', 'Fernández', 'García', 'Díaz', 'Torres', 'Ramírez'][(seed + i) % 8],
        rol: (seed + i) % 2 === 0 ? 'rider' : 'driver',
      },
      trabajo: {
        id: `trabajo-${userId}-${i}`,
        tipoDeTrabajo: tipos[(seed + i) % tipos.length],
        fechaFin: new Date(Date.now() - days * 86400000),
      },
    }
  })
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const usuario = mockUsuarios[id]
  if (!usuario) notFound()

  const reportesEnContra = parseInt(id) % 5
  const promedio = usuario.valoracion > 0 ? usuario.valoracion : null
  const reviews = generateMockReviews(id)

  return (
    <UserDetailClient
      usuario={{
        id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      }}
      promedio={promedio}
      reportesEnContra={reportesEnContra}
      reviews={reviews}
    />
  )
}
