export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Fecha no disponible'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'Fecha no disponible'
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(date: Date | null | undefined): string {
  if (!date) return 'Sin fecha fin'
  return date.toLocaleDateString('es-ES')
}
