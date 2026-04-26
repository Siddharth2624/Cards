'use client'

import { useState, useRef, useEffect } from 'react'
import { Player } from '@/lib/types'

interface PlayerCardProps {
  player: Player
  isLeader: boolean
  onUpdateName: (id: string, name: string) => void
}

export default function PlayerCard({ player, isLeader, onUpdateName }: PlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(player.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== player.name) {
      onUpdateName(player.id, trimmed)
    } else {
      setName(player.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setName(player.name)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`card relative group transition-smooth ${
        isLeader
          ? 'ring-2 ring-cta-500 shadow-cta-500/20 bg-gradient-to-br from-cta-50 to-white dark:from-cta-950/30 dark:to-gray-800'
          : 'hover:shadow-xl'
      }`}
    >
      {/* Leader badge */}
      {isLeader && (
        <div className="absolute -top-2 -right-2 touch-target">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cta-500 text-white shadow-lg">
            👑
          </span>
        </div>
      )}

      {/* Name */}
      <div className="flex items-center justify-between mb-3">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="input flex-1 mr-2 px-3 py-1.5 text-lg font-semibold"
            maxLength={20}
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 text-left text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            aria-label={`Edit ${player.name}'s name`}
          >
            {player.name}
          </button>
        )}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Edit name"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      {/* Score */}
      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
          Score
        </div>
        <div
          className={`text-4xl md:text-5xl font-outfit font-bold transition-smooth ${
            isLeader
              ? 'text-cta-600 dark:text-cta-400'
              : 'text-primary-600 dark:text-primary-400'
          }`}
        >
          {player.score}
        </div>
        {player.score > 0 && (
          <div className="text-xs text-green-500 dark:text-green-400 font-medium mt-1">
            +{player.score}
          </div>
        )}
        {player.score < 0 && (
          <div className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">
            {player.score}
          </div>
        )}
      </div>
    </div>
  )
}
