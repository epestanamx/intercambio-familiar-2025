'use client'

import { useState } from 'react'
import Snowfall from '@/components/Snowfall'
import RouletteWheel from '@/components/RouletteWheel'
import Confetti from '@/components/Confetti'

interface Participant {
  id: string
  name: string
  slug: string
  hasRevealed: boolean
  assignedToName: string | null
}

interface SorteoClientProps {
  participant: Participant
  allNames: string[]
}

export default function SorteoClient({ participant, allNames }: SorteoClientProps) {
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealed, setRevealed] = useState(participant.hasRevealed)
  const [secretFriend, setSecretFriend] = useState<string | null>(participant.assignedToName)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReveal = async () => {
    setIsRevealing(true)
    setError(null)

    try {
      const response = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participant.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al revelar el amigo secreto')
      }

      setSecretFriend(data.assignedToName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setIsRevealing(false)
    }
  }

  const handleRouletteComplete = () => {
    setRevealed(true)
    setShowConfetti(true)
  }

  if (revealed && secretFriend) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <Snowfall />
        {showConfetti && <Confetti />}

        <div className="christmas-card p-8 md:p-12 max-w-2xl w-full text-center z-10">
          <div className="text-6xl mb-6">🎄</div>

          <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">
            ¡Hola, {participant.name}!
          </h1>

          <p className="text-gray-300 mb-8">Tu amigo secreto es:</p>

          <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-8 mb-8 border-4 border-yellow-400 reveal-animation">
            <div className="text-5xl mb-4">🎁</div>
            <p className="text-4xl md:text-5xl font-bold text-yellow-300">
              {secretFriend}
            </p>
          </div>

          <div className="bg-green-800/50 rounded-xl p-6 mb-6 border-2 border-yellow-400/50">
            <p className="text-lg text-yellow-200 mb-2">
              Recuerda, el monto del regalo es:
            </p>
            <p className="text-3xl font-bold text-yellow-400">$200 MXN</p>
          </div>

          <p className="text-gray-300 text-lg">
            ¡No olvides preparar un regalo especial! 🎅
          </p>

          <div className="mt-8 text-4xl">
            ⭐ 🦌 ❄️ 🔔 ⭐
          </div>
        </div>
      </main>
    )
  }

  if (isRevealing && secretFriend) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <Snowfall />

        <div className="christmas-card p-8 md:p-12 max-w-2xl w-full text-center z-10">
          <div className="text-6xl mb-6">🎄</div>

          <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-8">
            ¡Descubriendo tu amigo secreto!
          </h1>

          <RouletteWheel
            names={allNames}
            finalName={secretFriend}
            onComplete={handleRouletteComplete}
          />

          <div className="mt-8 text-4xl">
            🎅 ⭐ 🦌
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Snowfall />

      <div className="christmas-card p-8 md:p-12 max-w-2xl w-full text-center z-10">
        <div className="text-6xl mb-6">🎄</div>

        <h1 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">
          ¡Bienvenido/a, {participant.name}!
        </h1>

        <h2 className="text-xl text-white mb-8">
          Intercambio Navideño 2025
        </h2>

        <div className="text-8xl my-8">🎁</div>

        <p className="text-gray-300 mb-8 text-lg">
          ¿Estás listo/a para descubrir a tu amigo secreto?
          <br />
          <span className="text-yellow-300">¡Presiona el botón para revelarlo!</span>
        </p>

        {error && (
          <div className="bg-red-500/30 border border-red-400 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <button
          onClick={handleReveal}
          disabled={isRevealing}
          className="christmas-button px-12 py-6 rounded-full text-white font-bold text-2xl"
        >
          {isRevealing ? 'Sorteando...' : '¡Revelar mi Amigo Secreto!'}
        </button>

        <div className="mt-8 bg-green-800/50 rounded-xl p-4 border-2 border-yellow-400/50">
          <p className="text-yellow-200">
            Monto del intercambio: <span className="font-bold text-yellow-400">$200 MXN</span>
          </p>
        </div>

        <div className="mt-8 text-4xl">
          🎅 ⭐ 🦌 ❄️ 🔔
        </div>
      </div>
    </main>
  )
}
