import { dbGetPlayers } from '../../../actions';
import { notFound } from 'next/navigation';
import ShareContent from './share-content';

export default async function SharePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const orders = await dbGetPlayers(gameId);

  if (orders.length === 0) {
    notFound();
  }

  return <ShareContent gameId={gameId} />;
}
