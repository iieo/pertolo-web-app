import { dbGetGameByCode } from '@/app/(app)/actions';
import AddPlayerForm from './add-player-form';

export default async function PlayersScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await dbGetGameByCode(gameCode);
    if (gameData.success === false) {
        return <div>Game not found</div>;
    }

    const players = gameData.data.gameSettings.players;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-xl mb-4">Game Code: {gameData.data.gameCode}</p>

            <AddPlayerForm gameId={gameData.data.id} gameSettings={gameData.data.gameSettings} />
        </div>
    );
}
