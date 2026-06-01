import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { EstadoReporte } from '@/generated/prisma/client'
import { adminResolveSchema } from '@/lib/validation/adminResolve'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.rol !== 'feedbackAdmin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      )
    }

    const { id } = await params
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { message: 'ID de reporte inválido' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { message: 'El cuerpo de la solicitud no es un JSON válido' },
        { status: 400 }
      )
    }

    // Validar con Zod
    const result = adminResolveSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { decision } = result.data

    const reporte = await prisma.reporte.findUnique({ where: { id } })
    if (!reporte) {
      return NextResponse.json(
        { message: 'El reporte no existe' },
        { status: 404 }
      )
    }

    if (reporte.estado !== 'PRUEBAS_AGREGADAS') {
      return NextResponse.json(
        { message: 'El reporte no está pendiente de revisión' },
        { status: 400 }
      )
    }

    const actualizado = await prisma.reporte.update({
      where: { id },
      data: {
        decision,
        resolucion: 'Resuelto',
        estado: EstadoReporte.RESUELTO,
      },
      include: {
        trabajo: true,
        reportante: true,
        reportado: true,
        pruebas: true,
      },
    })

    return NextResponse.json(actualizado, { status: 200 })
  } catch (error) {
    console.error('Error al resolver reporte:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
