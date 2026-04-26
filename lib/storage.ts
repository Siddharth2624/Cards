import { GameState, Player, Round, Bid } from './types'

const STORAGE_KEY = 'card-game-scorer'

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Player 1', score: 0 },
  { id: '2', name: 'Player 2', score: 0 },
  { id: '3', name: 'Player 3', score: 0 },
  { id: '4', name: 'Player 4', score: 0 },
]

export const loadState = (): GameState => {
  if (typeof window === 'undefined') {
    return { players: DEFAULT_PLAYERS, rounds: [], winner: null }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GameState
      return {
        players: parsed.players || DEFAULT_PLAYERS,
        rounds: parsed.rounds || [],
        winner: parsed.winner || null,
      }
    }
  } catch (error) {
    console.error('Failed to load state:', error)
  }

  return { players: DEFAULT_PLAYERS, rounds: [], winner: null }
}

export const saveState = (state: GameState): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state:', error)
  }
}

export const clearState = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear state:', error)
  }
}

export const calculateNewScores = (
  players: Player[],
  roundData: { bids: Bid[]; actualWins: Record<string, number> }
): Player[] => {
  return players.map((player) => {
    const bid = roundData.bids.find((b) => b.playerId === player.id)?.amount || 0
    const actualWins = roundData.actualWins[player.id] || 0

    // Scoring: if actual >= bid, add bid; else subtract bid
    const scoreChange = actualWins >= bid ? bid : -bid
    const newScore = player.score + scoreChange

    return { ...player, score: newScore }
  })
}

export const checkWinner = (players: Player[]): Player | null => {
  // Find players with score >= winning score
  const winners = players.filter((p) => p.score >= 20)
  if (winners.length === 0) return null

  // Return the player with highest score
  return winners.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  )
}
