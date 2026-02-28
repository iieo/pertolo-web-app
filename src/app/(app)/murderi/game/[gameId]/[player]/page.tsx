import { dbGetVictim } from '../../../actions';
import KillButton from './kill-button';
import Link from 'next/link';
import { Skull, Trophy, Target } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ gameId: string; player: string }>;
}) {
  const { gameId, player } = await params;
  const decodedPlayer = decodeURIComponent(player);
  const orders = await dbGetVictim(gameId, decodedPlayer);
  const order = orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-[#888] text-lg">Player not found in this game.</p>
          <Link href="/murderi" className="text-[#dc2626] font-semibold hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Winner: the last player alive targets themselves
  if (order.killer === order.victim) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:max-w-md md:mx-auto">
        <div className="w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">You Won!</h1>
            <p className="text-[#888] mt-2">You are the last assassin standing.</p>
          </div>
          <Link
            href="/murderi"
            className="inline-block mt-4 px-6 py-3 bg-[#111] border border-[#222] rounded-2xl text-white font-semibold hover:bg-[#1a1a1a] transition-all"
          >
            Play again
          </Link>
        </div>
      </div>
    );
  }

  // Eliminated: victim is null
  if (order.victim == null) {
    redirect('/murderi/killed');
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col p-4 sm:p-6 md:max-w-md md:mx-auto">
      <div className="flex-1 flex flex-col justify-center space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30 flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#dc2626]" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kill Order</h1>
          <p className="text-[#888] text-sm mt-1">You are {decodedPlayer}</p>
        </div>

        {/* Target reveal */}
        <div className="bg-[#111] rounded-2xl border border-[#dc2626]/20 p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#888] uppercase tracking-widest">
            <Target className="w-4 h-4 text-[#dc2626]" />
            Your target
          </div>
          <p className="text-4xl font-black text-white tracking-tight">{order.victim}</p>
          <p className="text-[#666] text-sm">
            Give them anything. When they receive it, they are eliminated.
          </p>
        </div>

        {/* Killed button */}
        <div className="pt-2 space-y-3">
          <p className="text-center text-xs text-[#555] uppercase tracking-widest font-bold">
            Were you the one who got caught?
          </p>
          <KillButton gameId={gameId} player={decodedPlayer} />
        </div>
      </div>
    </div>
  );
}
