import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener la review
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: {
        trabajo: true,
        autor: true,
      },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la review pertenece al usuario logueado
    if (review.idUsuario !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Formatear respuesta
    const reviewData = {
      id: review.id,
      trabajo: {
        id: review.trabajo.id,
        tipoDeTrabajo: review.trabajo.tipoDeTrabajo,
        fechaInicio: review.trabajo.fechaInicio.toISOString(),
        fechaFin: review.trabajo.fechaFin?.toISOString() || null,
      },
      usuarioAEvaluar: {
        id: review.autor.id,
        nombre: review.autor.nombre || '',
        apellido: review.autor.apellido || '',
      },
    }

    return NextResponse.json({ review: reviewData }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener review:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener body
    const body = await request.json()
    const { valoracion, review } = body

    // Validaciones
    if (valoracion === undefined || review === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos' },
        { status: 400 }
      )
    }

    if (typeof valoracion !== 'number' || valoracion < 1 || valoracion > 5) {
      return NextResponse.json(
        { error: 'Valoración inválida' },
        { status: 400 }
      )
    }

    if (typeof review !== 'string' || review.length > 1000) {
      return NextResponse.json(
        { error: 'La review no puede superar los 1000 caracteres' },
        { status: 400 }
      )
    }

    // Obtener la review para verificar que pertenece al usuario
    const reviewRecord = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!reviewRecord) {
      return NextResponse.json(
        { error: 'Review no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que la review pertenece al usuario logueado
    if (reviewRecord.idUsuario !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Actualizar la review
    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: {
        valoracion,
        review,
      },
    })

    return NextResponse.json(
      { ok: true, review: updatedReview },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al actualizar review:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
