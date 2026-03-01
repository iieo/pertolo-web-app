'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { placeWager } from '../actions';
import { useBet } from '../bet-provider';
import { Coins } from 'lucide-react';
import toast from 'react-hot-toast';

interface WagerFormProps {
  betId: string;
  options: Array<{ id: string; label: string }>;
  onWagerPlaced: () => void;
}

export function WagerForm({ betId, options, onWagerPlaced }: WagerFormProps) {
  const { balance, refreshBalance } = useBet();
  const [selectedOption, setSelectedOption] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 500, 1000];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOption) {
      toast.error('Select an option');
      return;
    }
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const result = await placeWager(betId, selectedOption, numAmount);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Wager placed!');
      setAmount('');
      await refreshBalance();
      onWagerPlaced();
    } catch {
      toast.error('Failed to place wager');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-semibold text-white/70">Place a Wager</h3>

      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Pick an option" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-gray-900">
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="text-white">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min={1}
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
        />
        <div className="flex gap-2">
          {quickAmounts.map((qa) => (
            <Button
              key={qa}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAmount(String(qa))}
              className="flex-1 border border-white/10 text-white/60 hover:text-amber-400 hover:border-amber-500/30"
            >
              {qa.toLocaleString()}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => balance !== null && setAmount(String(balance))}
            className="flex-1 border border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
          >
            All-in
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !selectedOption || !amount}
        className="w-full bg-amber-500 text-black font-bold hover:bg-amber-400"
      >
        <Coins size={16} className="mr-2" />
        {loading ? 'Placing...' : 'Place Bet'}
      </Button>
    </form>
  );
}
