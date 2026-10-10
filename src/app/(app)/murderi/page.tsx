'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { dbFindGame } from './actions';
import {
  PageShell,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './components/shell';
import { errorMessage } from './i18n';
import { CODE_LENGTH, gamePath, normalizeCode } from './limits';
import { useT } from './locale';

export default function MurderiHome() {
  const { t } = useT();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH || joining) return;
    setJoining(true);
    setError(null);
    try {
      const result = await dbFindGame(code);
      if (!result.success) {
        setError(result.error);
        setJoining(false);
        return;
      }
      router.push(gamePath(result.data.gameId));
    } catch {
      setError('unknown');
      setJoining(false);
    }
  };

  return (
    <PageShell backHref="/">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t.title}</h1>
      <p className="mt-2 text-base leading-relaxed text-white/60">{t.subtitle}</p>

      <form onSubmit={handleJoin} className="mt-12 flex flex-col gap-4" noValidate>
        <h2 className="text-xl font-semibold">{t.joinTitle}</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="murderi-code" className="text-sm font-medium text-white/60">
            {t.codeLabel}
          </label>
          <input
            id="murderi-code"
            value={code}
            onChange={(e) => {
              setCode(normalizeCode(e.target.value));
              setError(null);
            }}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={CODE_LENGTH}
            placeholder="ABCD"
            aria-describedby="murderi-code-hint murderi-code-error"
            aria-invalid={error !== null}
            className={`${inputClass} text-center text-2xl font-bold tracking-widest uppercase`}
          />
          <p id="murderi-code-hint" className="text-sm leading-relaxed text-white/60">
            {t.codeHint}
          </p>
          <p id="murderi-code-error" role="alert" className="text-sm text-[#f87171]">
            {error ? errorMessage(t, error) : null}
          </p>
        </div>
        <button
          type="submit"
          className={primaryButtonClass}
          disabled={code.length !== CODE_LENGTH || joining}
        >
          {joining ? t.joining : t.join}
        </button>
      </form>

      <div className="mt-8">
        <Link href="/murderi/create" className={secondaryButtonClass}>
          {t.createGame}
        </Link>
      </div>

      <section className="mt-12 flex flex-col gap-4" aria-labelledby="murderi-rules">
        <h2 id="murderi-rules" className="text-xl font-semibold">
          {t.rulesTitle}
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-6 text-base leading-relaxed text-white/80">
          {t.rulesList.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
