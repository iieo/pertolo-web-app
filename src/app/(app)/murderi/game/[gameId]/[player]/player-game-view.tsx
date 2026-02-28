'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbGetOrderState } from '../../../actions';
import KillButton from './kill-button';
import Link from 'next/link';
import { Skull, Trophy, Target, ArrowLeft } from 'lucide-react';

interface PlayerGameViewProps {
  gameId: string;
  player: string;
  initialVictim: string | null;
}

export default function PlayerGameView({ gameId, player, initialVictim }: PlayerGameViewProps) {
  const [victim, setVictim] = useState<string | null>(initialVictim);
  const [isWinner, setIsWinner] = useState(initialVictim === player);
  const router = useRouter();

  // Verify localStorage lock
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`murderi_game_${gameId}`);
      if (saved && saved !== player) {
        router.replace(`/murderi/game/${gameId}/${encodeURIComponent(saved)}`);
      }
    } catch {
      // localStorage unavailable
    }
  }, [gameId, player, router]);

  // Poll for updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await dbGetOrderState(gameId, player);
      if (!result.success) return;

      if (result.data.victim === null) {
        router.replace(`/murderi/game/${gameId}`);
        return;
      }

      setVictim(result.data.victim);
      setIsWinner(result.data.isWinner);
    }, 5000);

    return () => clearInterval(interval);
  }, [gameId, player, router]);

  const handleKilled = () => {
    router.replace(`/murderi/game/${gameId}`);
  };

  // Winner state
  if (isWinner) {
    return (
      <div className="min-h-dvh bg-black flex flex-col items-center justify-center px-5 py-6 sm:p-6 md:max-w-md md:mx-auto pb-[env(safe-area-inset-bottom,24px)]">
        <div className="w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              You Won!
            </h1>
            <p className="text-[#888] mt-2 text-sm sm:text-base">
              You are the last assassin standing.
            </p>
          </div>
          <Link
            href={`/murderi/game/${gameId}`}
            className="flex items-center justify-center w-full h-12 bg-[#111] border border-[#222] rounded-2xl text-white font-semibold hover:bg-[#1a1a1a] active:scale-[0.98] transition-all"
          >
            View game overview
          </Link>
        </div>
      </div>
    );
  }

  // Alive state — show target
  return (
    <div className="min-h-dvh w-full bg-black flex flex-col px-5 py-6 sm:p-6 md:max-w-md md:mx-auto pb-[env(safe-area-inset-bottom,24px)]">
      <div className="flex-1 flex flex-col">
        {/* Back button */}
        <Link
          href={`/murderi/game/${gameId}`}
          className="flex items-center gap-2 text-[#888] hover:text-white active:text-white transition-colors w-fit py-2 -ml-1 pl-1 pr-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Game overview</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
                <Skull className="w-6 h-6 text-[#dc2626]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kill Order
            </h1>
            <p className="text-[#888] text-sm mt-1">You are {player}</p>
          </div>

          <div className="bg-[#111] rounded-2xl border border-[#dc2626]/20 p-5 sm:p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#888] uppercase tracking-widest">
              <Target className="w-4 h-4 text-[#dc2626]" />
              Your target
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight wrap-break-word">
              {victim}
            </p>
            <p className="text-[#666] text-sm">
              Give them anything. When they receive it, they are eliminated.
            </p>
          </div>

          {/* Kill button */}
          <div className="pt-2 space-y-3">
            <p className="text-center text-xs text-[#555] uppercase tracking-widest font-bold">
              Were you the one who got caught?
            </p>
            <KillButton gameId={gameId} player={player} onKilled={handleKilled} />
          </div>
        </div>
      </div>
    </div>
  );
}
