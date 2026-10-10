import { redirect } from 'next/navigation';

import { NotFoundView } from '../../../components/shell';
import { getGameRows } from '../../../data';
import { gamePath, isValidCode, normalizeCode } from '../../../limits';
import ShareContent from './share-content';

export default async function SharePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId: raw } = await params;
  const gameId = normalizeCode(raw);
  if (!isValidCode(gameId)) return <NotFoundView />;
  if (gameId !== raw) redirect(`${gamePath(gameId)}/share`);

  const rows = await getGameRows(gameId);
  if (rows.length === 0) return <NotFoundView />;

  return <ShareContent gameId={gameId} />;
}
