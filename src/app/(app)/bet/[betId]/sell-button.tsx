'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sellWager } from './actions';
import { useBet } from '../bet-provider';
import toast from 'react-hot-toast';
import { smallButtonClass } from '../components/styles';

interface SellButtonProps {
  wagerId: string;
  cashout: number;
}

export function SellButton({ wagerId, cashout }: SellButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { refreshBalance } = useBet();

  const handleSell = async () => {
    setLoading(true);
    try {
      const res = await sellWager(wagerId);
      if (res.success) {
        toast.success(`Für ${res.data.cashout} Punkte verkauft!`);
        await refreshBalance();
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error('Verkauf der Wette fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading || cashout <= 0}
      onClick={handleSell}
      className={`${smallButtonClass} shrink-0`}
    >
      {loading ? 'Wird verkauft…' : 'Verkaufen'}
    </button>
  );
}
