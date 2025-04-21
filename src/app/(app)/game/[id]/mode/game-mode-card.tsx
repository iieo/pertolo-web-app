"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { GameModel, GameModeModel } from '@/db/schema';
import { redirect } from 'next/navigation';
import { dbUpdateGameSettings } from '../actions';


function GameModeCard({
    game,
    mode,
}: {
    game: GameModel;
    mode: GameModeModel
}) {
    async function setGameMode() {
        const settings = game.gameSettings;

        const result = await dbUpdateGameSettings({
            gameId: game.id,
            gameSettings: {
                ...settings,
                currentGameModeId: mode.id,
            },
        });
        if (result) {
            redirect(`/game/${game.gameCode}`);
        } else {
            // Could show an error alert here if this were a client component
            console.error('Failed to set game mode');
        }
    }


    return (<Card
        className="w-full cursor-pointer transition-transform hover:scale-[1.02] bg-gradient-to-r from-purple-700/80 to-purple-600/80 shadow-lg border border-purple-900/40"
        onClick={setGameMode}
    >
        <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-purple-100">
                {mode.name}
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <span className="text-purple-200 text-sm">{mode.description}</span>
        </CardContent>
    </Card>);
}

export default GameModeCard;