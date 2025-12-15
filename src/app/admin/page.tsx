'use client'

import { useState, useEffect } from 'react'
import Snowfall from '@/components/Snowfall'
import Link from 'next/link'

interface Participant {
  id: string
  name: string
  slug: string
  hasRevealed: boolean
  assignedTo: { name: string } | null
}

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants')
      const data = await response.json()
      setParticipants(data)
    } catch (err) {
      setError('Error al cargar participantes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setAdding(true)
    setError(null)

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: newName }),
      })

      if (!response.ok) {
        throw new Error('Error al agregar participante(s)')
      }

      setNewName('')
      await fetchParticipants()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este participante?')) return

    try {
      const response = await fetch(`/api/participants?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar participante')
      }

      await fetchParticipants()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de reiniciar TODAS las asignaciones? Esta acción no se puede deshacer.')) return

    try {
      const response = await fetch('/api/reset', { method: 'POST' })

      if (!response.ok) {
        throw new Error('Error al reiniciar asignaciones')
      }

      await fetchParticipants()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || window.location.origin

  const copyLink = async (slug: string) => {
    const url = `${getBaseUrl()}/sorteo/${slug}`
    const message = `Te han invitado a unirte a Intercambio familiar 2025! Crea una lista de deseos, elige un nombre y que empiece la magia.

Fecha del intercambio de regalos:
miércoles, 24 de diciembre de 2025

Presupuesto:
Mex$200

Haz clic en el enlace de invitación para unirse:
${url}`
    await navigator.clipboard.writeText(message)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  const getLink = (slug: string) => `${getBaseUrl()}/sorteo/${slug}`

  const startEditing = (participant: Participant) => {
    setEditingId(participant.id)
    setEditingName(participant.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleUpdateName = async (id: string) => {
    if (!editingName.trim()) return

    try {
      const response = await fetch('/api/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editingName.trim() }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar nombre')
      }

      setEditingId(null)
      setEditingName('')
      await fetchParticipants()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleUpdateName(id)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <Snowfall />

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="christmas-card p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-300">
                🎄 Panel de Administración
              </h1>
              <p className="text-gray-300 mt-2">Gestiona los participantes del sorteo</p>
            </div>
            <Link
              href="/"
              className="text-yellow-300 hover:text-yellow-100 transition-colors"
            >
              ← Volver
            </Link>
          </div>

          <form onSubmit={handleAddParticipant} className="mb-6">
            <textarea
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ingresa los nombres (uno por línea)"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 resize-y mb-4"
            />
            <button
              type="submit"
              disabled={adding || !newName.trim()}
              className="christmas-button px-6 py-3 rounded-lg text-white font-bold w-full md:w-auto"
            >
              {adding ? 'Agregando...' : '+ Agregar Participantes'}
            </button>
          </form>

          {error && (
            <div className="bg-red-500/30 border border-red-400 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Participantes ({participants.length})
            </h2>
            {participants.length > 0 && (
              <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Reiniciar Asignaciones
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-300">Cargando participantes...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-lg">
              <p className="text-gray-300">No hay participantes aún</p>
              <p className="text-gray-400 text-sm mt-2">Agrega participantes usando el formulario de arriba (uno por línea)</p>
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="bg-white/5 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {editingId === participant.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, participant.id)}
                            className="px-3 py-1 rounded bg-white/20 border border-yellow-400 text-white focus:outline-none focus:border-yellow-300"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateName(participant.id)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition-colors"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white text-sm transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg font-medium text-white">
                            {participant.name}
                          </span>
                          <button
                            onClick={() => startEditing(participant)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                            title="Editar nombre"
                          >
                            ✎
                          </button>
                        </>
                      )}
                      {participant.hasRevealed && (
                        <span className="bg-green-600 text-xs px-2 py-1 rounded-full text-white">
                          Ya reveló
                        </span>
                      )}
                    </div>
                    {participant.assignedTo && (
                      <p className="text-sm text-yellow-300 mt-1">
                        → Le tocó: {participant.assignedTo.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      readOnly
                      value={getLink(participant.slug)}
                      className="bg-white/10 px-3 py-2 rounded text-sm text-gray-300 w-full md:w-64"
                    />
                    <button
                      onClick={() => copyLink(participant.slug)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      {copied === participant.slug ? '¡Copiado!' : 'Copiar Invitación'}
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="christmas-card p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-4">📋 Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Agrega todos los participantes del sorteo (puedes agregar varios a la vez, uno por línea)</li>
            <li>Copia el enlace personal de cada participante</li>
            <li>Envía cada enlace a la persona correspondiente (por correo, WhatsApp, etc.)</li>
            <li>Cada persona entrará a su enlace y presionará el botón para descubrir su amigo secreto</li>
            <li>¡El sistema se encarga de que no haya repeticiones!</li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-400/20 rounded-lg">
            <p className="text-yellow-200">
              <strong>Nota:</strong> Una vez que alguien revela su amigo secreto, la asignación queda guardada permanentemente.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
