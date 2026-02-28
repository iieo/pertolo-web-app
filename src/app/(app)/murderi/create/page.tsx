'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dbCreateGame } from '../actions';
import { Plus, Skull, Trash2, Play, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'murderi_saved_players';

function loadSavedPlayers(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

function savePlayers(players: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch {
    // localStorage may be full or unavailable
  }
}

export default function CreateGame() {
  const [players, setPlayers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = loadSavedPlayers();
    if (saved.length > 0) {
      setPlayers(saved);
    }
  }, []);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (players.includes(name)) {
      toast.error('That name is already taken');
      return;
    }
    setPlayers((prev) => [...prev, name]);
    setPlayerName('');
    inputRef.current?.focus();
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((p) => p !== name));
  };

  const handleCreateGame = async () => {
    if (players.length < 3) {
      toast.error('Need at least 3 players to start');
      return;
    }
    setIsLoading(true);
    try {
      const result = await dbCreateGame(players);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      router.push(`/murderi/game/${result.data.gameId}/share`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-md md:mx-auto">
      <div className="flex-1 flex flex-col space-y-6 pt-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#dc2626]" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Game</h1>
          <p className="text-[#888] text-sm mt-1">Add your players below</p>
        </div>

        {/* Add player form */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-5 space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest">Add players</p>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              className="flex-1 bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] rounded-xl h-11 focus-visible:ring-[#dc2626]"
            />
            <Button
              type="button"
              onClick={handleAddPlayer}
              className="h-11 px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shrink-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Player list */}
        {players.length > 0 && (
          <div className="bg-[#111] rounded-2xl border border-[#222] p-5 space-y-3">
            <p className="text-xs font-bold text-[#888] uppercase tracking-widest">
              Players ({players.length})
            </p>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player}
                  className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3 border border-[#2a2a2a]"
                >
                  <span className="text-white font-medium">{player}</span>
                  <button
                    onClick={() => removePlayer(player)}
                    className="text-[#555] hover:text-[#dc2626] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create button */}
        <div className="pb-6">
          {players.length < 3 && (
            <p className="text-center text-[#555] text-sm mb-3">
              Add {3 - players.length} more player{3 - players.length !== 1 ? 's' : ''} to start
            </p>
          )}
          <Button
            onClick={handleCreateGame}
            disabled={players.length < 3 || isLoading}
            className="w-full h-14 text-base font-bold rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Play className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Creating...' : 'Start Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}
