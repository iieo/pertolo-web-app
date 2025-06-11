'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const RevealPhase = () => {
  const { gameState, nextPlayer } = useGame()
  const [isCardRevealed, setIsCardRevealed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]
  const isImposter = gameState.imposters.has(gameState.currentPlayerIndex)

  const handleCardClick = () => {
    if (!isDragging) {
      setIsCardRevealed(true)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setDragStartY(e.touches[0].clientY)
      setIsDragging(false)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return
    const currentY = e.touches[0].clientY
    const deltaY = dragStartY - currentY

    if (Math.abs(deltaY) > 10) {
      setIsDragging(true)
    }

    if (deltaY > 50 && !isCardRevealed) {
      setIsCardRevealed(true)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setDragStartY(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartY(e.clientY)
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      const currentY = e.clientY
      const deltaY = dragStartY - currentY

      if (Math.abs(deltaY) > 10) {
        setIsDragging(true)
      }

      if (deltaY > 50 && !isCardRevealed) {
        setIsCardRevealed(true)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStartY(0)
  }

  const handleNextPlayer = () => {
    setIsCardRevealed(false)
    nextPlayer()
  }

  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto flex flex-col space-y-6 bg-[#111] rounded-3xl shadow-xl border border-[#222] p-4 sm:p-8">
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

          {/* Fixed container to prevent layout shifts */}
          <div className="relative mb-6 h-64 overflow-hidden">
            {/* Hidden content behind the card */}
            <div className={`absolute inset-0 p-8 rounded-2xl border-2 transition-all duration-500 ${isImposter
              ? 'bg-[#181818] border-[#fb8500]'
              : 'bg-[#181818] border-[#222]'
              } ${isCardRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {isImposter ? (
                <div className="text-[#fb8500] flex flex-col items-center justify-center h-full">
                  <EyeNoneIcon className="w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-3xl font-bold mb-2">IMPOSTER</h4>
                  <p className="text-lg font-medium">You don&lsquo;t know the word</p>
                </div>
              ) : (
                <div className="text-white flex flex-col items-center justify-center h-full">
                  <EyeOpenIcon className="w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-xl font-medium mb-2">Your secret word is:</h4>
                  <p className="text-4xl font-bold text-[#fb8500]">
                    {gameState.selectedWord}
                  </p>
                </div>
              )}
            </div>

            {/* Draggable/Clickable card overlay - contained within fixed height container */}
            <div
              ref={cardRef}
              className="absolute inset-0 p-8 rounded-2xl border-2 bg-gradient-to-br from-[#fb8500] to-[#ffb703] border-[#fb8500] cursor-pointer select-none transition-all duration-500"
              style={{
                transform: isCardRevealed ? 'translateY(-100%)' : 'translateY(0)',
                opacity: isCardRevealed ? 0 : 1,
                pointerEvents: isCardRevealed ? 'none' : 'auto',
                boxShadow: !isCardRevealed ? '0 10px 25px rgba(251, 133, 0, 0.3)' : 'none'
              }}
              onClick={handleCardClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div className="flex flex-col items-center justify-center h-full text-black">
                <h4 className="text-2xl font-bold mb-2">Tap or Swipe Up</h4>
                <p className="text-lg font-medium">to reveal your role</p>
              </div>
            </div>
          </div>

          {/* Instructions that appear after card reveal - fixed height to prevent layout shift */}
          <div className="h-20 mb-6">
            {isCardRevealed && (
              <div className="bg-[#181818] border border-[#222] rounded-lg p-4 opacity-0" style={{ animation: 'fadeIn 0.5s ease-in-out 0.3s forwards' }}>
                <p className="text-lg font-medium text-[#fb8500]">
                  Remember your role and pass to the next player
                </p>
              </div>
            )}
          </div>


        </Card>

        <Button
          onClick={handleNextPlayer}
          className="w-full text-xl font-bold py-4 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-lg transition-all"
          size="lg"
        >
          {gameState.currentPlayerIndex < gameState.players.length - 1 ? 'Next Player' : 'Start Game'}
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
