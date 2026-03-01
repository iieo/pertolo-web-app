'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { resolveBet, cancelBet } from '../actions';
import { useBet } from '../bet-provider';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResolveFormProps {
  betId: string;
  options: Array<{ id: string; label: string }>;
  onResolved: () => void;
}

export function ResolveForm({ betId, options, onResolved }: ResolveFormProps) {
  const { refreshBalance } = useBet();
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResolve() {
    if (!selectedOption) {
      toast.error('Select the winning option');
      return;
    }
    setLoading(true);
    try {
      const result = await resolveBet(betId, selectedOption);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Bet resolved! ${result.data.payouts.toLocaleString()} points distributed`);
      await refreshBalance();
      onResolved();
    } catch {
      toast.error('Failed to resolve');
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
      toast.success(`Bet cancelled. ${result.data.refunded.toLocaleString()} points refunded`);
      await refreshBalance();
      onResolved();
    } catch {
      toast.error('Failed to cancel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
      <h3 className="text-sm font-semibold text-orange-400">Resolve Bet (Owner)</h3>

      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Pick the winner" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-gray-900">
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button
          onClick={handleResolve}
          disabled={loading || !selectedOption}
          className="flex-1 bg-green-600 text-white font-bold hover:bg-green-500"
        >
          <CheckCircle size={16} className="mr-2" />
          Resolve
        </Button>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="ghost"
          className="flex-1 border border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <XCircle size={16} className="mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
