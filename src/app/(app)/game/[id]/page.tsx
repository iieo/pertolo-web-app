import { getGameData } from "./actions";


export default async function GameScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await getGameData(gameCode);

    if (!gameData) {
        return <div>Game not found</div>;
    }

    if (gameData.currentModeId === null) {
        return <div>Gamemode not selected</div>;
    }




    return (<div></div>);
}