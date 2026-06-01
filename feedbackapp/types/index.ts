export interface Review {
  id: string
  valoracion: number | null
  review: string | null
  autor: {
    id: string
    nombre: string | null
    apellido: string | null
    rol: string
  }
  trabajo: {
    id: string
    tipoDeTrabajo: string
    fechaFin: Date | null
  }
}

export interface UsuarioBase {
  id: string
  nombre: string | null
  apellido: string | null
  rol: string
}

export interface Trabajo {
  id: string
  tipoDeTrabajo: string
  fechaInicio?: Date
  fechaFin: Date | null
}

export interface Reporte {
  id: string
  trabajo: Trabajo
  reportante: UsuarioBase
  reportado: UsuarioBase
  resolucion: string
  decision: string | null
  estado: string
}

export interface UserRow {
  id: string
  nombre: string
  apellido: string
  mail: string
  rol: string
  valoracion: number
  activo: boolean
}

export interface UserResult {
  id: string
  nombre: string
  apellido: string
  promedioEstrellas: number
  reportesEnContra: number
  trabajosInvolucrado: number
}

export interface ReporteCardData {
  id: string
  nombreUsuario: string
  tipoDeTrabajo: string
  fecha: string
  resolucion: 'SinResolver' | 'Resuelto'
  decision: 'AFavor' | 'EnContra' | null
  soyReportante: boolean
}
