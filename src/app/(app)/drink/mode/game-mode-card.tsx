'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DrinkCategoryModel } from '@/db/schema';
import { redirect } from 'next/navigation';
import { useDrinkGame } from '../game-provider';

function GameModeCard({ mode }: { mode: DrinkCategoryModel }) {
  const { setCategory } = useDrinkGame();
  async function setGameMode() {
    setCategory(mode);
    redirect(`/drink/game`);
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
