'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PersonIcon, GearIcon, PlayIcon, CrossCircledIcon, PlusIcon, EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { dbGetCategories, dbGetRandomWord } from './actions'

type GamePhase = 'setup' | 'reveal' | 'playing' | 'finished'

type Category = {
  id: string
  name: string
  description: string | null
}

type GameState = {
  phase: GamePhase
  players: string[]
  imposters: Set<number>
  selectedCategoryId: string | null
  imposterCount: number
  currentPlayerIndex: number
  selectedWord: string | null
}

function ImposterGame() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    players: [],
    imposters: new Set(),
    selectedCategoryId: null,
    imposterCount: 1,
    currentPlayerIndex: 0,
    selectedWord: null,
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [playerInput, setPlayerInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await dbGetCategories()
        setCategories(fetchedCategories)
      } catch (err) {
        setError('Failed to load categories')
        console.error(err)
      }
    }
    loadCategories()
  }, [])

  const addPlayer = () => {
    if (playerInput.trim() && !gameState.players.includes(playerInput.trim())) {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, playerInput.trim()]
      }))
      setPlayerInput('')
    }
  }

  const removePlayer = (index: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }))
  }

  const startGame = async () => {
    if (gameState.players.length < 3 || !gameState.selectedCategoryId) {
      setError('Need at least 3 players and a category selected')
      return
    }

    if (gameState.imposterCount >= gameState.players.length) {
      setError('Number of imposters must be less than total players')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get random word
      const word = await dbGetRandomWord(gameState.selectedCategoryId)

      if (!word) {
        setError('No words found for this category')
        return
      }

      // Randomly select imposters
      const imposterIndices = new Set<number>()
      while (imposterIndices.size < gameState.imposterCount) {
        const randomIndex = Math.floor(Math.random() * gameState.players.length)
        imposterIndices.add(randomIndex)
      }

      setGameState(prev => ({
        ...prev,
        phase: 'reveal',
        imposters: imposterIndices,
        selectedWord: word.word,
        currentPlayerIndex: 0
      }))
    } catch (err) {
      setError('Failed to start game')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const nextPlayer = () => {
    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        phase: 'playing'
      }))
    }
  }

  const finishGame = () => {
    setGameState(prev => ({
      phase: 'setup',
      players: prev.players,
      imposters: new Set(),
      selectedCategoryId: prev.selectedCategoryId,
      imposterCount: prev.imposterCount,
      currentPlayerIndex: 0,
      selectedWord: null,
    }))
    setError(null)
  }

  const playerColors = [
    'bg-[#8ecae6] border-[#219ebc] text-[#023047]',
    'bg-[#219ebc] border-[#8ecae6] text-white',
    'bg-[#ffb703] border-[#fb8500] text-[#023047]',
    'bg-[#fb8500] border-[#ffb703] text-white',
    'bg-[#023047] border-[#219ebc] text-[#8ecae6]',
  ]

  const cardBg = "bg-[#023047]/95"
  const cardBorder = "border-2 border-[#219ebc]/60"
  const cardShadow = "shadow-2xl"

  const renderSetupPhase = () => (
    <div className="min-h-screen h-screen bg-black p-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-2xl w-full mx-auto space-y-8 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8 flex flex-col justify-center items-center h-[90vh]">
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
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              className="text-lg border border-[#333] bg-black text-white placeholder-[#888] focus:border-[#fb8500] rounded-lg"
            />
            <Button
              onClick={addPlayer}
              className="bg-[#fb8500] hover:bg-[#ffb703] text-black font-bold px-6 rounded-lg shadow"
              size="lg"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {gameState.players.map((player, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 rounded-full border border-[#333] text-xs font-semibold bg-[#222] text-white whitespace-nowrap"
                style={{ minWidth: 0, maxWidth: '100%' }}
              >
                <span className="truncate">{index + 1}. {player}</span>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => removePlayer(index)}
                  className="ml-1 p-0.5 rounded hover:bg-[#fb8500]/60 transition"
                >
                  <CrossCircledIcon className="w-4 h-4 text-[#fb8500]" />
                </button>
              </div>
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
              <Label className="text-lg font-semibold text-white mb-2 block">Category</Label>
              <select
                className="w-full p-3 border border-[#333] rounded-lg text-lg focus:border-[#fb8500] bg-black text-white transition-all focus:ring-2 focus:ring-[#fb8500]/60"
                value={gameState.selectedCategoryId || ''}
                onChange={(e) => setGameState(prev => ({ ...prev, selectedCategoryId: e.target.value }))}
              >
                <option value="">Choose your adventure...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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

  const renderRevealPhase = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]
    const isImposter = gameState.imposters.has(gameState.currentPlayerIndex)

    return (
      <div className="min-h-screen bg-[#111] p-6 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto space-y-8 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8">
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

  const renderPlayingPhase = () => (
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

  switch (gameState.phase) {
    case 'setup':
      return renderSetupPhase()
    case 'reveal':
      return renderRevealPhase()
    case 'playing':
      return renderPlayingPhase()
    default:
      return renderSetupPhase()
  }
}

export default ImposterGame
