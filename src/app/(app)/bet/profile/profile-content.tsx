'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { PointHistoryChart } from '../components/point-history-chart';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  pageClass,
  pageTitleClass,
  secondaryButtonClass,
  sectionTitleClass,
} from '../components/styles';

interface ProfileContentProps {
  user: { id: string; name: string; email: string };
  balance: number | null;
  pointHistory: Array<{ date: string; balance: number }>;
}

export function ProfileContent({ user, balance, pointHistory }: ProfileContentProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      toast.success('Abgemeldet');
      router.push('/bet/login');
      router.refresh();
    } catch {
      toast.error('Abmeldung fehlgeschlagen');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className={cn(pageClass, 'max-w-3xl')}>
      <header>
        <h1 className={cn(pageTitleClass, 'wrap-break-word')}>{user.name}</h1>
        <p className="mt-2 text-base break-all text-white/60">{user.email}</p>
      </header>

      <section aria-labelledby="balance-heading" className="mt-12">
        <h2 id="balance-heading" className="text-base text-white/60">
          Kontostand
        </h2>
        {balance !== null ? (
          <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums md:text-6xl">
            {balance.toLocaleString()}
            <span className="ml-2 text-xl font-medium text-white/60 md:text-2xl">Punkte</span>
          </p>
        ) : (
          <p className="mt-1 text-lg text-white/60">Nicht verfügbar</p>
        )}
      </section>

      <section aria-labelledby="history-heading" className="mt-16">
        <h2 id="history-heading" className={sectionTitleClass}>
          Punktestand-Verlauf
        </h2>
        <div className="mt-6">
          <PointHistoryChart initialData={pointHistory} />
        </div>
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className={cn(secondaryButtonClass, 'mt-16 sm:w-auto')}
      >
        {signingOut ? 'Wird abgemeldet…' : 'Abmelden'}
      </button>
    </div>
  );
}
