import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await prisma.participant.updateMany({
      data: {
        assignedToId: null,
        hasRevealed: false,
      },
    })

    return NextResponse.json({ success: true, message: 'Todas las asignaciones han sido reiniciadas' })
  } catch (error) {
    console.error('Error al reiniciar asignaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
