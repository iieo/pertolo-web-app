'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PersonIcon, EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const PlayingPhase = () => {
  const { gameState, finishGame } = useGame()

  return (
    <div className="min-h-screen h-screen bg-black p-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-md w-full mx-auto space-y-8 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8 text-center flex flex-col justify-center items-center h-[90vh]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Game in Progress</h1>
          <div className="flex justify-center space-x-2 text-4xl">
            <PersonIcon className="w-12 h-12 text-[#fb8500]" />
            <EyeNoneIcon className="w-12 h-12 text-[#fb8500]" />
          </div>
        </div>

        <Card className="p-8 bg-[#181818] border border-[#222] rounded-2xl shadow-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-white">Players</h2>
          <div className="grid grid-cols-2 gap-3">
            {gameState.players.map((player, index) => (
              <div
                key={index}
                className="p-3 rounded-lg font-semibold border border-[#333] bg-black text-white"
              >
                {player}
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
            <p className="text-lg text-white"><strong className="text-[#fb8500]">Word Holders:</strong> Discuss the word without saying it</p>
            <p className="text-lg text-white"><strong className="text-[#fb8500]">Imposters:</strong> Blend in and guess the word</p>
            <p className="text-lg text-white"><strong className="text-[#ffb703]">Goal:</strong> Find the imposters through discussion</p>
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
