'use client';

import Link from 'next/link';
import { STATUS_LABEL } from './styles';

interface BetCardProps {
  id: string;
  title: string;
  status: 'open' | 'resolved' | 'cancelled';
  ownerName: string;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
  hasWagered: boolean;
}

export function BetCard({
  id,
  title,
  status,
  ownerName,
  totalPool,
  options,
  hasWagered,
}: BetCardProps) {
  const meta = [STATUS_LABEL[status], `von ${ownerName}`, hasWagered && 'Du bist dabei'].filter(
    Boolean,
  );

  return (
    <Link
      href={`/bet/${id}`}
      className="flex h-full flex-col gap-4 rounded-xl border border-white/15 p-6 transition-colors duration-150 outline-none hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
    >
      <p className="text-sm text-white/60">{meta.join(' · ')}</p>
      <h2 className="text-xl font-semibold wrap-break-word hyphens-auto md:text-2xl">{title}</h2>

      <div className="flex flex-col gap-2">
        {options.slice(0, 3).map((option) => {
          const pct = totalPool > 0 ? (option.totalPoints / totalPool) * 100 : 0;
          return (
            <div key={option.id} className="flex items-center gap-4">
              <span className="w-28 shrink-0 truncate text-sm text-white/80 md:w-36">
                {option.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-sm bg-white/10">
                <div
                  className="h-full rounded-sm bg-white/70"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-sm text-white/60 tabular-nums">
                {pct > 0 ? `${Math.round(pct)}%` : '0%'}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-auto text-sm font-medium text-white/80 tabular-nums">
        {totalPool.toLocaleString()} Punkte im Pool
      </p>
    </Link>
  );
}
