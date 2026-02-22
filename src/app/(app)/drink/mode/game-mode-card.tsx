'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DrinkCategoryModel } from '@/db/schema';
import { redirect } from 'next/navigation';
import { useDrinkGame } from '../game-provider';
import { Play } from 'lucide-react';

function GameModeCard({ mode }: { mode: DrinkCategoryModel }) {
  const { setCategory } = useDrinkGame();

  async function setGameMode() {
    setCategory(mode);
    redirect(`/drink/game`);
  }

  return (
    <Card
      className="group w-full cursor-pointer transition-all duration-300 border border-white/10 bg-white/5 hover:bg-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] rounded-2xl overflow-hidden relative backdrop-blur-md"
      onClick={setGameMode}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 via-fuchsia-500/0 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-y-0 right-[-100%] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />

      <CardHeader className="pb-2 pt-5 relative">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 drop-shadow-sm">
            {mode.name}
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-fuchsia-500 group-hover:text-white text-white/50 group-hover:scale-110 transition-all shadow-inner">
            <Play className="w-5 h-5 ml-0.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-5 relative">
        <span className="text-purple-200/70 text-base font-medium leading-relaxed block pr-12">
          {mode.description}
        </span>
      </CardContent>
    </Card>
  );
}

export default GameModeCard;
