import { redirect } from 'next/navigation';

import { getClaimToken, getPlayerByToken } from '../../../data';
import { gamePath, isValidCode, normalizeCode } from '../../../limits';
import PlayerGameView from './player-game-view';

// The [player] segment is only cosmetic. Who you are comes from the claim cookie.
export default async function PlayerPage({
  params,
}: {
  params: Promise<{ gameId: string; player: string }>;
}) {
  const { gameId: raw } = await params;
  const gameId = normalizeCode(raw);
  if (!isValidCode(gameId)) redirect('/murderi');

  const token = await getClaimToken(gameId);
  const me = token ? await getPlayerByToken(gameId, token) : null;
  if (!me || me.victim === null) redirect(gamePath(gameId));

  return <PlayerGameView gameId={gameId} name={me.killer} initialTarget={me.victim} />;
}
