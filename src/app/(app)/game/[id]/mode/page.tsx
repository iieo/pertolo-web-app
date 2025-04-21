// 'use client' is not needed since this is a server component, but we need to use shadcn UI and match the home page style

import { redirect } from 'next/navigation';
import { getGameModes } from './actions';
import { dbGetGameByCode } from '@/app/(app)/actions';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GameModeCard from './game-mode-card';

export default async function GameModeScreen({ params }: { params: Promise<{ id: string }> }) {
  const loadedParams = await params;
  const gameCode = loadedParams.id.toUpperCase();
  const gameData = await dbGetGameByCode(gameCode);

  if (gameData.success === false) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
        <Card className="bg-gradient-to-br from-red-900/80 to-gray-900/80 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-red-200">
              Game not found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                The game with code <span className="font-mono">{gameCode}</span> could not be found.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  const modes = await getGameModes();

  return (
    <main className="flex flex-col justify-between h-[100dvh] w-[100dvw] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4 items-center">
      <div className="mt-12 mb-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
          Game Modes
        </h1>
        <p className="text-xl text-purple-100/80 font-medium flex items-center justify-center gap-2 w-full">
          Wähle deinen Spielmodus
        </p>
      </div>
      <ul className="flex flex-col gap-4 w-full max-w-xl">
        {modes.map((mode, idx) => (
          <li key={mode.id}>
            <GameModeCard
              mode={mode}
              game={gameData.data}
            />
            {idx < modes.length - 1 && (
              <div className="flex justify-center my-2">
                <Separator className="w-2/3 bg-purple-900/60" />
              </div>
            )}
          </li>
        ))}
      </ul>
      <footer className="my-4 text-xs text-purple-200/60 text-center">
        &copy; {new Date().getFullYear()} Pertolo. Have fun and drink responsibly!
      </footer>
    </main>
  );
}
