'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skull, Users } from 'lucide-react';

export default function MurderiHome() {
  const [gameId, setGameId] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    const code = gameId.trim().toUpperCase();
    if (code.length < 4) return;
    router.push(`/murderi/game/${code}`);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-md md:mx-auto">
      <div className="flex-1 flex flex-col justify-center space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
              <Skull className="w-8 h-8 text-[#dc2626]" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">Murderi</h1>
          <p className="text-[#888] text-base font-medium">
            Get your target before they get you.
          </p>
        </div>

        {/* Join Game */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest px-1">
            Join a game
          </p>
          <div className="bg-[#111] rounded-2xl border border-[#222] p-5 space-y-4">
            <Input
              placeholder="Enter game code"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              maxLength={6}
              className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] text-lg font-bold tracking-widest uppercase text-center rounded-xl h-14 focus-visible:ring-[#dc2626]"
            />
            <Button
              onClick={handleJoin}
              disabled={gameId.trim().length < 4}
              className="w-full h-13 text-base font-bold rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-40"
            >
              Join Game
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#222]" />
          <span className="text-[#555] text-sm font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-[#222]" />
        </div>

        {/* Create Game */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest px-1">
            Start a new game
          </p>
          <div className="bg-[#111] rounded-2xl border border-[#222] p-5">
            <Button
              onClick={() => router.push('/murderi/create')}
              className="w-full h-13 text-base font-bold rounded-xl bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333]"
            >
              <Users className="w-5 h-5 mr-2" />
              Create Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
