export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export interface Player {
  id: string
  name: string
  score: number
}

export interface Bid {
  playerId: string
  amount: number
}

export interface Round {
  id: string
  bids: Bid[]
  powerSuit: Suit
  actualWins: Record<string, number>
  timestamp: number
}

export interface GameState {
  players: Player[]
  rounds: Round[]
  winner: Player | null
}

export const SUIT_SYMBOLS: Record<Suit, { symbol: string; color: string }> = {
  spades: { symbol: '♠️', color: 'text-gray-800 dark:text-gray-200' },
  hearts: { symbol: '♥️', color: 'text-red-500' },
  diamonds: { symbol: '♦️', color: 'text-red-500' },
  clubs: { symbol: '♣️', color: 'text-gray-800 dark:text-gray-200' },
}

export const TOTAL_TRICKS = 11
export const MIN_BID = 5
export const WINNING_SCORE = 20
