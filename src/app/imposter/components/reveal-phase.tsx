'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const RevealPhase = () => {
  const { gameState, nextPlayer } = useGame()

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]
  const isImposter = gameState.imposters.has(gameState.currentPlayerIndex)

  return (
    <div className="fixed inset-0 bg-[#111] flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col space-y-6 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8 justify-center items-center min-h-0 h-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">Player Reveal</h2>
          <div className="bg-[#181818] rounded-full px-4 py-2 inline-block border border-[#222]">
            <p className="text-lg font-semibold text-[#fb8500]">
              Player {gameState.currentPlayerIndex + 1} of {gameState.players.length}
            </p>
          </div>
        </div>

        <Card className="p-8 text-center bg-black border border-[#222] rounded-2xl shadow-md">
          <h3 className="text-3xl font-bold mb-6 text-white">{currentPlayer}</h3>

          <div className={`p-8 rounded-2xl mb-6 border-2 ${isImposter
            ? 'bg-[#181818] border-[#fb8500] animate-pulse'
            : 'bg-[#181818] border-[#222]'
            }`}>
            {isImposter ? (
              <div className="text-[#fb8500]">
                <EyeNoneIcon className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-3xl font-bold mb-2">IMPOSTER</h4>
                <p className="text-lg font-medium">You don't know the word</p>
              </div>
            ) : (
              <div className="text-white">
                <EyeOpenIcon className="w-16 h-16 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Your secret word is:</h4>
                <p className="text-4xl font-bold text-[#fb8500]">
                  {gameState.selectedWord}
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#181818] border border-[#222] rounded-lg p-4 mb-6">
            <p className="text-lg font-medium text-[#fb8500]">
              Remember your role and pass to the next player
            </p>
          </div>
        </Card>

        <Button
          onClick={nextPlayer}
          className="w-full text-xl font-bold py-4 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-lg transition-all"
          size="lg"
        >
          {gameState.currentPlayerIndex < gameState.players.length - 1 ? 'Next Player' : 'Start Game'}
        </Button>
      </div>
    </div>
  )
}
