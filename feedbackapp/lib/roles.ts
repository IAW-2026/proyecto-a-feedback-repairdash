const ROL_LABELS: Record<string, string> = {
  rider: 'Rider',
  driver: 'Driver',
  feedbackAdmin: 'Administrador',
}

export function getRolLabel(rol: string): string {
  return ROL_LABELS[rol] ?? rol
}
