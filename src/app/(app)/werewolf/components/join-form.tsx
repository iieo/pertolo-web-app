'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { joinGame } from '../actions';
import { errorMessage } from '../i18n';
import type { NotJoinedView } from '../lib/view';
import { BLACK } from '../palette';
import {
  inputClass,
  LocaleToggle,
  PageShell,
  PlayerTile,
  primaryButtonClass,
  readStoredName,
  RulesButton,
  storeName,
  textButtonClass,
  TileGrid,
  useI18n,
} from './ui';

export function JoinForm({
  gameId,
  view,
  onJoined,
}: {
  gameId: string;
  view: NotJoinedView;
  onJoined: () => Promise<void>;
}) {
  const { locale, t } = useI18n();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current && !nameRef.current.value) nameRef.current.value = readStoredName();
  }, []);

  const join = async (name: string) => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = await joinGame(gameId, name);
      if (!result.success) {
        setError(result.error);
        return;
      }
      storeName(name);
      await onJoined();
    } catch {
      setError('NETWORK');
    } finally {
      setPending(false);
    }
  };

  const rejoinable = view.rejoinableNames;

  return (
    <PageShell color={BLACK}>
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-medium text-(--muted)">{t.title}</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-7xl">
            {t.joinGameTitle(view.gameId)}
          </h1>
        </div>
        <div className="-mr-2 flex shrink-0 flex-col items-end">
          <RulesButton t={t} locale={locale} />
          <LocaleToggle t={t} locale={locale} />
        </div>
      </header>

      <div className="mt-12 flex flex-col gap-12 md:max-w-2xl">
        {view.canJoinNew && (
          <form
            className="flex max-w-md flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              join(String(new FormData(e.currentTarget).get('name') ?? ''));
            }}
          >
            <p className="text-base text-(--muted) md:text-lg">{t.joinGameHint}</p>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t.nameLabel}</span>
              <input
                ref={nameRef}
                name="name"
                required
                maxLength={20}
                autoComplete="nickname"
                placeholder={t.namePlaceholder}
                className={inputClass}
              />
            </label>
            <button type="submit" className={primaryButtonClass} disabled={pending}>
              {t.join}
            </button>
          </form>
        )}

        {!view.canJoinNew && <p className="text-lg leading-relaxed md:text-xl">{t.gameRunning}</p>}

        {rejoinable.length > 0 && (
          <section className="flex flex-col gap-4" aria-labelledby="ww-rejoin-heading">
            <div className="flex flex-col gap-2">
              <h2 id="ww-rejoin-heading" className="text-2xl font-semibold">
                {t.rejoinHeading}
              </h2>
              <p className="text-base text-(--muted)">{t.rejoinHint}</p>
            </div>
            <TileGrid label={t.rejoinHeading}>
              {rejoinable.map((name) => (
                <PlayerTile
                  key={name}
                  name={name}
                  label={t.rejoinAs(name)}
                  disabled={pending}
                  onClick={() => join(name)}
                />
              ))}
            </TileGrid>
          </section>
        )}

        {error && (
          <p role="alert" className="text-base font-semibold">
            {errorMessage(t, error)}
          </p>
        )}

        <Link href="/werewolf" className={`${textButtonClass} -ml-2 self-start`}>
          {t.backToStart}
        </Link>
      </div>
    </PageShell>
  );
}
