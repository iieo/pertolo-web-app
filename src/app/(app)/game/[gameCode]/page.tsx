import { getGameData, getGameModes, selectGameMode, startGame } from '@/db/functions/game';
import { GameMode, Player } from '@/db/schema';

import { notFound } from 'next/navigation';

interface GamePageProps {
    params: {
        gameCode: string;
    };
}

// Simple components for demonstration, move to components/ later
function PlayerList({ players }: { players: Player[] }) {
    return (
        <div className="mt-6 bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Players:</h3>
            <ul className="list-disc list-inside">
                {players.map((player) => (
                    <li key={player.id}>{player.name} {player.isHost ? '(Host)' : ''}</li>
                ))}
            </ul>
        </div>
    );
}

function GameModeSelector({ gameId, gameModes }: { gameId: string, gameModes: GameMode[] }) {
    const selectModeAction = async (formData: FormData) => {
        'use server';
        const modeId = formData.get('modeId') as string;
        if (gameId && modeId) {
            await selectGameMode(gameId, modeId);
            // Revalidation might be needed or rely on redirect/refresh
        }
    }

    return (
        <form action={selectModeAction} className="mt-4 flex items-center gap-2">
            <label htmlFor="modeId" className="block text-sm font-medium">Select Mode:</label>
            <select
                id="modeId"
                name="modeId"
                required
                className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                <option value="" disabled>Choose a mode</option>
                {gameModes.map(mode => (
                    <option key={mode.id} value={mode.id}>{mode.name}</option>
                ))}
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                Set Mode & Start
            </button>
        </form>
    );
}

function StartGameButton({ gameId }: { gameId: string }) {
    const startGameAction = async () => {
        'use server';
        if (gameId) {
            await startGame(gameId);
            // Revalidation or refresh needed
        }
    }
    return (
        <form action={startGameAction} className="mt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 text-lg">
                Start Game Now!
            </button>
        </form>
    )
}

export default async function GamePage({ params }: GamePageProps) {
    const gameCode = params.gameCode.toUpperCase();
    const gameData = await getGameData(gameCode);
    const availableGameModes = await getGameModes();

    if (!gameData) {
        notFound();
    }

    const isHost = gameData.players.some(p => p.isHost); // Simplified check, needs user session check in real app

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">Pertolo Game</h1>
            <p className="text-xl mb-4">Game Code: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{gameData.gameCode}</span></p>
            <p className="mb-4">Status: <span className={`font-semibold ${gameData.status === 'lobby' ? 'text-yellow-400' : 'text-green-400'}`}>{gameData.status}</span></p>

            {gameData.status === 'lobby' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Lobby</h2>
                    <p>Waiting for players... Share the game code!</p>
                    {isHost && availableGameModes.length > 0 && (
                        <GameModeSelector gameId={gameData.id} gameModes={availableGameModes} />
                    )}
                    {/* Fallback start button if no modes defined or simple start */}
                    {isHost && availableGameModes.length === 0 && (
                        <StartGameButton gameId={gameData.id} />
                    )}
                </div>
            )}

            {gameData.status === 'active' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Game Active!</h2>
                    {/* TODO: Task Display Logic */}
                    <p>Current Mode ID: {gameData.currentModeId || 'Not Set'}</p>
                    <p>Current Task ID: {gameData.currentTaskId || 'No Task Yet'}</p>
                    <p className="mt-4 text-lg">Next task will appear here...</p>
                    {/* TODO: Button for "Next Task" (requires another server action) */}
                </div>
            )}

            {gameData.status === 'paused' && <p>Game Paused</p>}
            {gameData.status === 'finished' && <p>Game Finished!</p>}


            <PlayerList players={gameData.players} />

        </div>
    );
}