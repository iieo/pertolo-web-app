'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skull, Copy, Check, MessageCircle, Mail, ArrowRight } from 'lucide-react';

export default function SharePage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params.gameId;
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const shareText = `Join my Murderi game! Code: ${gameId} — open the app and enter this code.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailtoUrl = `mailto:?subject=Join my Murderi game&body=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-[100dvh] w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-md md:mx-auto">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#dc2626]" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Game Created!</h1>
          <p className="text-[#888] text-sm mt-1">Share the code with all players</p>
        </div>

        {/* Game code display */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-6 text-center space-y-4">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest">Game Code</p>
          <div className="text-6xl font-black text-white tracking-[0.2em]">{gameId}</div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-sm font-semibold text-[#888] hover:text-white transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy code
              </>
            )}
          </button>
        </div>

        {/* Share options */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-5 space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest">Share via</p>
          <div className="flex gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366] font-bold hover:bg-[#25d366]/20 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={mailtoUrl}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#1a1a1a] border border-[#333] text-white font-bold hover:bg-[#222] transition-all"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </div>

        {/* Join button */}
        <Button
          onClick={() => router.push(`/murderi/game/${gameId}`)}
          className="w-full h-14 text-base font-bold rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-white"
        >
          Join the Game
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
