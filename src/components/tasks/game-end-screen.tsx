'use client';

import { useRouter } from 'next/navigation';

function GameEndScreen() {
  const router = useRouter();

  const handleRestart = () => {
    router.push('/');
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] w-full p-6 text-center select-none overflow-hidden cursor-pointer bg-gradient-to-br from-pink-950 via-fuchsia-950 to-indigo-950 transition-colors duration-1000"
      onClick={handleRestart}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-[1000ms] max-w-2xl w-full">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-fuchsia-200 to-indigo-200 drop-shadow-2xl leading-tight">
          Spielende!
        </h2>
        <p className="text-2xl mt-4 text-white/80 font-bold drop-shadow-lg">
          Danke fürs Mitmachen!
        </p>
      </div>

      <div className="absolute bottom-12 animate-pulse text-white/50 text-sm font-medium tracking-widest uppercase">
        Tippen zum Neustarten
      </div>
    </div>
  );
}

export default GameEndScreen;
