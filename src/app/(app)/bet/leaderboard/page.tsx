import { Trophy } from 'lucide-react';
import { getLeaderboard } from './actions';
import { LeaderboardList } from './leaderboard-list';

export default async function LeaderboardPage() {
  const result = await getLeaderboard();
  const entries = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <div className="mb-6 flex items-center gap-2">
        <Trophy size={24} className="text-amber-400" />
        <h1 className="text-2xl font-extrabold text-white">Bestenliste</h1>
      </div>

      <LeaderboardList entries={entries} />
    </div>
  );
}
