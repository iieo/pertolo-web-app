'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';

import { BackLink } from '@/components/game/back-link';
import { secondaryButtonClass } from '@/components/game/page-shell';
import {
  LanguageToggle,
  RulesLink,
  SettingsSection,
  SetupScreen,
  StartButton,
} from '@/components/game/setup';
import { cn } from '@/lib/utils';

import { useDrinkGame } from '../game-provider';
import { MAX_NAME_LENGTH, MIN_PLAYERS, isSameName, normalizeName, setPlayers } from '../players';

export function PlayersPhase() {
  const { players, goToCategories, locale, setLocale, t } = useDrinkGame();
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
      setError(t.emptyName);
      return;
    }
    if (list.some((player) => isSameName(player, value))) {
      setError(t.duplicateName(value));
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
    <SetupScreen
      title={t.title}
      subtitle={t.playersSubtitle}
      back={<BackLink locale={locale} />}
      rules={
        <RulesLink
          label={t.rules}
          title={t.rulesTitle}
          rules={t.rulesList}
          confirmLabel={t.rulesConfirm}
          lang={locale}
        />
      }
      settings={
        <SettingsSection>
          <LanguageToggle label={t.language} value={locale} onChange={setLocale} />
        </SettingsSection>
      }
      footer={
        <StartButton
          label={t.next}
          detail={
            players === null
              ? undefined
              : missing > 0
                ? missing === 1 && list.length > 0
                  ? t.oneMorePlayer
                  : t.minPlayers(MIN_PLAYERS)
                : t.playerCount(list.length)
          }
          disabled={missing > 0}
          onClick={goToCategories}
        />
      }
    >
      <div className="flex w-full max-w-xl flex-col">
        <form onSubmit={addPlayer} className="flex flex-col gap-2" noValidate>
          <label htmlFor="player-name" className="sr-only">
            {t.nameLabel}
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
              placeholder={t.namePlaceholder}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={!!error}
              aria-describedby={error ? 'player-name-error' : undefined}
              className={cn(
                'min-h-14 min-w-0 flex-1 rounded-xl border bg-white/5 px-4 text-base text-white placeholder:text-white/40 outline-none transition-colors duration-150 motion-reduce:transition-none hover:border-white/40 focus:border-white/60',
                error ? 'border-red-400' : 'border-white/20',
              )}
            />
            <button type="submit" className={cn(secondaryButtonClass, 'w-auto shrink-0 px-5')}>
              {t.addPlayer}
            </button>
          </div>
          <p id="player-name-error" role="alert" className="min-h-5 text-sm text-red-300">
            {error}
          </p>
        </form>

        {players !== null && (
          <section aria-label={t.playersLabel} className="mt-4">
            {list.length === 0 ? (
              <p className="text-base text-white/40">{t.noPlayers}</p>
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
                      aria-label={t.removePlayer(player)}
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
      </div>
    </SetupScreen>
  );
}
