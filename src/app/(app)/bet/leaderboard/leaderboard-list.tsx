'use client';

import { useState } from 'react';
import { UserDrawer } from '../components/user-drawer';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

type LeaderboardEntry = { userId: string; name: string; pointsBalance: number };

const rankStyles = [
  'border-yellow-500/30 bg-yellow-500/10',
  'border-gray-400/30 bg-gray-400/10',
  'border-orange-700/30 bg-orange-700/10',
];

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  const [selectedUser, setSelectedUser] = useState<(LeaderboardEntry & { rank: number }) | null>(
    null,
  );

  return (
    <>
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const rank = index + 1;
          return (
            <button
              key={entry.userId}
              onClick={() => setSelectedUser({ ...entry, rank })}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all hover:bg-white/10',
                index < 3 ? rankStyles[index] : 'border-white/10 bg-white/5',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                  index === 0
                    ? 'bg-yellow-500 text-black'
                    : index === 1
                      ? 'bg-gray-400 text-black'
                      : index === 2
                        ? 'bg-orange-700 text-white'
                        : 'bg-white/10 text-white/50',
                )}
              >
                {rank}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{entry.name}</p>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                <Coins size={14} />
                <span className="text-sm font-bold">{entry.pointsBalance.toLocaleString()}</span>
              </div>
            </button>
          );
        })}
      </div>

      <UserDrawer
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </>
  );
}
