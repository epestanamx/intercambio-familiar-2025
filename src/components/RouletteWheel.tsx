'use client'

import { useState, useEffect, useCallback } from 'react'

interface RouletteWheelProps {
  names: string[]
  finalName: string
  onComplete: () => void
}

export default function RouletteWheel({ names, finalName, onComplete }: RouletteWheelProps) {
  const [currentName, setCurrentName] = useState(names[0] || '')
  const [isSpinning, setIsSpinning] = useState(true)
  const [showResult, setShowResult] = useState(false)

  const spin = useCallback(() => {
    if (names.length === 0) return

    let iterations = 0
    const maxIterations = 30 + Math.floor(Math.random() * 20)
    let speed = 50

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length)
      setCurrentName(names[randomIndex])
      iterations++

      if (iterations > maxIterations - 10) {
        speed += 30
      }

      if (iterations >= maxIterations) {
        clearInterval(interval)
        setCurrentName(finalName)
        setIsSpinning(false)
        setTimeout(() => {
          setShowResult(true)
          onComplete()
        }, 500)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [names, finalName, onComplete])

  useEffect(() => {
    const cleanup = spin()
    return cleanup
  }, [spin])

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={`roulette-container w-72 h-72 rounded-full flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900 border-8 border-yellow-400 ${isSpinning ? 'spinning' : ''}`}
      >
        <div className="w-60 h-60 rounded-full bg-gradient-to-br from-green-700 to-green-900 border-4 border-yellow-300 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur flex items-center justify-center p-4">
            <span
              className={`text-2xl font-bold text-center text-yellow-300 ${showResult ? 'reveal-animation' : ''}`}
            >
              {currentName}
            </span>
          </div>
        </div>
      </div>

      {isSpinning && (
        <p className="text-xl text-yellow-300 animate-pulse">
          Girando la ruleta...
        </p>
      )}
    </div>
  )
}
