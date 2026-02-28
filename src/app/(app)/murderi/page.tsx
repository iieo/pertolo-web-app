'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, ArrowRight, Loader2 } from 'lucide-react';

export default function MurderiHome() {
  const [gameId, setGameId] = useState('');
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleJoin = () => {
    const code = gameId.trim().toUpperCase();
    if (code.length < 4) return;
    setJoining(true);
    router.push(`/murderi/game/${code}`);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-md md:mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50dvh] bg-gradient-to-b from-[#dc2626]/20 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col justify-between space-y-8 z-10 py-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-[#222] shadow-2xl shadow-red-900/10">
            <Image
              src="/murderi/hero.png"
              alt="Murderi Hero Illustration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Logo Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  Murderi
                </h1>
              </div>
              <p className="text-[#ccc] text-sm font-medium max-w-[240px] leading-relaxed">
                A high-stakes social assassination game. Hunter or Prey?
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-6">
          {/* Join Game */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-black text-[#666] uppercase tracking-[0.2em]">
                Active Mission
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#dc2626] animate-pulse" />
                <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest">
                  Live
                </span>
              </div>
            </div>
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-2xl border border-[#222] p-4 space-y-3">
              <div className="relative">
                <Input
                  placeholder="ENTER ACCESS CODE"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  maxLength={6}
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#333] text-lg font-black tracking-[0.3em] uppercase text-center rounded-xl h-14 focus-visible:ring-[#dc2626] focus-visible:border-[#dc2626]/50 transition-all"
                />
              </div>
              <Button
                onClick={handleJoin}
                disabled={gameId.trim().length < 4 || joining}
                className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:opacity-20 shadow-lg shadow-red-600/10 transition-all flex items-center justify-center gap-2 group"
              >
                {joining ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Assemble Team
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-[#222]" />
            <span className="text-[#444] text-[10px] font-black uppercase tracking-[0.3em]">
              Operational Status
            </span>
            <div className="flex-1 h-[1px] bg-[#222]" />
          </div>

          {/* Create Game */}
          <Button
            onClick={() => {
              setCreating(true);
              router.push('/murderi/create');
            }}
            disabled={creating}
            variant="outline"
            className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl bg-transparent border-[#333] hover:bg-[#111] text-[#888] hover:text-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Users className="w-4 h-4 group-hover:text-[#dc2626] transition-colors" />
                Initialize Agency
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[200%] h-[200px] bg-[#dc2626]/5 blur-[120px] pointer-events-none" />
    </div>
  );
}
