import Snowfall from '@/components/Snowfall'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Snowfall />

      <div className="christmas-card p-8 md:p-12 max-w-lg w-full text-center z-10">
        <div className="text-6xl mb-6">🎅</div>

        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-4">
          ¡Oops!
        </h1>

        <p className="text-xl text-white mb-6">
          Parece que el reno se perdió...
        </p>

        <p className="text-gray-300 mb-8">
          El enlace que buscas no existe o ha expirado.
          <br />
          Verifica que tengas el enlace correcto.
        </p>

        <Link
          href="/"
          className="christmas-button px-8 py-4 rounded-full text-white font-bold text-lg inline-block"
        >
          Volver al Inicio
        </Link>

        <div className="mt-8 text-4xl">
          🦌 ❄️ 🎄
        </div>
      </div>
    </main>
  )
}
