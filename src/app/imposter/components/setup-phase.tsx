'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PersonIcon, GearIcon, PlayIcon, CrossCircledIcon, PlusIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const SetupPhase = () => {
  const {
    gameState,
    setGameState,
    categories,
    loading,
    error,
    addPlayer,
    removePlayer,
    startGame
  } = useGame()

  const [playerInput, setPlayerInput] = useState('')

  const handleAddPlayer = () => {
    addPlayer(playerInput)
    setPlayerInput('')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-auto flex flex-col space-y-6 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">Imposter Game</h1>
          <p className="text-lg text-[#888] font-medium">Find the secret agents among your friends</p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-2 border-[#fb8500] bg-[#ffb703]/30 animate-pulse">
            <AlertDescription className="text-lg font-medium text-[#fb8500]">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-8 bg-[#181818] border border-[#222] rounded-2xl shadow-md w-full">
          <div className="flex items-center gap-2 mb-4">
            <PersonIcon className="w-6 h-6 text-[#fb8500]" />
            <h2 className="text-2xl font-bold text-white">Add Players</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter player name"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="text-lg border border-[#333] bg-black text-white placeholder-[#888] focus:border-[#fb8500] rounded-lg"
            />
            <Button
              onClick={handleAddPlayer}
              className="bg-[#fb8500] hover:bg-[#ffb703] text-black font-bold px-6 rounded-lg shadow"
              size="lg"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {gameState.players.map((player, index) => (
              <Card
                key={index}
                className="border border-[#333] bg-[#222] hover:border-[#fb8500]/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#fb8500] text-black text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium truncate text-sm">
                      {player}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove player"
                    onClick={() => removePlayer(index)}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-[#fb8500]/20 transition-colors duration-200 group"
                  >
                    <CrossCircledIcon className="w-4 h-4 text-[#888] group-hover:text-[#fb8500] transition-colors" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#111] rounded-lg text-center border border-[#222]">
            <p className="text-lg font-semibold text-[#fb8500]">
              Players: {gameState.players.length} {gameState.players.length < 3 && '(need at least 3)'}
            </p>
          </div>
        </Card>

        <Card className="p-8 bg-[#181818] border border-[#222] rounded-2xl shadow-md w-full">
          <div className="flex items-center gap-2 mb-4">
            <GearIcon className="w-6 h-6 text-[#fb8500]" />
            <h2 className="text-2xl font-bold text-white">Game Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold text-white mb-4 block">Category</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-200 border-2 ${gameState.selectedCategoryId === category.id
                      ? 'border-[#fb8500] bg-[#fb8500]/20 shadow-lg'
                      : 'border-[#333] bg-[#222] hover:border-[#fb8500]/50 hover:bg-[#fb8500]/10'
                      }`}
                    onClick={() => setGameState(prev => ({ ...prev, selectedCategoryId: category.id }))}
                  >
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-base leading-tight">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-[#888] text-sm mt-1 leading-tight">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

            </div>

            <div>
              <Label className="text-lg font-semibold text-white mb-2 block">Number of Imposters</Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    onClick={() => setGameState(prev => ({ ...prev, imposterCount: num }))}
                    className={`flex-1 text-lg font-bold border rounded-lg transition-all duration-150 ${gameState.imposterCount === num
                      ? 'bg-[#fb8500] border-[#fb8500] text-black shadow-lg scale-105'
                      : 'bg-[#222] border-[#333] text-white hover:bg-[#fb8500]/20 hover:scale-105'
                      }`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button
          onClick={startGame}
          disabled={loading || gameState.players.length < 3 || !gameState.selectedCategoryId}
          className="w-full text-xl font-bold py-4 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-lg transition-all disabled:opacity-50"
          size="lg"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          {loading ? 'Starting Game...' : 'Start Game'}
        </Button>
      </div>
    </div>
  )
}
