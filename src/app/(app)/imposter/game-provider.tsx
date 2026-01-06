'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameState, Category } from './types'
import { dbGetCategories, dbGetRandomWord } from './actions'

type GameContextType = {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  categories: Category[]
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
  addPlayer: (playerName: string) => void
  removePlayer: (index: number) => void
  startGame: () => Promise<void>
  nextPlayer: () => void
  finishGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

type GameProviderProps = {
  children: ReactNode
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    players: [],
    imposters: new Set(),
    selectedCategoryId: null,
    imposterCount: 1,
    currentPlayerIndex: 0,
    selectedWord: null,
    showCategoryToImposter: false,
  })

  const [categories, setCategories] = useState<Category[]>([])
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

  const addPlayer = (playerName: string) => {
    if (playerName.trim() && !gameState.players.includes(playerName.trim())) {
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, playerName.trim()]
      }))
    }
  }

  const removePlayer = (index: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }))
  }

  const startGame = async () => {
    if (gameState.players.length < 3) {
      setError('Need at least 3 players')
      return
    }

    if (gameState.imposterCount >= gameState.players.length) {
      setError('Number of imposters must be less than total players')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let categoryId = gameState.selectedCategoryId
      
      // If no category selected (Random Mode), pick one now
      if (!categoryId) {
        if (categories.length === 0) {
          setError('No categories available')
          return
        }
        const randomCat = categories[Math.floor(Math.random() * categories.length)]
        if (!randomCat) {
          setError('Failed to select random category')
          setLoading(false)
          return
        }
        categoryId = randomCat.id
      }

      // Get random word
      const word = await dbGetRandomWord(categoryId)

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
      showCategoryToImposter: prev.showCategoryToImposter,
    }))
    setError(null)
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        categories,
        loading,
        error,
        setError,
        addPlayer,
        removePlayer,
        startGame,
        nextPlayer,
        finishGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
