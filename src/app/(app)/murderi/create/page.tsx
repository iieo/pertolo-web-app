'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { dbCreateGame } from '../actions';
import {
  PageShell,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../components/shell';
import { errorMessage } from '../i18n';
import {
  ErrorKey,
  gamePath,
  isReservedName,
  MAX_NAME_LENGTH,
  MAX_PLAYERS,
  MIN_PLAYERS,
  nameKey,
  normalizeName,
} from '../limits';
import { useT } from '../locale';

const STORAGE_KEY = 'murderi_saved_players';

function loadSavedPlayers(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of parsed) {
      if (typeof item !== 'string') continue;
      const name = normalizeName(item);
      if (
        !name ||
        name.length > MAX_NAME_LENGTH ||
        isReservedName(name) ||
        seen.has(nameKey(name))
      ) {
        continue;
      }
      seen.add(nameKey(name));
      result.push(name);
    }
    return result.slice(0, MAX_PLAYERS);
  } catch {
    return [];
  }
}

function savePlayers(players: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch {}
}

export default function CreateGame() {
  const { t } = useT();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<ErrorKey | 'max' | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    setPlayers(loadSavedPlayers());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) savePlayers(players);
  }, [players, loaded]);

  const full = players.length >= MAX_PLAYERS;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = normalizeName(playerName);
    if (!name) return setError('emptyName');
    if (name.length > MAX_NAME_LENGTH) return setError('nameTooLong');
    if (isReservedName(name)) return setError('reservedName');
    if (full) return setError('max');
    if (players.some((p) => nameKey(p) === nameKey(name))) return setError('duplicateName');
    setPlayers((prev) => [...prev, name]);
    setPlayerName('');
    setError(null);
    setCreateError(null);
    inputRef.current?.focus();
  };

  const handleCreate = async () => {
    if (players.length < MIN_PLAYERS || creating) return;
    setCreating(true);
    setCreateError(null);
    try {
      const result = await dbCreateGame(players);
      if (!result.success) {
        setCreateError(result.error);
        setCreating(false);
        return;
      }
      router.push(`${gamePath(result.data.gameId)}/share`);
    } catch {
      setCreateError('unknown');
      setCreating(false);
    }
  };

  const missing = MIN_PLAYERS - players.length;

  return (
    <PageShell
      backHref="/murderi"
      footer={
        <div className="flex flex-col gap-4">
          <p role="status" className="text-center text-sm text-white/60 tabular-nums">
            {createError ? (
              <span className="text-[#f87171]">{errorMessage(t, createError)}</span>
            ) : missing > 0 ? (
              t.needMore(missing)
            ) : (
              t.playerCount(players.length)
            )}
          </p>
          <button
            type="button"
            className={primaryButtonClass}
            disabled={missing > 0 || creating}
            onClick={handleCreate}
          >
            {creating ? t.creating : t.create}
          </button>
        </div>
      }
    >
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.createTitle}</h1>
      <p className="mt-2 text-base leading-relaxed text-white/60">
        {t.createSubtitle(MIN_PLAYERS)}
      </p>

      <form onSubmit={handleAdd} className="mt-12 flex flex-col gap-2" noValidate>
        <label htmlFor="murderi-name" className="text-sm font-medium text-white/60">
          {t.nameLabel}
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="murderi-name"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError(null);
            }}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            placeholder={t.namePlaceholder}
            aria-describedby="murderi-name-error"
            aria-invalid={error !== null}
            disabled={full}
            className={cn(inputClass, 'flex-1')}
          />
          <button
            type="submit"
            disabled={full}
            className={cn(secondaryButtonClass, 'w-auto shrink-0 px-4')}
          >
            {t.add}
          </button>
        </div>
        <p id="murderi-name-error" role="alert" className="text-sm text-[#f87171]">
          {error === 'max' ? t.maxReached(MAX_PLAYERS) : error ? errorMessage(t, error) : null}
        </p>
        {full && !error && <p className="text-sm text-white/60">{t.maxReached(MAX_PLAYERS)}</p>}
      </form>

      {players.length > 0 && (
        <section className="mt-8" aria-labelledby="murderi-players">
          <h2 id="murderi-players" className="text-xl font-semibold">
            {t.playersHeading}
          </h2>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {players.map((player) => (
              <li
                key={nameKey(player)}
                className="flex min-h-14 items-center justify-between gap-4"
              >
                <span className="min-w-0 text-base break-words">{player}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPlayers((prev) => prev.filter((p) => p !== player));
                    setCreateError(null);
                  }}
                  aria-label={t.remove(player)}
                  className="-mr-2 flex size-12 shrink-0 items-center justify-center rounded-xl text-white/60 outline-none hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X size={20} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
