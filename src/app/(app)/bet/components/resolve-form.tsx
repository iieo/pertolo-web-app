'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { resolveBet, cancelBet } from '../[betId]/actions';
import { useBet } from '../bet-provider';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  choiceTileClass,
  hintClass,
  primaryButtonClass,
  secondaryButtonClass,
  sectionTitleClass,
} from './styles';

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
      toast.success(
        `Wette beendet! ${result.data.payouts.toLocaleString()} Punkte wurden verteilt`,
      );
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
      toast.success(
        `Wette storniert. ${result.data.refunded.toLocaleString()} Punkte wurden erstattet`,
      );
      await refreshBalance();
      router.refresh();
    } catch {
      toast.error('Stornierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="resolve-heading"
      className="flex flex-col gap-6 border-t border-white/15 pt-12"
    >
      <div>
        <h2 id="resolve-heading" className={sectionTitleClass}>
          Wette auswerten
        </h2>
        <p className={cn(hintClass, 'mt-2')}>
          Nur du als Ersteller siehst diesen Bereich. Wähle die Option, die gewonnen hat.
        </p>
      </div>

      <div role="group" aria-label="Gewinnende Option" className="flex flex-col gap-2">
        {options.map((opt) => {
          const selected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={selected}
              className={choiceTileClass(selected)}
              onClick={() => setSelectedOption(opt.id)}
            >
              <span className="min-w-0 wrap-break-word">{opt.label}</span>
              {selected && <Check size={20} strokeWidth={3} className="shrink-0" aria-hidden />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleResolve}
          disabled={loading || !selectedOption}
          className={primaryButtonClass}
        >
          Auswerten
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className={secondaryButtonClass}
        >
          Stornieren
        </button>
      </div>
    </section>
  );
}
