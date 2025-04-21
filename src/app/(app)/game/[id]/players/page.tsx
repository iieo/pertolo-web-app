import { dbGetGameByCode } from '@/app/(app)/actions';
import AddPlayerForm from './add-player-form';
import GameCodeCopy from './GameCodeCopy';

export default async function PlayersScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await dbGetGameByCode(gameCode);
    if (gameData.success === false) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
                <div className="text-2xl text-red-400 font-bold">Game not found</div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center h-[100dvh] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 bg-red-300">
            <div className="mt-12 mb-8 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
                    Players
                </h1>
                <p className="text-xl text-purple-100/80 font-medium flex items-center justify-center gap-2">
                    Game Code: <GameCodeCopy code={gameData.data.gameCode} />
                </p>
            </div>
            <AddPlayerForm gameId={gameData.data.id} gameSettings={gameData.data.gameSettings} />

        </main>
    );
}
