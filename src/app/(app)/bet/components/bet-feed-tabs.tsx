'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BetCard } from './bet-card';
import { useBet } from '../bet-provider';
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

interface BetFeedTabsProps {
  openBets: BetSummary[];
  resolvedBets: BetSummary[];
  mineBets: BetSummary[];
}

const EMPTY_LABELS = {
  open: 'Hier gibt es noch keine Wetten',
  resolved: 'Hier gibt es noch keine Wetten',
  mine: 'Du hast noch keine Wetten erstellt',
};

export function BetFeedTabs({ openBets, resolvedBets, mineBets }: BetFeedTabsProps) {
  const { balance } = useBet();

  const tabs = [
    { value: 'open', label: 'Offen', bets: openBets },
    { value: 'resolved', label: 'Beendet', bets: resolvedBets },
    { value: 'mine', label: 'Meine Wetten', bets: mineBets },
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-white">Wetten</h1>
        {balance !== null && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1">
            <Coins size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{balance.toLocaleString()}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="open">
        <TabsList className="mb-4 w-full border border-white/10 bg-white/5">
          {tabs.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ value, bets }) => (
          <TabsContent key={value} value={value} className="space-y-3">
            {bets.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-white/40">{EMPTY_LABELS[value]}</p>
                <Link
                  href="/bet/create"
                  className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-amber-400"
                >
                  <PlusCircle size={16} />
                  Wette erstellen
                </Link>
              </div>
            ) : (
              bets.map((bet) => <BetCard key={bet.id} {...bet} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
