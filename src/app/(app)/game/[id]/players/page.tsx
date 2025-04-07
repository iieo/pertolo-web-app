import { getGameData } from '../actions';
import AddPlayerForm from './add-player-form';

export default async function PlayersScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await getGameData(gameCode);

    if (!gameData) {
        return <div>Game not found</div>;
    }

    const players = gameData.players;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-xl mb-4">Players in Game:</p>
            <ul className="list-disc pl-6">
                {players.map((player) => (
                    <li key={player.id} className="mb-2">
                        <strong>{player.name}</strong>:
                    </li>
                ))}
            </ul>
            <p className="text-xl mb-4">Game Code: {gameData.gameCode}</p>

            <AddPlayerForm gameId={gameData.id} />
        </div>
    );
}
