'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { resolveBet, cancelBet } from '../[betId]/actions';
import { useBet } from '../bet-provider';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ResolveFormProps {
  betId: string;
  options: Array<{ id: string; label: string }>;
}

export function ResolveForm({ betId, options }: ResolveFormProps) {
  const router = useRouter();
  const { refreshBalance } = useBet();
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResolve() {
    if (!selectedOption) {
      toast.error('Wähle die gewinnende Option');
      return;
    }
    setLoading(true);
    try {
      const result = await resolveBet(betId, selectedOption);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Wette beendet! ${result.data.payouts.toLocaleString()} Punkte wurden verteilt`);
      await refreshBalance();
      router.refresh();
    } catch {
      toast.error('Auswertung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const result = await cancelBet(betId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Wette storniert. ${result.data.refunded.toLocaleString()} Punkte wurden erstattet`);
      await refreshBalance();
      router.refresh();
    } catch {
      toast.error('Stornierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
      <h3 className="text-sm font-semibold text-orange-400">Wette auswerten (Besitzer)</h3>

      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <Button
            key={opt.id}
            type="button"
            variant="outline"
            className={cn(
              'justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white/80',
              selectedOption === opt.id &&
              'bg-orange-500/20 border-orange-500/50 text-orange-400 hover:bg-orange-500/30 hover:text-orange-300',
            )}
            onClick={() => setSelectedOption(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleResolve}
          disabled={loading || !selectedOption}
          className="flex-1 bg-green-600 text-white font-bold hover:bg-green-500"
        >
          <CheckCircle size={16} className="mr-2" />
          Auswerten
        </Button>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="ghost"
          className="flex-1 border border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <XCircle size={16} className="mr-2" />
          Stornieren
        </Button>
      </div>
    </div>
  );
}
