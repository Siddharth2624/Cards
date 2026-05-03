'use client'

import { Player } from '@/lib/types'
import PlayerCard from './PlayerCard'

interface ScoreBoardProps {
  players: Player[]
  onUpdateName: (id: string, name: string) => void
}

export default function ScoreBoard({ players, onUpdateName }: ScoreBoardProps) {
  const maxScore = 20;
  const leaders = players.filter((p) => p.score === maxScore && maxScore > 0)

  return (
    <section className="mb-6 md:mb-8" aria-labelledby="scoreboard-heading">
      <h2 id="scoreboard-heading" className="sr-only">
        Scoreboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isLeader={leaders.some((l) => l.id === player.id)}
            onUpdateName={onUpdateName}
          />
        ))}
      </div>
    </section>
  )
}
