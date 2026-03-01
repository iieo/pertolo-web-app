'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetCard } from './components/bet-card';
import { getBets } from './actions';
import { useBet } from './bet-provider';
import { Coins, PlusCircle } from 'lucide-react';
import Link from 'next/link';

type BetSummary = {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'resolved' | 'cancelled';
  ownerName: string;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
  createdAt: Date;
};

export default function BetFeedPage() {
  const { balance } = useBet();
  const [bets, setBets] = useState<Record<string, BetSummary[]>>({
    open: [],
    resolved: [],
    mine: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [open, resolved, mine] = await Promise.all([
        getBets('open'),
        getBets('resolved'),
        getBets('mine'),
      ]);
      setBets({
        open: open.success ? open.data : [],
        resolved: resolved.success ? resolved.data : [],
        mine: mine.success ? mine.data : [],
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">Bets</h1>
        {balance !== null && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1">
            <Coins size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{balance.toLocaleString()}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="open">
        <TabsList className="mb-4 w-full bg-white/5 border border-white/10">
          <TabsTrigger value="open" className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Open
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            Resolved
          </TabsTrigger>
          <TabsTrigger value="mine" className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            My Bets
          </TabsTrigger>
        </TabsList>

        {(['open', 'resolved', 'mine'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : (bets[tab] ?? []).length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-white/40">
                  {tab === 'mine' ? "You haven't created any bets yet" : 'No bets here yet'}
                </p>
                <Link
                  href="/bet/create"
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  <PlusCircle size={16} />
                  Create a Bet
                </Link>
              </div>
            ) : (
              (bets[tab] ?? []).map((bet) => <BetCard key={bet.id} {...bet} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
