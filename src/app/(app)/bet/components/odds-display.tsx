'use client';

import { Coins, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps {
  options: Array<{ id: string; label: string; totalPoints: number }>;
  totalPool: number;
  resolvedOptionId?: string | null;
}

export function OddsDisplay({ options, totalPool, resolvedOptionId }: OddsDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">Odds</h3>
        <div className="flex items-center gap-1 text-amber-400">
          <Coins size={14} />
          <span className="text-sm font-bold">{totalPool.toLocaleString()} pool</span>
        </div>
      </div>

      {options.map((option) => {
        const pct = totalPool > 0 ? (option.totalPoints / totalPool) * 100 : 0;
        const odds =
          option.totalPoints > 0 ? (totalPool / option.totalPoints).toFixed(2) : '—';
        const isWinner = resolvedOptionId === option.id;

        return (
          <div
            key={option.id}
            className={cn(
              'rounded-xl border p-3 transition-all',
              isWinner
                ? 'border-green-500/40 bg-green-500/10'
                : 'border-white/10 bg-white/5'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isWinner && <Trophy size={14} className="text-green-400" />}
                <span className={cn('font-medium', isWinner ? 'text-green-400' : 'text-white')}>
                  {option.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-white/40">
                  {option.totalPoints.toLocaleString()} pts
                </span>
                <span className="font-mono text-amber-400">{odds}x</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isWinner ? 'bg-green-500/70' : 'bg-amber-500/60'
                )}
                style={{ width: `${Math.max(pct, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
