import { dbGetPlayers } from '../../actions';
import Link from 'next/link';
import { Skull, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function GamePlayers({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const orders = await dbGetPlayers(gameId);

  if (orders.length === 0) {
    notFound();
  }

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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Who are you?</h1>
          <p className="text-[#888] text-sm mt-1">
            Game code:{' '}
            <span className="font-black text-white tracking-widest">{gameId}</span>
          </p>
        </div>

        {/* Player list */}
        <div className="bg-[#111] rounded-2xl border border-[#222] p-5 space-y-3">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest">
            Select your name
          </p>
          <div className="space-y-2">
            {orders.map((order) => {
              const isEliminated = order.victim === null;

              if (isEliminated) {
                return (
                  <div
                    key={order.killer}
                    className="flex items-center justify-between bg-[#1a1a1a]/50 rounded-xl px-4 py-4 border border-[#2a2a2a] opacity-50"
                  >
                    <span className="text-[#666] font-semibold text-base line-through">
                      {order.killer}
                    </span>
                    <Skull className="w-4 h-4 text-[#dc2626]/50" />
                  </div>
                );
              }

              return (
                <Link
                  key={order.killer}
                  href={`/murderi/game/${gameId}/${encodeURIComponent(order.killer)}`}
                  className="flex items-center justify-between bg-[#1a1a1a] hover:bg-[#222] active:bg-[#2a2a2a] rounded-xl px-4 py-4 border border-[#2a2a2a] hover:border-[#dc2626]/40 transition-all group"
                >
                  <span className="text-white font-semibold text-base">{order.killer}</span>
                  <ChevronRight className="w-5 h-5 text-[#555] group-hover:text-[#dc2626] transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
