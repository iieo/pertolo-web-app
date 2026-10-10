'use client';

import { cn } from '@/lib/utils';
import { sectionTitleClass } from './styles';

interface OddsDisplayProps {
  options: Array<{ id: string; label: string; totalPoints: number }>;
  totalPool: number;
  resolvedOptionId?: string | null;
}

export function OddsDisplay({ options, totalPool, resolvedOptionId }: OddsDisplayProps) {
  return (
    <section aria-labelledby="odds-heading" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="odds-heading" className={sectionTitleClass}>
          Quoten
        </h2>
        <p className="text-base text-white/60 tabular-nums">
          {totalPool.toLocaleString()} Punkte im Pool
        </p>
      </div>

      <ul className="flex flex-col gap-6">
        {options.map((option) => {
          const pct = totalPool > 0 ? (option.totalPoints / totalPool) * 100 : 0;
          const odds =
            option.totalPoints > 0 ? `${(totalPool / option.totalPoints).toFixed(2)}x` : '–';
          const isWinner = resolvedOptionId === option.id;

          return (
            <li key={option.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 text-lg font-semibold wrap-break-word">
                  {option.label}
                  {isWinner && (
                    <span className="ml-2 text-base font-semibold text-[#52B788]">Gewinner</span>
                  )}
                </span>
                <span className="shrink-0 text-lg font-semibold tabular-nums">{odds}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-sm bg-white/10">
                <div
                  className={cn(
                    'h-full rounded-sm transition-[width] duration-500 motion-reduce:transition-none',
                    isWinner ? 'bg-[#52B788]' : 'bg-white/70',
                  )}
                  style={{ width: `${Math.max(pct, 1)}%` }}
                />
              </div>
              <p className="text-sm text-white/60 tabular-nums">
                {option.totalPoints.toLocaleString()} Punkte · {Math.round(pct)}%
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
