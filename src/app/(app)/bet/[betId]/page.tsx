'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getBetDetail } from '../actions';
import { useSession } from '@/lib/auth-client';
import { OddsDisplay } from '../components/odds-display';
import { WagerForm } from '../components/wager-form';
import { ResolveForm } from '../components/resolve-form';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins } from 'lucide-react';
import Link from 'next/link';

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
  userWagers: Array<{ optionId: string; amount: number }>;
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
      <div className="mx-auto max-w-lg px-4 pt-6">
        <p className="text-center text-red-400">{error}</p>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
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

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
      {/* Back link */}
      <Link href="/bet" className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors">
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className={statusColor}>
            {bet.status}
          </Badge>
          <span className="text-xs text-white/40">by {bet.ownerName}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{bet.title}</h1>
        {bet.description && <p className="mt-1 text-sm text-white/50">{bet.description}</p>}
      </div>

      {/* Odds */}
      <OddsDisplay
        options={bet.options}
        totalPool={bet.totalPool}
        resolvedOptionId={bet.resolvedOptionId}
      />

      {/* User wager summary */}
      {userTotalWagered > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <Coins size={16} className="text-amber-400" />
          <span className="text-sm text-white/70">
            You wagered <span className="font-bold text-amber-400">{userTotalWagered.toLocaleString()}</span> points
          </span>
        </div>
      )}

      {/* Wager form (only if open) */}
      {bet.status === 'open' && (
        <WagerForm betId={bet.id} options={bet.options} onWagerPlaced={loadBet} />
      )}

      {/* Resolve form (only if owner and open) */}
      {isOwner && bet.status === 'open' && (
        <ResolveForm betId={bet.id} options={bet.options} onResolved={loadBet} />
      )}
    </div>
  );
}
