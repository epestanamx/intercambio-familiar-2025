import Snowfall from '@/components/Snowfall'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Snowfall />

      <div className="christmas-card p-8 md:p-12 max-w-2xl w-full text-center z-10">
        <div className="text-6xl mb-6">🎄</div>

        <h1 className="text-3xl md:text-5xl font-bold text-yellow-300 mb-4">
          Intercambio Navideño 2025
        </h1>

        <div className="text-6xl my-6">🎁</div>

        <h2 className="text-xl md:text-2xl text-white mb-6">
          Sorteo de Amigo Secreto
        </h2>

        <div className="bg-red-800/50 rounded-xl p-6 mb-8 border-2 border-yellow-400/50">
          <p className="text-lg md:text-xl text-yellow-200 mb-2">
            Monto del intercambio:
          </p>
          <p className="text-4xl md:text-5xl font-bold text-yellow-400">
            $200 MXN
          </p>
        </div>

        <p className="text-gray-300 mb-8 text-lg">
          Cada participante tiene un enlace personal para descubrir a su amigo
          secreto.
          <br />
          <span className="text-yellow-300">¡Revisa tu correo o mensaje!</span>
        </p>

        {/* <div className="flex flex-col gap-4 items-center">
          <Link
            href="/admin"
            className="christmas-button px-8 py-4 rounded-full text-white font-bold text-lg inline-block"
          >
            Panel de Administración
          </Link>
        </div> */}

        <div className="mt-8 text-4xl">🎅 ⭐ 🦌 ❄️ 🔔</div>
      </div>
    </main>
  );
}
