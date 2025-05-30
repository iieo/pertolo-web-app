'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GameModel, GameModeModel } from '@/db/schema';
import { redirect } from 'next/navigation';
import { dbUpdateGameSettings } from '../actions';

function GameModeCard({ game, mode }: { game: GameModel; mode: GameModeModel }) {
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

  return (
    <Card
      className="w-full cursor-pointer transition-transform bg-gradient-to-br from-purple-800/90 to-purple-900/90  border border-purple-400/30 shadow-xl hover:scale-105 hover:border-purple-300/60 hover:shadow-2xl p-4"
      onClick={setGameMode}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-extrabold text-purple-200 drop-shadow mb-1">
          {mode.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <span className="text-purple-100/90 text-base">{mode.description}</span>
      </CardContent>
    </Card>
  );
}

export default GameModeCard;
