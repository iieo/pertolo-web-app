import { getLeaderboard } from './actions';
import { LeaderboardList } from './leaderboard-list';
import { pageClass, pageTitleClass } from '../components/styles';

export default async function LeaderboardPage() {
  const result = await getLeaderboard();
  const entries = result.success ? result.data : [];

  return (
    <div className={`${pageClass} max-w-3xl`}>
      <h1 className={pageTitleClass}>Bestenliste</h1>
      <div className="mt-12">
        <LeaderboardList entries={entries} />
      </div>
    </div>
  );
}
