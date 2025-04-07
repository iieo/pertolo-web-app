import { getGameData } from "../actions";


export default async function PlayersScreen({ params }: { params: Promise<{ id: string }> }) {
    const loadedParams = await params;
    const gameCode = loadedParams.id.toUpperCase();
    const gameData = await getGameData(gameCode);

    if (!gameData) {
        return <div>Game not found</div>;
    }

    return (<div>


    </div>);
}