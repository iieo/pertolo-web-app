'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { EyeNoneIcon, EyeOpenIcon, TimerIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const PlayingPhase = () => {
  const { gameState, finishGame } = useGame()
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Memoize start player to avoid change on every tick
  const [startPlayer] = useState(() =>
    gameState.players[Math.floor(Math.random() * gameState.players.length)]
  )

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-6 md:max-w-2xl md:mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-8">

        {/* Timer Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#fb8500] mb-2">
            <TimerIcon className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Game Time</span>
          </div>
          <div className="text-7xl sm:text-8xl font-black text-white tabular-nums tracking-tighter">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Start Player Card */}
        <div className="w-full bg-[#111] border border-[#222] rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#fb8500]" />
          <p className="text-[#666] font-bold uppercase tracking-widest text-xs mb-3">Starts the game</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {startPlayer}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <EyeNoneIcon className="w-6 h-6 text-[#fb8500] mb-2" />
            <span className="text-2xl font-black text-white leading-none">{gameState.imposterCount}</span>
            <span className="text-[10px] text-[#666] uppercase font-black mt-2 tracking-wider">Imposters</span>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <EyeOpenIcon className="w-6 h-6 text-white mb-2" />
            <span className="text-2xl font-black text-white leading-none">{gameState.players.length - gameState.imposterCount}</span>
            <span className="text-[10px] text-[#666] uppercase font-black mt-2 tracking-wider">Civilians</span>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4 w-full">
        <Button
          onClick={finishGame}
          className="w-full text-xl font-bold py-8 bg-white hover:bg-[#eee] text-black shadow-lg rounded-2xl transition-all active:scale-[0.98]"
          size="lg"
        >
          End Game
        </Button>
      </div>
    </div>
  )
}