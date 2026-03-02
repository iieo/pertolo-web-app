'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { sellWager } from './actions';
import { useBet } from '../bet-provider';
import { TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <Button
      variant="outline"
      size="sm"
      disabled={loading || cashout <= 0}
      onClick={handleSell}
      className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
    >
      <TrendingDown size={14} className="mr-1.5" />
      {loading ? '...' : 'Verkaufen'}
    </Button>
  );
}
