'use client'

import { GameProvider, useGame } from './game-provider'
import { SetupPhase } from './components/setup-phase'
import { RevealPhase } from './components/reveal-phase'
import { PlayingPhase } from './components/playing-phase'

const ImposterGameContent = () => {
  const { gameState } = useGame()

  switch (gameState.phase) {
    case 'setup':
      return <SetupPhase />
    case 'reveal':
      return <RevealPhase key={gameState.currentPlayerIndex} />
    case 'playing':
      return <PlayingPhase />
    default:
      return <SetupPhase />
  }
}

const ImposterGame = () => {
  return (
    <GameProvider>
      <ImposterGameContent />
    </GameProvider>
  )
}

export default ImposterGame
