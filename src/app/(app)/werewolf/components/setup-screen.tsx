'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BackLink } from '@/components/game/back-link';
import type { Result } from '@/util/types';

import { createGame, joinGame } from '../actions';
import { errorMessage } from '../i18n';
import { BLACK } from '../palette';
import {
  inputClass,
  LocaleToggle,
  PageShell,
  primaryButtonClass,
  readStoredName,
  RulesButton,
  secondaryButtonClass,
  storeName,
  useI18n,
} from './ui';

type Pending = 'create' | 'join' | null;

export function SetupScreen() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [pending, setPending] = useState<Pending>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const createNameRef = useRef<HTMLInputElement>(null);
  const joinNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = readStoredName();
    for (const input of [createNameRef.current, joinNameRef.current]) {
      if (input && !input.value) input.value = stored;
    }
  }, []);

  const submit = async (
    kind: Exclude<Pending, null>,
    name: string,
    action: () => Promise<Result<{ gameId: string }>>,
    setError: (error: string | null) => void,
  ) => {
    if (pending) return;
    setPending(kind);
    setError(null);
    try {
      const result = await action();
      if (!result.success) {
        setError(result.error);
        setPending(null);
        return;
      }
      storeName(name);
      router.push(`/werewolf/${result.data.gameId}`);
    } catch {
      setError('NETWORK');
      setPending(null);
    }
  };

  return (
    <div lang={locale}>
      <PageShell
        color={BLACK}
        header={
          <div className="pt-[calc(env(safe-area-inset-top)+0.5rem)]">
            <BackLink locale={locale} />
          </div>
        }
      >
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">{t.title}</h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-(--muted) md:mt-4 md:text-lg">
              {t.subtitle}
            </p>
          </div>
          <div className="-mr-2 flex shrink-0 flex-col items-end">
            <RulesButton t={t} locale={locale} />
            <LocaleToggle t={t} locale={locale} />
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
          <form
            className="flex flex-col gap-6 md:max-w-md"
            aria-labelledby="ww-create-heading"
            onSubmit={(e) => {
              e.preventDefault();
              const name = String(new FormData(e.currentTarget).get('name') ?? '');
              submit('create', name, () => createGame(name), setCreateError);
            }}
          >
            <div className="flex flex-col gap-2">
              <h2 id="ww-create-heading" className="text-2xl font-semibold md:text-3xl">
                {t.createHeading}
              </h2>
              <p className="text-base text-(--muted)">{t.createHint}</p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t.nameLabel}</span>
              <input
                ref={createNameRef}
                name="name"
                required
                maxLength={20}
                autoComplete="nickname"
                placeholder={t.namePlaceholder}
                className={inputClass}
              />
            </label>
            {createError && (
              <p role="alert" className="text-base font-semibold">
                {errorMessage(t, createError)}
              </p>
            )}
            <button type="submit" className={primaryButtonClass} disabled={pending !== null}>
              {t.create}
            </button>
          </form>

          <form
            className="flex flex-col gap-6 md:max-w-md"
            aria-labelledby="ww-join-heading"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const code = String(data.get('code') ?? '')
                .trim()
                .toUpperCase();
              const name = String(data.get('name') ?? '');
              submit('join', name, () => joinGame(code, name), setJoinError);
            }}
          >
            <div className="flex flex-col gap-2">
              <h2 id="ww-join-heading" className="text-2xl font-semibold md:text-3xl">
                {t.joinHeading}
              </h2>
              <p className="text-base text-(--muted)">{t.joinHint}</p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t.codeLabel}</span>
              <input
                name="code"
                required
                minLength={4}
                maxLength={4}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="ABCD"
                className={`${inputClass} font-semibold tracking-[0.3em] uppercase`}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t.nameLabel}</span>
              <input
                ref={joinNameRef}
                name="name"
                required
                maxLength={20}
                autoComplete="nickname"
                placeholder={t.namePlaceholder}
                className={inputClass}
              />
            </label>
            {joinError && (
              <p role="alert" className="text-base font-semibold">
                {errorMessage(t, joinError)}
              </p>
            )}
            <button type="submit" className={secondaryButtonClass} disabled={pending !== null}>
              {t.join}
            </button>
          </form>
        </div>
      </PageShell>
    </div>
  );
}
