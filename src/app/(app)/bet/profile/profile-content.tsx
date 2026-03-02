'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { PointHistoryChart } from '../components/point-history-chart';
import { Button } from '@/components/ui/button';
import { Coins, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="mx-auto max-w-3xl space-y-6 px-4 pt-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-400">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">{user.name}</h1>
          <p className="text-sm text-white/40">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <Coins size={28} className="text-amber-400" />
        <div>
          <p className="text-xs text-white/40">Kontostand</p>
          <p className="text-2xl font-extrabold text-amber-400">
            {balance !== null ? balance.toLocaleString() : '—'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-white/70">Punktestand-Verlauf</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <PointHistoryChart initialData={pointHistory} />
        </div>
      </div>

      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="ghost"
        className="w-full border border-red-500/20 text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={16} className="mr-2" />
        {signingOut ? 'Abmeldung...' : 'Abmelden'}
      </Button>
    </div>
  );
}
