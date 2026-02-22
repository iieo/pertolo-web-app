import { getGameModes } from './actions';

import { Separator } from '@/components/ui/separator';
import GameModeCard from './game-mode-card';

export default async function GameModeScreen() {
  const modes = await getGameModes();

  return (
    <main className="relative flex flex-col justify-between min-h-[calc(100dvh-2rem)] w-[100dvw] bg-gray-950 overflow-hidden px-4 items-center">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-xl flex flex-col flex-1 pb-10">
        <div className="mt-14 mb-10 text-center animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-200 drop-shadow-xl mb-3">
            Game Mode
          </h1>
          <p className="text-lg text-fuchsia-200/60 font-medium">
            Wähle deinen Spielmodus
          </p>
        </div>

        <ul className="flex flex-col gap-5 w-full">
          {modes.map((mode, idx) => (
            <li
              key={mode.id}
              className="animate-in fade-in slide-in-from-bottom"
              style={{ animationDuration: '700ms', animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              <GameModeCard mode={mode} />
            </li>
          ))}
        </ul>

        <footer className="mt-auto pt-10 text-xs text-purple-200/40 text-center font-medium uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
          &copy; {new Date().getFullYear()} Pertolo &middot; Drink responsibly
        </footer>
      </div>
    </main>
  );
}
