'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getBetDetail } from '../actions';
import { useSession } from '@/lib/auth-client';
import { OddsDisplay } from '../components/odds-display';
import { WagerForm } from '../components/wager-form';
import { ResolveForm } from '../components/resolve-form';
import { BetChart } from '../components/bet-chart';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins, TrendingDown } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { sellWager } from '../actions';
import { useBet } from '../bet-provider';
import toast from 'react-hot-toast';

function SellButton({ wagerId, cashout, onSold }: { wagerId: string; cashout: number; onSold: () => void }) {
  const [loading, setLoading] = useState(false);
  const { refreshBalance } = useBet();

  const handleSell = async () => {
    setLoading(true);
    try {
      const res = await sellWager(wagerId);
      if (res.success) {
        toast.success(`Für ${res.data.cashout} Punkte verkauft!`);
        await refreshBalance();
        onSold();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error('Verkauf der Wette fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading || cashout <= 0}
      onClick={handleSell}
      className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
    >
      <TrendingDown size={14} className="mr-1.5" />
      {loading ? '...' : 'Verkaufen'}
    </Button>
  );
}

type BetDetail = {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'resolved' | 'cancelled';
  visibility: 'public' | 'private';
  ownerName: string;
  ownerId: string;
  resolvedOptionId: string | null;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
  userWagers: Array<{ id: string; optionId: string; amount: number }>;
  createdAt: Date;
};

export default function BetDetailPage() {
  const params = useParams<{ betId: string }>();
  const { data: session } = useSession();
  const [bet, setBet] = useState<BetDetail | null>(null);
  const [error, setError] = useState('');

  const loadBet = useCallback(async () => {
    const result = await getBetDetail(params.betId);
    if (result.success) {
      setBet(result.data);
    } else {
      setError(result.error);
    }
  }, [params.betId]);

  useEffect(() => {
    loadBet();
  }, [loadBet]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <p className="text-center text-red-400">{error}</p>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  const isOwner = session?.user?.id === bet.ownerId;
  const userTotalWagered = bet.userWagers.reduce((sum, w) => sum + w.amount, 0);

  const statusColor = {
    open: 'bg-green-500/20 text-green-400 border-green-500/30',
    resolved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[bet.status];

  const statusLabel = {
    open: 'Offen',
    resolved: 'Beendet',
    cancelled: 'Storniert',
  }[bet.status];

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pt-6">
      {/* Back link */}
      <Link
        href="/bet"
        className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={16} />
        Zurück zum Feed
      </Link>

      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className={statusColor}>
            {statusLabel}
          </Badge>
          <span className="text-xs text-white/40">von {bet.ownerName}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{bet.title}</h1>
        {bet.description && <p className="mt-1 text-sm text-white/50">{bet.description}</p>}
      </div>

      {/* Chart */}
      <BetChart betId={bet.id} />

      {/* Odds */}
      <OddsDisplay
        options={bet.options}
        totalPool={bet.totalPool}
        resolvedOptionId={bet.resolvedOptionId}
      />

      {/* User wagers list */}
      {bet.userWagers.length > 0 && bet.status === 'open' && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white/70">Deine aktiven Wetten</h3>
          <div className="grid gap-2">
            {bet.userWagers.map((wager) => {
              const opt = bet.options.find((o) => o.id === wager.optionId);
              if (!opt) return null;

              const currentVal = Math.floor((wager.amount / opt.totalPoints) * bet.totalPool);

              return (
                <div key={wager.id} className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start sm:justify-center">
                    <span className="text-sm font-bold text-white max-w-[60%] truncate sm:max-w-full">{opt.label}</span>
                    <span className="text-xs text-white/50">Eingesetzt: {wager.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/10 bg-amber-500/10 p-2.5 sm:border-none sm:bg-transparent sm:p-0">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[11px] uppercase tracking-wider text-white/50 sm:text-xs sm:normal-case sm:tracking-normal">Aktueller Wert</span>
                      <div className="flex items-center gap-1 font-bold text-amber-400">
                        <Coins size={14} />
                        <span>{currentVal.toLocaleString()}</span>
                      </div>
                    </div>
                    <SellButton wagerId={wager.id} cashout={currentVal} onSold={loadBet} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {bet.userWagers.length > 0 && bet.status !== 'open' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <Coins size={16} className="text-amber-400" />
          <span className="text-sm text-white/70">
            Du hast{' '}
            <span className="font-bold text-amber-400">{userTotalWagered.toLocaleString()}</span>{' '}
            Punkte gesetzt
          </span>
        </div>
      )}

      {/* Wager form (only if open) */}
      {bet.status === 'open' && (
        <WagerForm betId={bet.id} totalPool={bet.totalPool} options={bet.options} onWagerPlaced={loadBet} />
      )}

      {/* Resolve form (only if owner and open) */}
      {isOwner && bet.status === 'open' && (
        <ResolveForm betId={bet.id} options={bet.options} onResolved={loadBet} />
      )}
    </div>
  );
}
