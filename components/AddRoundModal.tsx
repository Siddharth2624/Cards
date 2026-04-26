'use client'

import { useState, useEffect } from 'react'
import { Player, Suit, SUIT_SYMBOLS, TOTAL_TRICKS } from '@/lib/types'

type Step = 'five-sets-check' | 'select-power-suit' | 'bidding' | 'results'

interface Bid {
  playerId: string
  amount: number
}

interface AddRoundModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    bids: Bid[]
    powerSuit: Suit
    actualWins: Record<string, number>
  }) => void
  players: Player[]
}

export default function AddRoundModal({
  isOpen,
  onClose,
  onSubmit,
  players,
}: AddRoundModalProps) {
  const [step, setStep] = useState<Step>('five-sets-check')
  const [fiveSetsPlayerId, setFiveSetsPlayerId] = useState<string | null>(null)
  const [powerSuit, setPowerSuit] = useState<Suit | null>(null)
  const [bids, setBids] = useState<Record<string, number | string>>({})
  const [actualWins, setActualWins] = useState<Record<string, number | string>>({})
  const [error, setError] = useState<string>('')

  const MIN_OTHER_BID = 2
  const FIVE_SETS_BID = 5

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('five-sets-check')
      setFiveSetsPlayerId(null)
      setPowerSuit(null)
      setBids({})
      setActualWins({})
      setError('')
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Step 1: Someone can make 5 sets
  const handleHasFiveSets = (hasPlayer: boolean) => {
    if (hasPlayer) {
      setStep('select-power-suit')
    } else {
      // No one has 5 sets - Spades becomes power suit
      setPowerSuit('spades')
      setStep('bidding')
    }
  }

  // Step 2: Select who has 5 sets and choose power suit
  const handleFiveSetsPlayerSelect = (playerId: string) => {
    setFiveSetsPlayerId(playerId)
    // Lock their bid at 5
    setBids({ [playerId]: FIVE_SETS_BID })
    setStep('select-power-suit')
  }

  const handlePowerSuitSelect = (suit: Suit) => {
    setPowerSuit(suit)
    setStep('bidding')
  }

  // Step 3: All players enter bids (5-sets player already locked at 5)
  const handleBidChange = (playerId: string, value: string) => {
    const num = value === '' ? '' : Math.max(0, Number(value))
    setBids((prev) => ({ ...prev, [playerId]: num }))
  }

  const allBidsEntered = () => {
    return players.every((p) => bids[p.id] !== undefined && bids[p.id] !== '')
  }

  const bidsValid = () => {
    for (const player of players) {
      const bid = bids[player.id]
      if (bid === undefined || bid === '') return false
      if (player.id === fiveSetsPlayerId) {
        if (bid !== FIVE_SETS_BID) return false
      } else {
        if (Number(bid) < MIN_OTHER_BID) return false
      }
    }
    return true
  }

  const handleNextToResults = () => {
    if (!powerSuit) {
      setError('Power suit not selected')
      return
    }
    if (!bidsValid()) {
      setError('All players must enter bids (minimum 2 for non-5-set players)')
      return
    }
    setStep('results')
    setError('')
  }

  // Step 4: Enter actual wins
  const handleActualWinChange = (playerId: string, value: string) => {
    const num = value === '' ? '' : Math.max(0, Number(value))
    setActualWins((prev) => ({ ...prev, [playerId]: num }))
  }

  const allActualWinsEntered = () => {
    return players.every((p) => actualWins[p.id] !== undefined && actualWins[p.id] !== '')
  }

  const handleSubmitResults = () => {
    if (!allActualWinsEntered()) {
      setError('Please enter actual sets won for all players')
      return
    }

    onSubmit({
      bids: Object.entries(bids).map(([id, amount]) => ({ playerId: id, amount: Number(amount) })),
      powerSuit: powerSuit!,
      actualWins: Object.fromEntries(
        Object.entries(actualWins).map(([id, val]) => [id, Number(val)])
      ),
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-outfit font-bold text-gray-900 dark:text-white">
              {step === 'five-sets-check' && 'Initial Deal Check'}
              {step === 'select-power-suit' && 'Select Power Suit'}
              {step === 'bidding' && 'Enter Bids'}
              {step === 'results' && 'Enter Results'}
            </h2>
            <button
              onClick={onClose}
              className="touch-target p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress indicator */}
          <div className="flex gap-2 mt-3">
            <div className={`flex-1 h-1.5 rounded-full ${
              ['five-sets-check', 'select-power-suit'].includes(step) ? 'bg-primary-600' : 'bg-green-500'
            }`} />
            <div className={`flex-1 h-1.5 rounded-full ${
              step === 'bidding' ? 'bg-primary-600' : step === 'results' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
            <div className={`flex-1 h-1.5 rounded-full ${
              step === 'results' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'five-sets-check' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🎴</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  After dealing <strong>5 cards</strong> to each player...
                </p>
                <h3 className="text-xl font-outfit font-bold text-gray-900 dark:text-white mb-4">
                  Can anyone make 5 sets?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleHasFiveSets(true)}
                  className="btn-primary py-4 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleHasFiveSets(false)}
                  className="btn-secondary py-4 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  No
                </button>
              </div>
            </div>
          )}

          {step === 'select-power-suit' && (
            <div className="space-y-6">
              {!fiveSetsPlayerId ? (
                <>
                  <div className="text-center py-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      Who can make 5 sets?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {players.map((player) => (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => handleFiveSetsPlayerSelect(player.id)}
                        className="touch-target p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-800/50 text-primary-700 dark:text-primary-300 font-semibold transition-smooth"
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-2">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>{players.find(p => p.id === fiveSetsPlayerId)?.name}</strong> will make 5 sets
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      They choose the power suit:
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {(Object.keys(SUIT_SYMBOLS) as Suit[]).map((suit) => (
                      <button
                        key={suit}
                        type="button"
                        onClick={() => handlePowerSuitSelect(suit)}
                        className={`touch-target aspect-square rounded-2xl text-3xl sm:text-4xl transition-smooth flex items-center justify-center ${
                          powerSuit === suit
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {SUIT_SYMBOLS[suit].symbol}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'bidding' && (
            <div className="space-y-6">
              {/* Power suit display */}
              {powerSuit && (
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Power Suit</div>
                  <div className={`text-4xl ${SUIT_SYMBOLS[powerSuit].color}`}>
                    {SUIT_SYMBOLS[powerSuit].symbol}
                  </div>
                </div>
              )}

              <div className="card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {fiveSetsPlayerId ? 'Enter bids for remaining players' : 'All players enter bids'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {fiveSetsPlayerId
                    ? `The player who said "5 sets" already has bid = ${FIVE_SETS_BID}. Others bid minimum ${MIN_OTHER_BID}.`
                    : `All players bid minimum ${MIN_OTHER_BID}.`}
                </p>

                <div className="space-y-3">
                  {players.map((player) => {
                    const isFiveSetsPlayer = player.id === fiveSetsPlayerId
                    const bid = bids[player.id]

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isFiveSetsPlayer
                            ? 'bg-cta-50 dark:bg-cta-900/20 ring-1 ring-cta-500'
                            : 'bg-gray-50 dark:bg-gray-700/30'
                        }`}
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {player.name}
                          {isFiveSetsPlayer && (
                            <span className="ml-2 text-xs text-cta-600 dark:text-cta-400">
                              (5 sets)
                            </span>
                          )}
                        </span>
                        {isFiveSetsPlayer ? (
                          <span className="font-outfit font-bold text-lg text-cta-600 dark:text-cta-400">
                            {FIVE_SETS_BID} (locked)
                          </span>
                        ) : (
                          <input
                            type="number"
                            inputMode="numeric"
                            min={MIN_OTHER_BID}
                            value={bid ?? ''}
                            onChange={(e) => handleBidChange(player.id, e.target.value)}
                            className="input w-20 text-center"
                            placeholder={`≥${MIN_OTHER_BID}`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleNextToResults}
                className="btn-cta w-full text-lg"
              >
                Continue to Results →
              </button>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-6">
              {/* Bids summary for reference */}
              <div className="card bg-gray-50 dark:bg-gray-700/30">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Bids (for reference)
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {players.map((player) => {
                    const bid = bids[player.id] ?? 0
                    return (
                      <div key={player.id}>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {player.name}
                        </div>
                        <div className={`font-outfit font-bold text-lg ${
                          player.id === fiveSetsPlayerId
                            ? 'text-cta-600 dark:text-cta-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {bid}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actual wins input */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Enter actual sets won by each player
                </h3>
                <div className="space-y-3">
                  {players.map((player) => {
                    const playerBid = bids[player.id] ?? 0
                    const actualWin = actualWins[player.id]
                    const success = actualWin !== undefined && actualWin !== '' && Number(actualWin) >= playerBid
                    const scoreChange = success ? playerBid : -playerBid

                    return (
                      <div key={player.id} className="card">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {player.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                              (bid: {playerBid})
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              value={actualWin ?? ''}
                              onChange={(e) => handleActualWinChange(player.id, e.target.value)}
                              className="input w-16 text-center"
                              placeholder="0"
                            />
                            {actualWins[player.id] !== undefined && actualWins[player.id] !== '' && (
                              <span
                                className={`text-sm font-semibold ${
                                  success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {success ? '+' : ''}
                                {scoreChange}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Score preview */}
              {allActualWinsEntered() && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Score Changes
                  </h3>
                  <div className="space-y-2">
                    {players.map((player) => {
                      const playerBid = bids[player.id] ?? 0
                      const actualWin = Number(actualWins[player.id]) || 0
                      const success = actualWin >= playerBid
                      const scoreChange = success ? playerBid : -playerBid

                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {player.name}
                          </span>
                          <span
                            className={`font-outfit font-bold ${
                              scoreChange >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {scoreChange >= 0 ? '+' : ''}
                            {scoreChange}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmitResults}
                className="btn-cta w-full text-lg"
              >
                Complete Round
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
