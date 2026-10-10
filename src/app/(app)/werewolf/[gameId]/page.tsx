import { RoomClient } from '../components/room-client';

export const dynamic = 'force-dynamic';

export default async function WerewolfRoomPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  return <RoomClient gameId={gameId.trim().toUpperCase()} />;
}
