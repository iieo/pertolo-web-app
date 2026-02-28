import { dbGetPlayers } from '../../actions';
import { notFound } from 'next/navigation';
import PlayerSelect from './player-select';

export default async function GamePlayers({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const orders = await dbGetPlayers(gameId);

  if (orders.length === 0) {
    notFound();
  }

  const initialPlayers = orders.map((o) => ({
    name: o.killer,
    isAlive: o.victim !== null,
  }));

  return <PlayerSelect gameId={gameId} initialPlayers={initialPlayers} />;
}
