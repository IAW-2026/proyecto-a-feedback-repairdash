import BuscarClient from './BuscarClient'

const mockUsuarios = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez' },
  { id: '2', nombre: 'María', apellido: 'González' },
  { id: '3', nombre: 'Carlos', apellido: 'López' },
  { id: '4', nombre: 'Ana', apellido: 'Martínez' },
  { id: '5', nombre: 'Pedro', apellido: 'Rodríguez' },
  { id: '6', nombre: 'Laura', apellido: 'Fernández' },
  { id: '7', nombre: 'Diego', apellido: 'García' },
  { id: '8', nombre: 'Sofía', apellido: 'Díaz' },
  { id: '9', nombre: 'Luis', apellido: 'Torres' },
  { id: '10', nombre: 'Valentina', apellido: 'Ramírez' },
  { id: '11', nombre: 'Andrés', apellido: 'Morales' },
  { id: '12', nombre: 'Camila', apellido: 'Castro' },
  { id: '13', nombre: 'Javier', apellido: 'Ortiz' },
  { id: '14', nombre: 'Isabella', apellido: 'Vargas' },
  { id: '15', nombre: 'Miguel', apellido: 'Ríos' },
  { id: '16', nombre: 'Gabriela', apellido: 'Mendoza' },
  { id: '17', nombre: 'Pablo', apellido: 'Herrera' },
  { id: '18', nombre: 'Fernanda', apellido: 'Rojas' },
  { id: '19', nombre: 'Santiago', apellido: 'Castillo' },
  { id: '20', nombre: 'Daniela', apellido: 'Muñoz' },
  { id: '21', nombre: 'Nicolás', apellido: 'Peña' },
  { id: '22', nombre: 'Luciana', apellido: 'Flores' },
  { id: '23', nombre: 'Felipe', apellido: 'Aguilar' },
  { id: '24', nombre: 'Martina', apellido: 'Silva' },
  { id: '25', nombre: 'Alejandro', apellido: 'Navarro' },
]

function generateMockData(nombre: string, apellido: string) {
  const seed = nombre.length + apellido.length
  return {
    promedioEstrellas: (seed % 3) + 3,
    reportesEnContra: seed % 8,
    trabajosInvolucrado: seed % 20 + 5,
  }
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const search = params.search ?? ''
  const POR_PAGINA = 10

  const filtrados = search
    ? mockUsuarios.filter((u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : mockUsuarios

  const total = filtrados.length
  const totalPaginas = Math.ceil(total / POR_PAGINA)
  const paginados = filtrados.slice((page - 1) * POR_PAGINA, page * POR_PAGINA)

  const resultados = paginados.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    ...generateMockData(u.nombre, u.apellido),
  }))

  return (
    <BuscarClient
      usuarios={resultados}
      page={page}
      totalPaginas={totalPaginas}
      search={search}
      total={total}
    />
  )
}
