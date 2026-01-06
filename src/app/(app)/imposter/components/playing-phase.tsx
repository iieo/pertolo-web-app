'use client'

import { Button } from '@/components/ui/button'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const PlayingPhase = () => {
  const { gameState, finishGame } = useGame()

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-3xl md:mx-auto">
      <div className="flex-1 flex flex-col space-y-6 sm:space-y-10 py-4">
        
        {/* Header */}
        <div className="text-center space-y-2">
           <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Game On</h1>
           <p className="text-[#888] font-medium">Discuss, vote, and find the imposter.</p>
        </div>

        {/* Start Player */}
        <div className="bg-gradient-to-r from-[#fb8500] to-[#ffb703] rounded-2xl p-6 text-center shadow-lg transform transition-all hover:scale-[1.01]">
          <p className="text-black/70 font-bold uppercase tracking-widest text-sm mb-1">First Player</p>
          <p className="text-black font-black text-2xl sm:text-3xl">
            {gameState.players[Math.floor(Math.random() * gameState.players.length)]}
          </p>
          <p className="text-black/80 font-medium text-sm mt-1">Starts the discussion</p>
        </div>

        {/* Players & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           
           {/* Players List */}
           <div className="space-y-3">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm px-1">Players</h3>
              <div className="grid grid-cols-2 gap-2">
                {gameState.players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm font-semibold text-white whitespace-nowrap shadow-sm"
                  >
                    <span className="text-[#fb8500] mr-2 text-xs">{index + 1}</span>
                    <span className="truncate">{player}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Stats */}
           <div className="space-y-3">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm px-1">Roles</h3>
              <div className="grid grid-cols-2 gap-3 h-full content-start">
                 <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <EyeNoneIcon className="w-6 h-6 text-[#fb8500] mb-2" />
                    <span className="text-2xl font-bold text-white leading-none">{gameState.imposterCount}</span>
                    <span className="text-xs text-[#666] uppercase font-bold mt-1">Imposters</span>
                 </div>
                 <div className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <EyeOpenIcon className="w-6 h-6 text-white mb-2" />
                    <span className="text-2xl font-bold text-white leading-none">{gameState.players.length - gameState.imposterCount}</span>
                    <span className="text-xs text-[#666] uppercase font-bold mt-1">Civilians</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Rules/Goal */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-5 space-y-3">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Objectives</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
               <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
               <p className="text-sm text-[#ccc] leading-snug">
                 <strong className="text-white">Civilians:</strong> Describe the word subtly. Vote out the imposters.
               </p>
            </div>
            <div className="flex gap-3 items-start">
               <div className="w-1.5 h-1.5 rounded-full bg-[#fb8500] mt-2 shrink-0" />
               <p className="text-sm text-[#ccc] leading-snug">
                 <strong className="text-[#fb8500]">Imposters:</strong> Blend in. Try to guess the word from others' clues.
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-4 sm:pb-8 pt-4">
        <Button
          onClick={finishGame}
          className="w-full text-xl font-bold py-7 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-2xl transition-all active:scale-[0.98]"
          size="lg"
        >
          End Game
        </Button>
      </div>
    </div>
  )
}