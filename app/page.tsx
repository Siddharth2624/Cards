'use client'

import { useState, useEffect } from 'react'
import ScoreBoard from '@/components/ScoreBoard'
import AddRoundModal from '@/components/AddRoundModal'
import RoundHistory from '@/components/RoundHistory'
import { Player, Round, Bid } from '@/lib/types'
import { loadState, saveState, clearState, calculateNewScores, checkWinner } from '@/lib/storage'

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [winner, setWinner] = useState<Player | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Load state on mount
  useEffect(() => {
    const state = loadState()
    setPlayers(state.players)
    setRounds(state.rounds)
    setWinner(state.winner)

    // Load dark mode preference
    const darkMode = localStorage.getItem('dark-mode') === 'true'
    setIsDarkMode(darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Save state whenever it changes
  useEffect(() => {
    if (players.length > 0) {
      saveState({ players, rounds, winner })
    }
  }, [players, rounds, winner])

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('dark-mode', String(isDarkMode))
  }, [isDarkMode])

  const handleUpdateName = (id: string, name: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    )
  }

  const handleAddRound = (data: {
    bids: Bid[]
    powerSuit: string
    actualWins: Record<string, number>
  }) => {
    const newPlayers = calculateNewScores(players, data)
    const newRound: Round = {
      id: `round-${Date.now()}`,
      bids: data.bids,
      powerSuit: data.powerSuit as any,
      actualWins: data.actualWins,
      timestamp: Date.now(),
    }

    setPlayers(newPlayers)
    setRounds((prev) => [...prev, newRound])

    // Check for winner
    const roundWinner = checkWinner(newPlayers)
    if (roundWinner) {
      setWinner(roundWinner)
    }

    setIsModalOpen(false)
  }

  const handleUndo = () => {
    if (rounds.length === 0) return

    const lastRound = rounds[rounds.length - 1]
    const newRounds = rounds.slice(0, -1)

    // Recalculate scores from scratch
    let recalculatedPlayers = [...players.map((p) => ({ ...p, score: 0 }))]
    for (const round of newRounds) {
      recalculatedPlayers = calculateNewScores(recalculatedPlayers, round)
    }

    setRounds(newRounds)
    setPlayers(recalculatedPlayers)

    // Recheck winner
    const newWinner = checkWinner(recalculatedPlayers)
    setWinner(newWinner)
  }

  const handleReset = () => {
    clearState()
    localStorage.removeItem('dark-mode')
    const defaultPlayers: Player[] = [
      { id: '1', name: 'Player 1', score: 0 },
      { id: '2', name: 'Player 2', score: 0 },
      { id: '3', name: 'Player 3', score: 0 },
      { id: '4', name: 'Player 4', score: 0 },
    ]
    setPlayers(defaultPlayers)
    setRounds([])
    setWinner(null)
    setShowResetConfirm(false)
  }

  const handleNewGame = () => {
    const defaultPlayers: Player[] = [
      { id: '1', name: 'Player 1', score: 0 },
      { id: '2', name: 'Player 2', score: 0 },
      { id: '3', name: 'Player 3', score: 0 },
      { id: '4', name: 'Player 4', score: 0 },
    ]
    setPlayers(defaultPlayers)
    setRounds([])
    setWinner(null)
    saveState({ players: defaultPlayers, rounds: [], winner: null })
  }

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-outfit font-bold text-gray-900 dark:text-white mb-1">
                Card Game Scorer
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Track your game scores effortlessly
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="touch-target p-3 rounded-xl glass hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Reset button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="touch-target p-3 rounded-xl glass hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Reset game"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Winner Announcement */}
        {winner && (
          <div className="mb-6 animate-scale-in">
            <div className="card bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 dark:from-yellow-900/30 dark:via-amber-900/20 dark:to-yellow-800/30 ring-2 ring-yellow-500 shadow-yellow-500/20">
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="text-2xl md:text-3xl font-outfit font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                  {winner.name} Wins!
                </h2>
                <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                  Final Score: {winner.score} points
                </p>
                <button
                  onClick={handleNewGame}
                  className="btn-cta shadow-xl shadow-yellow-500/20"
                >
                  Start New Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Score Board */}
        <ScoreBoard players={players} onUpdateName={handleUpdateName} />

        {/* Actions - Hide when game is over */}
        {!winner && (
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-cta flex-1 text-lg py-4 shadow-xl shadow-cta-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Round
            </button>
          </div>
        )}

        {/* Round History */}
        <RoundHistory rounds={rounds} players={players} onUndo={handleUndo} gameEnded={!!winner} />

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>First to 20 points wins • Tap any player name to edit • Scores auto-save</p>
        </footer>
      </div>

      {/* Add Round Modal */}
      <AddRoundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRound}
        players={players}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowResetConfirm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-outfit font-bold text-gray-900 dark:text-white mb-2">
              Reset Game?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will delete all players, scores, and round history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 touch-target px-4 py-2.5 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 active:scale-[0.98] transition-smooth cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
