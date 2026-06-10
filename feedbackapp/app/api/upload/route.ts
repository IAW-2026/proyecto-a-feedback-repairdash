import { NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'No se envió un archivo válido' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { message: 'Solo se permiten imágenes y videos' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; resource_type: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'repairdash/pruebas',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as { secure_url: string; resource_type: string })
          }
        )
        uploadStream.end(buffer)
      }
    )

    const tipo = result.resource_type === 'video' ? 'video' : 'imagen'

    return NextResponse.json(
      {
        url: result.secure_url,
        tipo,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error)
    const message = typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : 'Error desconocido al subir archivo'
    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}
