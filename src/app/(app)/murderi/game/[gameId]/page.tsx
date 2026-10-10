import { redirect } from 'next/navigation';

import { NotFoundView } from '../../components/shell';
import { buildOverview, getClaimToken, getGameRows } from '../../data';
import { gamePath, isValidCode, normalizeCode } from '../../limits';
import GameOverview from './overview';

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId: raw } = await params;
  const gameId = normalizeCode(raw);
  if (!isValidCode(gameId)) return <NotFoundView />;
  if (gameId !== raw) redirect(gamePath(gameId));

  const rows = await getGameRows(gameId);
  if (rows.length === 0) return <NotFoundView />;

  const token = await getClaimToken(gameId);
  return <GameOverview initial={buildOverview(gameId, rows, token)} />;
}
