'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbGetGameOverview } from '../../actions';
import { Skull, ChevronRight, Target, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlayerSelectProps {
  gameId: string;
  initialPlayers: { name: string; isAlive: boolean }[];
}

function getSavedPlayer(gameId: string): string | null {
  try {
    return localStorage.getItem(`murderi_game_${gameId}`);
  } catch {
    return null;
  }
}

function savePlayer(gameId: string, player: string) {
  try {
    localStorage.setItem(`murderi_game_${gameId}`, player);
  } catch {
    // localStorage may be unavailable
  }
}

export default function PlayerSelect({ gameId, initialPlayers }: PlayerSelectProps) {
  const router = useRouter();
  const [players, setPlayers] = useState(initialPlayers);
  const [savedPlayer, setSavedPlayer] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState<string | null>(null);
  const [viewingKillOrder, setViewingKillOrder] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const saved = getSavedPlayer(gameId);
    if (saved && initialPlayers.some((p) => p.name === saved)) {
      setSavedPlayer(saved);
    }
    setReady(true);
  }, [gameId, initialPlayers]);

  // Poll for player status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await dbGetGameOverview(gameId);
      if (result.success) {
        setPlayers(result.data.players);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  if (!ready) return null;

  const handleSelect = (player: string) => {
    if (loadingPlayer) return;
    setLoadingPlayer(player);
    savePlayer(gameId, player);
    router.push(`/murderi/game/${gameId}/${encodeURIComponent(player)}`);
  };

  const hasClaimed = savedPlayer !== null;
  const myStatus = hasClaimed ? players.find((p) => p.name === savedPlayer) : null;
  const alive = players.filter((p) => p.isAlive).length;

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col px-5 py-6 sm:p-6 md:max-w-md md:mx-auto pb-[env(safe-area-inset-bottom,24px)]">
      <div className="flex-1 flex flex-col space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#dc2626]" />
            </div>
          </div>
          {hasClaimed ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Game Overview
              </h1>
              <p className="text-[#888] text-sm mt-1">
                {alive} of {players.length} players remaining
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Who are you?
              </h1>
              <p className="text-[#888] text-sm mt-1">
                Game code:{' '}
                <span className="font-black text-white tracking-widest">{gameId}</span>
              </p>
            </>
          )}
        </div>

        {/* View target button if claimed and alive */}
        {hasClaimed && myStatus?.isAlive && (
          <Button
            onClick={() => {
              setViewingKillOrder(true);
              router.push(`/murderi/game/${gameId}/${encodeURIComponent(savedPlayer)}`);
            }}
            disabled={viewingKillOrder}
            className="w-full h-14 text-base font-bold rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-white active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {viewingKillOrder ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Target className="w-5 h-5 mr-2" />
            )}
            View your kill order
          </Button>
        )}

        {/* Eliminated banner */}
        {hasClaimed && myStatus && !myStatus.isAlive && (
          <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-2xl p-4 text-center">
            <p className="text-[#dc2626] font-bold">You&apos;ve been eliminated</p>
            <p className="text-[#888] text-sm mt-1">Watch the game unfold below</p>
          </div>
        )}

        {/* Player list */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-4 sm:p-5 space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest">
            {hasClaimed ? 'Players' : 'Select your name'}
          </p>
          <div className="space-y-2">
            {players.map((p) => {
              // Already claimed a player — show read-only overview
              if (hasClaimed) {
                return (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 border ${p.isAlive
                      ? 'bg-[#1a1a1a] border-[#2a2a2a]'
                      : 'bg-[#1a1a1a]/50 border-[#2a2a2a] opacity-50'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.isAlive ? 'bg-green-500' : 'bg-[#dc2626]'}`}
                      />
                      <span
                        className={`font-medium text-[15px] truncate ${p.isAlive ? 'text-white' : 'text-[#666] line-through'
                          }`}
                      >
                        {p.name}
                        {p.name === savedPlayer && (
                          <span className="text-[#555] text-xs ml-2">(you)</span>
                        )}
                      </span>
                    </div>
                    {p.isAlive ? (
                      <User className="w-4 h-4 text-green-500/60 shrink-0 ml-2" />
                    ) : (
                      <Skull className="w-4 h-4 text-[#dc2626]/50 shrink-0 ml-2" />
                    )}
                  </div>
                );
              }

              // Not claimed yet — allow selection (only alive players)
              if (!p.isAlive) {
                return (
                  <div
                    key={p.name}
                    className="flex items-center justify-between bg-[#1a1a1a]/50 rounded-xl px-4 py-4 border border-[#2a2a2a] opacity-50"
                  >
                    <span className="text-[#666] font-semibold text-[15px] line-through truncate">
                      {p.name}
                    </span>
                    <Skull className="w-4 h-4 text-[#dc2626]/50 shrink-0 ml-2" />
                  </div>
                );
              }

              const isLoading = loadingPlayer === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => handleSelect(p.name)}
                  disabled={loadingPlayer !== null}
                  className="w-full flex items-center justify-between bg-[#1a1a1a] hover:bg-[#222] active:bg-[#2a2a2a] rounded-xl px-4 py-4 border border-[#2a2a2a] hover:border-[#dc2626]/40 transition-all group active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-white font-semibold text-[15px] truncate mr-2">
                    {p.name}
                  </span>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-[#dc2626] animate-spin shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#555] group-hover:text-[#dc2626] transition-colors shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {hasClaimed && (
          <div className="mt-auto pt-2 pb-2">
            <Link
              href="/murderi"
              className="flex items-center justify-center w-full h-12 bg-[#111] border border-[#222] rounded-2xl text-white font-semibold hover:bg-[#1a1a1a] active:scale-[0.98] transition-all"
            >
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
