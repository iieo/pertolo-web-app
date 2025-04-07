import { redirect } from "next/navigation";
import { getGameData } from "../actions";
import { dbSetGameMode, getGameModes } from "./actions";

export default async function GameModeScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await getGameData(gameCode);

    if (gameData == null) {
        return <div>Game not found</div>;
    }

    const modes = await getGameModes();


    async function setGameMode(modeId: string) {
        if (gameData == null) {
            return;
        }
        const result = await dbSetGameMode(gameData.id, modeId);
        if (result) {
            redirect(`/game/${gameCode}`);
        } else {
            console.error('Failed to set game mode');
        }
    }

    return (<div>
        <h1 className="text-3xl font-bold mb-2">Game Modes</h1>
        <p className="text-xl mb-4">Available Game Modes:</p>
        <ul className="list-disc pl-6">
            {modes.map((mode) => (
                <li key={mode.id} className="mb-2">
                    <button type="button" onClick={() => setGameMode(mode.id)}> <strong>{mode.name}</strong>: {mode.description}</button>
                </li>
            ))}
        </ul>
    </div>);
}