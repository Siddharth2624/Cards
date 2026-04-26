'use client'

import { Round, SUIT_SYMBOLS } from '@/lib/types'

interface RoundHistoryProps {
  rounds: Round[]
  players: { id: string; name: string }[]
  onUndo: () => void
  gameEnded?: boolean
}

export default function RoundHistory({ rounds, players, onUndo, gameEnded = false }: RoundHistoryProps) {
  if (rounds.length === 0) {
    return (
      <section className="card" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-lg font-outfit font-bold text-gray-900 dark:text-white mb-4">
          Round History
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No rounds played yet</p>
          <p className="text-sm">Add your first round to get started!</p>
        </div>
      </section>
    )
  }

  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || 'Unknown'

  return (
    <section className="card" aria-labelledby="history-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="history-heading" className="text-lg font-outfit font-bold text-gray-900 dark:text-white">
          Round History ({rounds.length})
        </h2>
        {!gameEnded && (
          <button
            onClick={onUndo}
            className="touch-target btn-ghost px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
            aria-label="Undo last round"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto -mx-4 px-4">
        {rounds.slice().reverse().map((round, index) => {
          const actualIndex = rounds.length - index

          // Calculate success for each player
          const playerResults = players.map((player) => {
            const bid = round.bids.find((b) => b.playerId === player.id)?.amount || 0
            const actualWin = round.actualWins[player.id] || 0
            const succeeded = actualWin >= bid
            const scoreChange = succeeded ? bid : -bid

            return {
              player,
              bid,
              actualWin,
              succeeded,
              scoreChange,
            }
          })

          const successCount = playerResults.filter((r) => r.succeeded).length

          return (
            <div
              key={round.id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 animate-fade-in"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    #{actualIndex}
                  </span>
                  <span className={`text-2xl ${SUIT_SYMBOLS[round.powerSuit].color}`}>
                    {SUIT_SYMBOLS[round.powerSuit].symbol}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    successCount === 4
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                      : successCount >= 2
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                  }`}
                >
                  {successCount}/4 Success
                </span>
              </div>

              {/* Players results */}
              <div className="space-y-2">
                {playerResults.map((result) => (
                  <div
                    key={result.player.id}
                    className={`p-3 rounded-lg ${
                      result.succeeded
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {result.player.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Bid: {result.bid || 'Pass'} → Won: {result.actualWin}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-2xl ${result.succeeded ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {result.succeeded ? '✓' : '✗'}
                        </span>
                        <span
                          className={`font-outfit font-bold text-lg ${
                            result.scoreChange >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {result.scoreChange >= 0 ? '+' : ''}
                          {result.scoreChange}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total bids */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total Bids: {round.bids.reduce((sum, b) => sum + b.amount, 0)} |
                  Total Won: {Object.values(round.actualWins).reduce((sum, v) => sum + v, 0)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
