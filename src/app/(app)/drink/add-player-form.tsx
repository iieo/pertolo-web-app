'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import {
  PageShell,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/app/(app)/200-questions/components/game-shell';
import { cn } from '@/lib/utils';

import {
  MAX_NAME_LENGTH,
  MIN_PLAYERS,
  isSameName,
  normalizeName,
  setPlayers,
  usePlayers,
} from './players';

function AddPlayerForm() {
  const router = useRouter();
  const players = usePlayers();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const list = players ?? [];
  const missing = MIN_PLAYERS - list.length;

  function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    inputRef.current?.focus();
    const value = normalizeName(name);
    if (!value) {
      setError('Bitte gib einen Namen ein.');
      return;
    }
    if (list.some((player) => isSameName(player, value))) {
      setError(`${value} ist schon dabei.`);
      return;
    }
    setPlayers((prev) => [...prev, value]);
    setName('');
    setError(null);
  }

  function removePlayer(index: number) {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <PageShell
      footer={
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm text-white/60 tabular-nums" aria-live="polite">
            {players === null
              ? ' '
              : missing > 0
                ? missing === 1 && list.length > 0
                  ? 'Noch ein Spieler fehlt.'
                  : `Mindestens ${MIN_PLAYERS} Spieler`
                : `${list.length} Spieler`}
          </p>
          <button
            type="button"
            className={primaryButtonClass}
            disabled={missing > 0}
            onClick={() => router.push('/drink/mode')}
          >
            Weiter
          </button>
        </div>
      }
    >
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Drink</h1>
        <p className="mt-2 text-base leading-relaxed text-white/60">Wer spielt mit?</p>
      </header>

      <form onSubmit={addPlayer} className="mt-10 flex flex-col gap-2" noValidate>
        <label htmlFor="player-name" className="sr-only">
          Name
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="player-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Name"
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            aria-invalid={!!error}
            aria-describedby={error ? 'player-name-error' : undefined}
            className={cn(
              'min-h-14 min-w-0 flex-1 rounded-xl border bg-white/5 px-4 text-base text-white placeholder:text-white/40 outline-none transition-colors duration-150 motion-reduce:transition-none focus:border-white/60',
              error ? 'border-red-400' : 'border-white/20',
            )}
          />
          <button type="submit" className={cn(secondaryButtonClass, 'w-auto shrink-0 px-5')}>
            Hinzufügen
          </button>
        </div>
        <p id="player-name-error" role="alert" className="min-h-5 text-sm text-red-300">
          {error}
        </p>
      </form>

      {players !== null && (
        <section aria-label="Spieler" className="mt-4">
          {list.length === 0 ? (
            <p className="text-base text-white/40">Noch keine Spieler.</p>
          ) : (
            <ul className="flex flex-col">
              {list.map((player, index) => (
                <li
                  key={player}
                  className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 last:border-b-0"
                >
                  <span className="min-w-0 text-lg font-medium wrap-break-word">{player}</span>
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    aria-label={`${player} entfernen`}
                    className="-mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white/60 outline-none transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white motion-reduce:transition-none"
                  >
                    <X size={20} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </PageShell>
  );
}

export default AddPlayerForm;
