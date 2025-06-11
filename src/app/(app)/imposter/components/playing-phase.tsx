'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const PlayingPhase = () => {
  const { gameState, finishGame } = useGame()

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto flex flex-col space-y-6 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Game in Progress</h1>
        </div>
        <div className="text-center mt-8 py-4 bg-[#fb8500] rounded-lg">
          <p className="text-black font-bold text-lg">
            {gameState.players[Math.floor(Math.random() * gameState.players.length)]} starts the game
          </p>
        </div>
        <Card className="p-8 bg-[#181818] border border-[#222] rounded-2xl shadow-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-white">Players</h2>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {gameState.players.map((player, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 rounded-full border border-[#333] text-xs font-semibold bg-[#222] text-white whitespace-nowrap"
                style={{ minWidth: 0, maxWidth: '100%' }}
              >
                <span className="truncate">{index + 1}. {player}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#111] rounded-lg border border-[#222]">
            <div className="flex justify-around text-center">
              <div>
                <EyeNoneIcon className="w-8 h-8 mx-auto text-[#fb8500] mb-2" />
                <p className="font-bold text-[#fb8500]">{gameState.imposterCount} Imposters</p>
              </div>
              <div>
                <EyeOpenIcon className="w-8 h-8 mx-auto text-white mb-2" />
                <p className="font-bold text-white">{gameState.players.length - gameState.imposterCount} Word Holders</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-[#181818] border border-[#222] rounded-2xl shadow-md w-full">
          <h3 className="text-xl font-bold mb-4 text-white">How to Play</h3>
          <div className="space-y-3 text-left">
            <p className="text-sm text-white"><strong className="text-[#fb8500]">Word Holders:</strong> Discuss the word without saying it</p>
            <p className="text-sm text-white"><strong className="text-[#fb8500]">Imposters:</strong> Blend in and guess the word</p>
            <p className="text-sm text-white"><strong className="text-[#ffb703]">Goal:</strong> Find the imposters through discussion</p>
          </div>
        </Card>

        <Button
          onClick={finishGame}
          className="w-full text-xl font-bold py-4 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-lg transition-all"
          size="lg"
        >
          Finish Game
        </Button>
      </div>
    </div>
  )
}
