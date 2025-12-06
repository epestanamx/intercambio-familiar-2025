import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import SorteoClient from './SorteoClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function SorteoPage({ params }: PageProps) {
  const { slug } = await params

  const participant = await prisma.participant.findUnique({
    where: { slug },
    include: { assignedTo: true },
  })

  if (!participant) {
    notFound()
  }

  const allParticipants = await prisma.participant.findMany({
    select: { name: true },
  })

  const allNames = allParticipants.map((p) => p.name)

  return (
    <SorteoClient
      participant={{
        id: participant.id,
        name: participant.name,
        slug: participant.slug,
        hasRevealed: participant.hasRevealed,
        assignedToName: participant.assignedTo?.name || null,
      }}
      allNames={allNames}
    />
  )
}
