'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { placeWager } from '../[betId]/actions';
import { useBet } from '../bet-provider';
import toast from 'react-hot-toast';
import {
  choiceTileClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  sectionTitleClass,
  smallButtonClass,
} from './styles';

interface WagerFormProps {
  betId: string;
  totalPool: number;
  options: Array<{ id: string; label: string; totalPoints: number }>;
}

export function WagerForm({ betId, totalPool, options }: WagerFormProps) {
  const router = useRouter();
  const { balance, refreshBalance } = useBet();
  const [selectedOption, setSelectedOption] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 500, 1000];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOption) {
      toast.error('Wähle eine Option');
      return;
    }
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Gib einen gültigen Betrag ein');
      return;
    }

    setLoading(true);
    try {
      const result = await placeWager(betId, selectedOption, numAmount);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Einsatz platziert!');
      setAmount('');
      await refreshBalance();
      router.refresh();
    } catch {
      toast.error('Einsatz fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  const potentialPayout = (() => {
    const opt = options.find((o) => o.id === selectedOption);
    const w = parseInt(amount);
    if (!opt || !w) return 0;
    const newOptionTotal = opt.totalPoints + w;
    const newTotalPool = totalPool + w;
    return Math.floor((w / newOptionTotal) * newTotalPool);
  })();

  return (
    <section aria-labelledby="wager-heading">
      <h2 id="wager-heading" className={sectionTitleClass}>
        Einsatz tätigen
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-8">
        <fieldset className="flex flex-col gap-2">
          <legend className={`${labelClass} mb-4`}>Option</legend>
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
        </fieldset>

        <div className="flex flex-col gap-4">
          <label htmlFor="wager-amount" className={labelClass}>
            Betrag
          </label>
          <input
            id="wager-amount"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Punkte"
            min={1}
            className={`${inputClass} tabular-nums`}
          />
          <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                type="button"
                onClick={() => setAmount(String(qa))}
                className={`${smallButtonClass} tabular-nums`}
              >
                {qa.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => balance !== null && setAmount(String(balance))}
              className={smallButtonClass}
            >
              All-in
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {selectedOption && parseInt(amount) > 0 && (
            <p className="flex items-baseline justify-between gap-4 text-base">
              <span className="text-white/60">Möglicher Gewinn</span>
              <span className="text-lg font-semibold tabular-nums">
                {potentialPayout.toLocaleString()} Punkte
              </span>
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !selectedOption || !amount}
            className={primaryButtonClass}
          >
            {loading ? 'Wird platziert…' : 'Wette platzieren'}
          </button>
        </div>
      </form>
    </section>
  );
}
