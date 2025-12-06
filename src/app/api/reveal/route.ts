import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'ID de participante requerido' },
        { status: 400 }
      )
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { assignedTo: true },
    })

    if (!participant) {
      return NextResponse.json(
        { error: 'Participante no encontrado' },
        { status: 404 }
      )
    }

    if (participant.assignedTo) {
      await prisma.participant.update({
        where: { id: participantId },
        data: { hasRevealed: true },
      })

      return NextResponse.json({
        assignedToName: participant.assignedTo.name,
        alreadyAssigned: true,
      })
    }

    const availableParticipants = await prisma.participant.findMany({
      where: {
        id: { not: participantId },
        assignedBy: null,
      },
    })

    if (availableParticipants.length === 0) {
      return NextResponse.json(
        { error: 'No hay participantes disponibles para asignar' },
        { status: 400 }
      )
    }

    const randomIndex = Math.floor(Math.random() * availableParticipants.length)
    const selectedParticipant = availableParticipants[randomIndex]

    await prisma.participant.update({
      where: { id: participantId },
      data: {
        assignedToId: selectedParticipant.id,
        hasRevealed: true,
      },
    })

    return NextResponse.json({
      assignedToName: selectedParticipant.name,
      alreadyAssigned: false,
    })
  } catch (error) {
    console.error('Error al revelar amigo secreto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
