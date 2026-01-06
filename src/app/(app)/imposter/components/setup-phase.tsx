'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PersonIcon,
  GearIcon,
  PlayIcon,
  MinusIcon,
  PlusIcon,
  GridIcon,
  ShuffleIcon,
} from '@radix-ui/react-icons';
import { useGame } from '../game-provider';

export const SetupPhase = () => {
  const {
    gameState,
    setGameState,
    categories,
    loading,
    error,
    setPlayerCount,
    startGame,
  } = useGame();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedCategory = categories.find((c) => c.id === gameState.selectedCategoryId);

  const handleRandomCategory = () => {
    setGameState((prev) => ({ ...prev, selectedCategoryId: null }));
  };

  const handleIncrementPlayers = () => {
    if (gameState.players.length < 20) {
      setPlayerCount(gameState.players.length + 1);
    }
  };

  const handleDecrementPlayers = () => {
    if (gameState.players.length > 3) {
      setPlayerCount(gameState.players.length - 1);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-3xl md:mx-auto">
      <div className="flex-1 flex flex-col space-y-8">
        <div className="text-center pt-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Imposter
          </h1>
          <p className="text-base sm:text-lg text-[#888] font-medium">Find the secret agents</p>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="border-2 border-[#fb8500] bg-[#ffb703]/30 animate-pulse rounded-xl"
          >
            <AlertDescription className="text-lg font-medium text-[#fb8500]">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Players Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <PersonIcon className="w-5 h-5 text-[#fb8500]" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Players</h2>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 border border-[#222] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-lg">Number of Players</span>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleDecrementPlayers}
                  disabled={gameState.players.length <= 3}
                  className="bg-[#222] hover:bg-[#333] text-white w-12 h-12 rounded-xl p-0 flex items-center justify-center disabled:opacity-50"
                >
                  <MinusIcon className="w-6 h-6" />
                </Button>

                <span className="text-3xl font-black text-[#fb8500] tabular-nums min-w-[2ch] text-center">
                  {gameState.players.length}
                </span>

                <Button
                  onClick={handleIncrementPlayers}
                  disabled={gameState.players.length >= 20}
                  className="bg-[#fb8500] hover:bg-[#ffb703] text-black w-12 h-12 rounded-xl p-0 flex items-center justify-center disabled:opacity-50"
                >
                  <PlusIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <GearIcon className="w-5 h-5 text-[#fb8500]" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <Label className="text-sm font-semibold text-[#888] mb-3 block uppercase tracking-wider px-1">
                Word Category
              </Label>

              <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                <div className="p-6 text-center border-b border-[#222] bg-gradient-to-b from-[#1a1a1a] to-[#111]">
                  <p className="text-[#888] text-xs font-bold uppercase tracking-widest mb-2">
                    Current Selection
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                    {gameState.selectedCategoryId
                      ? selectedCategory
                        ? selectedCategory.name
                        : 'Loading...'
                      : 'Random Category'}
                  </h3>
                  {gameState.selectedCategoryId && selectedCategory?.description && (
                    <p className="text-[#666] text-sm max-w-md mx-auto line-clamp-2">
                      {selectedCategory.description}
                    </p>
                  )}
                  {!gameState.selectedCategoryId && (
                    <p className="text-[#666] text-sm max-w-md mx-auto">
                      A random word pack will be chosen for you.
                    </p>
                  )}
                </div>

                <div className="flex divide-x divide-[#222]">
                  <button
                    onClick={handleRandomCategory}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all active:bg-[#222] ${!gameState.selectedCategoryId ? 'bg-[#fb8500]/10 text-[#fb8500]' : 'bg-transparent text-white hover:bg-[#1a1a1a]'}`}
                  >
                    <ShuffleIcon
                      className={`w-4 h-4 ${!gameState.selectedCategoryId ? 'text-[#fb8500]' : 'text-[#666]'}`}
                    />
                    Random
                  </button>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all active:bg-[#222] ${gameState.selectedCategoryId ? 'bg-[#fb8500]/10 text-[#fb8500]' : 'bg-transparent text-white hover:bg-[#1a1a1a]'}`}
                      >
                        <GridIcon
                          className={`w-4 h-4 ${gameState.selectedCategoryId ? 'text-[#fb8500]' : 'text-[#666]'}`}
                        />
                        Select
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111] border-[#222] text-white max-h-[80vh] overflow-y-auto w-[95%] max-w-2xl rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">
                          Select Category
                        </DialogTitle>
                        <DialogDescription className="text-[#888]">
                          Choose a word pack for your game.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={`cursor-pointer transition-all duration-200 rounded-xl p-4 border-2 flex flex-col justify-center min-h-[5rem] ${gameState.selectedCategoryId === category.id
                              ? 'border-[#fb8500] bg-[#fb8500]/10'
                              : 'border-[#333] bg-[#1a1a1a] hover:border-[#555]'
                              }`}
                            onClick={() => {
                              setGameState((prev) => ({
                                ...prev,
                                selectedCategoryId: category.id,
                              }));
                              setIsDialogOpen(false);
                            }}
                          >
                            <h3
                              className={`font-bold text-base leading-tight mb-1 ${gameState.selectedCategoryId === category.id ? 'text-[#fb8500]' : 'text-white'}`}
                            >
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-[#666] text-xs leading-snug line-clamp-2">
                                {category.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Imposter Settings */}
            <div className="bg-[#111] rounded-2xl border border-[#222] p-4 space-y-6">
              <div>
                <Label className="text-sm font-semibold text-[#888] mb-3 block uppercase tracking-wider">
                  Imposters Count
                </Label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGameState((prev) => ({ ...prev, imposterCount: num }))}
                      className={`flex-1 h-12 text-lg font-bold rounded-xl transition-all duration-200 ${gameState.imposterCount === num
                        ? 'bg-[#fb8500] text-black shadow-lg'
                        : 'bg-[#1a1a1a] text-white hover:bg-[#222] border border-[#333]'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-white font-bold text-base">
                    Show Category to Imposter
                  </Label>
                  <p className="text-[#666] text-sm">Makes it easier for imposters to blend in.</p>
                </div>
                <Switch
                  checked={gameState.showCategoryToImposter ?? false}
                  onCheckedChange={(checked) =>
                    setGameState((prev) => ({ ...prev, showCategoryToImposter: checked }))
                  }
                  className="data-[state=checked]:bg-[#fb8500]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8 pt-4">
          <Button
            onClick={startGame}
            disabled={loading || gameState.players.length < 3}
            className="w-full text-xl font-bold py-7 bg-[#fb8500] hover:bg-[#ffb703] text-black shadow-lg rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-black"></div>
                Starting...
              </span>
            ) : (
              <>
                <PlayIcon className="w-6 h-6 mr-2" />
                Start Game
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
