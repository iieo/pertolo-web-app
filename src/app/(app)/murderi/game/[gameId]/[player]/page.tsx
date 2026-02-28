import { dbGetVictim } from '../../../actions';
import PlayerGameView from './player-game-view';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ gameId: string; player: string }>;
}) {
  const { gameId, player } = await params;
  const decodedPlayer = decodeURIComponent(player);
  const orders = await dbGetVictim(gameId, decodedPlayer);
  const order = orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-[#888] text-lg">Player not found in this game.</p>
          <Link href="/murderi" className="text-[#dc2626] font-semibold hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (order.victim == null) {
    redirect('/murderi/killed');
  }

  return <PlayerGameView gameId={gameId} player={decodedPlayer} initialVictim={order.victim} />;
}
