'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../actions';
import { UserDrawer } from '../components/user-drawer';
import { Coins, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type LeaderboardEntry = { userId: string; name: string; pointsBalance: number };

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<(LeaderboardEntry & { rank: number }) | null>(
    null,
  );

  useEffect(() => {
    getLeaderboard().then((result) => {
      if (result.success) setEntries(result.data);
      setLoading(false);
    });
  }, []);

  const rankStyles = [
    'border-yellow-500/30 bg-yellow-500/10', // gold
    'border-gray-400/30 bg-gray-400/10', // silver
    'border-orange-700/30 bg-orange-700/10', // bronze
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <div className="mb-6 flex items-center gap-2">
        <Trophy size={24} className="text-amber-400" />
        <h1 className="text-2xl font-extrabold text-white">Leaderboard</h1>
      </div>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))
          : entries.map((entry, index) => {
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

                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-white">{entry.name}</p>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  <Coins size={14} />
                  <span className="text-sm font-bold">
                    {entry.pointsBalance.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

      <UserDrawer open={!!selectedUser} onClose={() => setSelectedUser(null)} user={selectedUser} />
    </div>
  );
}
