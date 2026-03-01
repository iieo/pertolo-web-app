'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';
import { useBet } from '../bet-provider';
import { PointHistoryChart } from '../components/point-history-chart';
import { Button } from '@/components/ui/button';
import { Coins, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { balance } = useBet();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      toast.success('Signed out');
      router.push('/bet/login');
      router.refresh();
    } catch {
      toast.error('Failed to sign out');
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 pt-6">
      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-400">
          {session.user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">{session.user.name}</h1>
          <p className="text-sm text-white/40">{session.user.email}</p>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <Coins size={28} className="text-amber-400" />
        <div>
          <p className="text-xs text-white/40">Balance</p>
          <p className="text-2xl font-extrabold text-amber-400">
            {balance !== null ? balance.toLocaleString() : '—'}
          </p>
        </div>
      </div>

      {/* Point history */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-white/70">Point History</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <PointHistoryChart userId={session.user.id} />
        </div>
      </div>

      {/* Sign out */}
      <Button
        onClick={handleSignOut}
        disabled={signingOut}
        variant="ghost"
        className="w-full border border-red-500/20 text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={16} className="mr-2" />
        {signingOut ? 'Signing out...' : 'Sign Out'}
      </Button>
    </div>
  );
}
