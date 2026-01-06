import { getGameModes } from './actions';

import { Separator } from '@/components/ui/separator';
import GameModeCard from './game-mode-card';

export default async function GameModeScreen() {
  const modes = await getGameModes();

  return (
    <main className="flex flex-col justify-between h-[calc(100dvh-2rem)] w-[100dvw] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4 items-center">
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
            <GameModeCard mode={mode} />
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
