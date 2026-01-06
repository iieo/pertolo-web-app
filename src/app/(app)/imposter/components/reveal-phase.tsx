'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useGame } from '../game-provider'

export const RevealPhase = () => {
  const { gameState, nextPlayer, categories } = useGame()
  const [isCardRevealed, setIsCardRevealed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]
  const isImposter = gameState.imposters.has(gameState.currentPlayerIndex)
  const selectedCategory = categories.find(c => c.id === gameState.selectedCategoryId)

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
    setTimeout(() => {
      nextPlayer()
    }, 1000);
  }

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 sm:p-6 md:max-w-3xl md:mx-auto">
      <div className="w-full flex-1 flex flex-col items-center justify-center space-y-8">
        
        <div className="text-center space-y-4 w-full">
           <div className="bg-[#111] border border-[#222] rounded-full px-6 py-2 inline-block shadow-sm">
            <p className="text-sm font-bold text-[#fb8500] uppercase tracking-widest">
              Player {gameState.currentPlayerIndex + 1} / {gameState.players.length}
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white truncate px-2 leading-tight">
            {currentPlayer}
          </h2>
          <p className="text-[#888] font-medium">It&apos;s your turn to see the secret word.</p>
        </div>

        {/* Reveal Area */}
        <div className="w-full max-w-sm aspect-[3/4] max-h-[50vh] relative perspective-1000">
          {/* Hidden Content (Result) */}
          <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center shadow-2xl ${isImposter
            ? 'bg-[#111] border-[#fb8500]'
            : 'bg-[#111] border-[#333]'
            } ${isCardRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            {isImposter ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500 w-full">
                <div className="w-24 h-24 rounded-full bg-[#fb8500]/10 flex items-center justify-center mx-auto">
                  <EyeNoneIcon className="w-12 h-12 text-[#fb8500]" />
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white mb-2 tracking-tight">IMPOSTER</h4>
                  
                  {gameState.showCategoryToImposter && selectedCategory ? (
                    <div className="mt-6 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]">
                       <p className="text-[#888] text-xs font-bold uppercase tracking-widest mb-2">The Category is</p>
                       <p className="text-[#fb8500] text-xl font-bold leading-tight">{selectedCategory.name}</p>
                    </div>
                  ) : (
                    <p className="text-[#888] font-medium text-lg leading-snug">Blend in. Don&apos;t let them know you don&apos;t know.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                 <div className="w-24 h-24 rounded-full bg-[#333] flex items-center justify-center mx-auto">
                  <EyeOpenIcon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-medium text-[#888] mb-1">Your secret word</h4>
                  <p className="text-4xl sm:text-5xl font-black text-[#fb8500] break-words leading-tight">
                    {gameState.selectedWord}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cover Card */}
          <div
            ref={cardRef}
            className="absolute inset-0 rounded-3xl border-2 bg-gradient-to-br from-[#fb8500] to-[#ffb703] border-[#fb8500] cursor-pointer select-none transition-all duration-700 ease-out flex flex-col items-center justify-center p-6 text-center shadow-[0_20px_50px_-12px_rgba(251,133,0,0.5)] z-10 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              transform: isCardRevealed ? 'translateY(-120%) rotate(-5deg)' : 'translateY(0) rotate(0)',
              opacity: isCardRevealed ? 0 : 1,
              pointerEvents: isCardRevealed ? 'none' : 'auto',
            }}
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-black tracking-tight">TAP TO REVEAL</h4>
              <p className="text-black/70 font-bold uppercase tracking-wider text-sm">or swipe up</p>
            </div>
            <div className="absolute bottom-8 animate-bounce">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m18 15-6-6-6 6"/></svg>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-sm space-y-4 h-24">
           {isCardRevealed && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
                <Button
                  onClick={handleNextPlayer}
                  className="w-full text-xl font-bold py-7 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-2xl transition-all active:scale-[0.98]"
                  size="lg"
                >
                  {gameState.currentPlayerIndex < gameState.players.length - 1 ? 'Next Player' : 'Start Game'}
                </Button>
                <p className="text-center text-[#666] text-sm mt-3 font-medium">Pass device to the next player</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}