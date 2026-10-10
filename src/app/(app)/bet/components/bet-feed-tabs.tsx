'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BetCard } from './bet-card';
import { useBet } from '../bet-provider';
import { pageClass, pageTitleClass, secondaryButtonClass } from './styles';

type BetSummary = {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'resolved' | 'cancelled';
  ownerName: string;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
  createdAt: Date;
  hasWagered: boolean;
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
    <div className={pageClass}>
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h1 className={pageTitleClass}>Wetten</h1>
        {balance !== null && (
          <p className="flex flex-col items-start sm:items-end">
            <span className="text-sm text-white/60">Kontostand</span>
            <span className="text-2xl font-bold tabular-nums md:text-3xl">
              {balance.toLocaleString()} Punkte
            </span>
          </p>
        )}
      </header>

      <Tabs defaultValue="open" className="mt-12">
        <TabsList className="flex h-auto w-full justify-start gap-6 rounded-none border-b border-white/15 bg-transparent p-0 text-white/60">
          {tabs.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="-mb-px min-h-12 rounded-none border-b-2 border-transparent px-0 text-base font-medium text-white/60 transition-colors duration-150 hover:text-white focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(({ value, bets }) => (
          <TabsContent
            key={value}
            value={value}
            className="mt-8 focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {bets.length === 0 ? (
              <div className="flex flex-col items-start gap-6 py-16">
                <p className="text-lg text-white/60">{EMPTY_LABELS[value]}</p>
                <Link href="/bet/create" className={cn(secondaryButtonClass, 'sm:w-auto')}>
                  Wette erstellen
                </Link>
              </div>
            ) : (
              <ul className="grid gap-4 lg:grid-cols-2">
                {bets.map((bet) => (
                  <li key={bet.id}>
                    <BetCard {...bet} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
