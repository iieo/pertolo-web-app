import { db } from '@/db';
import { werewolfGamesTable, werewolfPlayersTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import GameRoom from '../components/game-room';

export default async function WerewolfGamePage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('werewolf_session_id')?.value;

    if (!sessionId) {
        redirect('/werewolf');
    }

    const game = await db.query.werewolfGamesTable.findFirst({
        where: eq(werewolfGamesTable.id, gameId),
    });

    if (!game) {
        notFound();
    }

    const players = await db.query.werewolfPlayersTable.findMany({
        where: eq(werewolfPlayersTable.gameId, gameId),
    });

    const me = players.find((p) => p.sessionId === sessionId);

    if (!me) {
        redirect('/werewolf');
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
            <GameRoom initialGame={game} initialPlayers={players} me={me} />
        </div>
    );
}
