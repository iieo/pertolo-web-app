'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Coins, ChevronRight } from 'lucide-react';

interface BetCardProps {
  id: string;
  title: string;
  status: 'open' | 'resolved' | 'cancelled';
  ownerName: string;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
  hasWagered: boolean;
}

export function BetCard({ id, title, status, ownerName, totalPool, options, hasWagered }: BetCardProps) {
  const statusColor = {
    open: 'bg-green-500/20 text-green-400 border-green-500/30',
    resolved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[status];

  const statusLabel = {
    open: 'Offen',
    resolved: 'Beendet',
    cancelled: 'Storniert',
  }[status];

  return (
    <Link
      href={`/bet/${id}`}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusColor}>
              {statusLabel}
            </Badge>
            {hasWagered && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                Wette platziert
              </Badge>
            )}
            <span className="truncate text-xs text-white/40">von {ownerName}</span>
          </div>
          <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>

          {/* Mini odds bars */}
          <div className="space-y-1.5">
            {options.slice(0, 3).map((option) => {
              const pct = totalPool > 0 ? (option.totalPoints / totalPool) * 100 : 0;
              return (
                <div key={option.id} className="flex items-center gap-2">
                  <span className="w-24 md:w-32 truncate text-xs text-white/50">{option.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-500/60 transition-all"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-white/40">
                    {pct > 0 ? `${Math.round(pct)}%` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-amber-400">
            <Coins size={14} />
            <span className="text-sm font-semibold">{totalPool.toLocaleString()}</span>
          </div>
          <ChevronRight
            size={18}
            className="text-white/20 transition-all group-hover:text-amber-400 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
