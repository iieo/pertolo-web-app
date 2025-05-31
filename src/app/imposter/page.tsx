'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
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
    setGameState({
      phase: 'setup',
      players: [],
      imposters: new Set(),
      selectedCategoryId: null,
      imposterCount: 1,
      currentPlayerIndex: 0,
      selectedWord: null,
    })
    setError(null)
  }

  const renderSetupPhase = () => (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Imposter Game</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Players</h2>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter player name"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <Button onClick={addPlayer}>Add</Button>
        </div>
        
        <div className="space-y-2">
          {gameState.players.map((player, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>{player}</span>
              <Button variant="destructive" size="sm" onClick={() => removePlayer(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Players: {gameState.players.length} (minimum 3 required)
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={gameState.selectedCategoryId || ''}
              onChange={(e) => setGameState(prev => ({ ...prev, selectedCategoryId: e.target.value }))}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Imposters</label>
            <Input
              type="number"
              min="1"
              max={Math.max(1, gameState.players.length - 1)}
              value={gameState.imposterCount}
              onChange={(e) => setGameState(prev => ({ 
                ...prev, 
                imposterCount: parseInt(e.target.value) || 1 
              }))}
            />
          </div>
        </div>
      </Card>

      <Button 
        onClick={startGame} 
        disabled={loading || gameState.players.length < 3 || !gameState.selectedCategoryId}
        className="w-full"
      >
        {loading ? 'Starting Game...' : 'Start Game'}
      </Button>
    </div>
  )

  const renderRevealPhase = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]
    const isImposter = gameState.imposters.has(gameState.currentPlayerIndex)
    
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Player Reveal</h2>
          <p className="text-gray-600">
            Player {gameState.currentPlayerIndex + 1} of {gameState.players.length}
          </p>
        </div>

        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">{currentPlayer}</h3>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            {isImposter ? (
              <div className="text-red-600">
                <h4 className="text-2xl font-bold">IMPOSTER</h4>
                <p className="text-sm mt-2">You don't know the word!</p>
              </div>
            ) : (
              <div className="text-green-600">
                <h4 className="text-lg font-medium mb-2">Your word is:</h4>
                <p className="text-3xl font-bold">{gameState.selectedWord}</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Remember your role and pass the device to the next player
          </p>
        </Card>

        <Button onClick={nextPlayer} className="w-full">
          {gameState.currentPlayerIndex < gameState.players.length - 1 ? 'Next Player' : 'Start Game'}
        </Button>
      </div>
    )
  }

  const renderPlayingPhase = () => (
    <div className="max-w-md mx-auto p-6 space-y-6 text-center">
      <h1 className="text-3xl font-bold">Game in Progress</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <div className="grid grid-cols-2 gap-2">
          {gameState.players.map((player, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              {player}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Imposters: {gameState.imposterCount}</p>
          <p>Word holders: {gameState.players.length - gameState.imposterCount}</p>
        </div>
      </Card>

      <div className="space-y-2 text-gray-600">
        <p>Discuss and try to find the imposters!</p>
        <p>Imposters: try to blend in without knowing the word</p>
      </div>

      <Button onClick={finishGame} className="w-full">
        Finish Game
      </Button>
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
