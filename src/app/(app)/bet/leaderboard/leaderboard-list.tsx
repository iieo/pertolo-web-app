'use client';

import { useState } from 'react';
import { UserDrawer } from '../components/user-drawer';
import { cn } from '@/lib/utils';

type LeaderboardEntry = { userId: string; name: string; pointsBalance: number };

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  const [selectedUser, setSelectedUser] = useState<(LeaderboardEntry & { rank: number }) | null>(
    null,
  );

  return (
    <>
      <ol className="flex flex-col divide-y divide-white/10 border-y border-white/10">
        {entries.map((entry, index) => {
          const rank = index + 1;
          const top = rank <= 3;
          return (
            <li key={entry.userId}>
              <button
                type="button"
                onClick={() => setSelectedUser({ ...entry, rank })}
                className="flex min-h-16 w-full items-center gap-4 rounded-xl px-2 py-4 text-left transition-colors duration-150 outline-none hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:gap-6 sm:px-4"
              >
                <span
                  className={cn(
                    'w-8 shrink-0 text-right tabular-nums',
                    top ? 'text-xl font-bold text-white' : 'text-base font-medium text-white/60',
                  )}
                >
                  {rank}
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate',
                    top ? 'text-lg font-semibold md:text-xl' : 'text-base font-medium md:text-lg',
                  )}
                >
                  {entry.name}
                </span>
                <span className="shrink-0 text-base font-semibold tabular-nums md:text-lg">
                  {entry.pointsBalance.toLocaleString()}
                  <span className="ml-1 font-normal text-white/60">Punkte</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <UserDrawer open={!!selectedUser} onClose={() => setSelectedUser(null)} user={selectedUser} />
    </>
  );
}
