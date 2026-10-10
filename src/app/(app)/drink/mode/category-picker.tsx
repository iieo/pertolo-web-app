'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { enterFullscreen, exitFullscreen } from '@/app/(app)/200-questions/fullscreen';
import { PageShell } from '@/app/(app)/200-questions/components/game-shell';

import { DrinkCategory, categoryColor } from '../categories';
import { useDrinkGame } from '../game-provider';
import { MIN_PLAYERS, usePlayers } from '../players';
import GameModeCard from './game-mode-card';

const listFormat = new Intl.ListFormat('de', { type: 'conjunction' });

function CategoryPicker({
  categories,
  loadError,
}: {
  categories: DrinkCategory[];
  loadError: string | null;
}) {
  const router = useRouter();
  const players = usePlayers();
  const { startGame } = useDrinkGame();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tooFewPlayers = players !== null && players.length < MIN_PLAYERS;

  useEffect(() => {
    if (tooFewPlayers) router.replace('/drink');
  }, [tooFewPlayers, router]);

  async function selectCategory(category: DrinkCategory) {
    if (loadingId) return;
    enterFullscreen();
    setLoadingId(category.id);
    setError(null);
    const result = await startGame(category);
    if (result.ok) {
      router.push('/drink/game');
      return;
    }
    exitFullscreen();
    setLoadingId(null);
    setError(result.error);
  }

  if (players === null || tooFewPlayers) return null;

  return (
    <PageShell>
      <div className="-mt-6 -ml-3">
        <Link
          href="/drink"
          className="inline-flex min-h-12 items-center gap-1 rounded-xl px-2 text-base font-medium text-white/80 outline-none hover:text-white focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronLeft size={20} aria-hidden />
          Spieler
        </Link>
      </div>

      <header className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight">Kategorie</h1>
        <p className="mt-2 text-base leading-relaxed text-white/60">
          Mit {listFormat.format(players)}
        </p>
      </header>

      {(loadError ?? error) && (
        <p role="alert" className="mt-8 text-base leading-relaxed text-red-300">
          {loadError ?? error}
        </p>
      )}

      <ul className="mt-10 flex flex-col gap-2">
        {categories.map((category, index) => (
          <li key={category.id}>
            <GameModeCard
              name={category.name}
              description={category.description}
              color={categoryColor(category.name, index)}
              loading={loadingId === category.id}
              disabled={loadingId !== null}
              onClick={() => selectCategory(category)}
            />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}

export default CategoryPicker;
