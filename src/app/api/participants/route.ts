import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const random = Math.random().toString(36).substring(2, 8)
  return `${base}-${random}`
}

function capitalizeName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      include: { assignedTo: true },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error al obtener participantes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, names } = await request.json()

    // Soporte para múltiples nombres (uno por línea)
    if (names && typeof names === 'string') {
      const nameList = names
        .split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0)

      if (nameList.length === 0) {
        return NextResponse.json(
          { error: 'Al menos un nombre es requerido' },
          { status: 400 }
        )
      }

      const participants = await prisma.$transaction(
        nameList.map(n => {
          const capitalizedName = capitalizeName(n)
          return prisma.participant.create({
            data: {
              name: capitalizedName,
              slug: generateSlug(capitalizedName),
            },
          })
        })
      )

      return NextResponse.json(participants, { status: 201 })
    }

    // Soporte para un solo nombre (retrocompatibilidad)
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nombre requerido' },
        { status: 400 }
      )
    }

    const capitalizedName = capitalizeName(name.trim())
    const slug = generateSlug(capitalizedName)

    const participant = await prisma.participant.create({
      data: {
        name: capitalizedName,
        slug,
      },
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Error al crear participante:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      )
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nombre requerido' },
        { status: 400 }
      )
    }

    const participant = await prisma.participant.update({
      where: { id },
      data: { name: name.trim() },
    })

    return NextResponse.json(participant)
  } catch (error) {
    console.error('Error al actualizar participante:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      )
    }

    await prisma.participant.update({
      where: { id },
      data: { assignedToId: null },
    })

    await prisma.participant.updateMany({
      where: { assignedToId: id },
      data: { assignedToId: null },
    })

    await prisma.participant.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar participante:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
