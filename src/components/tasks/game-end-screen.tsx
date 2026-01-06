'use client';

import { useRouter } from 'next/navigation';

function GameEndScreen() {
  const router = useRouter();

  const handleRestart = () => {
    router.push('/');
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full p-4 text-center bg-gradient-to-br from-pink-900 via-fuchsia-900 to-indigo-900 select-none"
      onClick={handleRestart}
    >
      <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
        Das Spiel ist vorbei!
      </h2>
      <p className="mt-4 text-xl text-purple-100/80 font-medium">Danke fürs Mitmachen!</p>
      <p className="mt-2 text-lg text-purple-200/60">Tippe um ein neues Spiel zu starten</p>
    </div>
  );
}

export default GameEndScreen;
