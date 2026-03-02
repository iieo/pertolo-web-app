'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getMyBalance, checkLoginBonus } from './actions';
import toast from 'react-hot-toast';

interface BetContextType {
  balance: number | null;
  refreshBalance: () => Promise<void>;
}

const BetContext = createContext<BetContextType | null>(null);

export function BetProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);

  const refreshBalance = useCallback(async () => {
    const result = await getMyBalance();
    if (result.success) {
      setBalance(result.data);
    }
  }, []);

  useEffect(() => {
    refreshBalance();

    // Check login bonus on mount
    checkLoginBonus().then((result) => {
      if (result.success && result.data.awarded) {
        toast.success(`Willkommen zurück! +${result.data.amount} Punkte`);
        refreshBalance();
      }
    });
  }, [refreshBalance]);

  return <BetContext.Provider value={{ balance, refreshBalance }}>{children}</BetContext.Provider>;
}

export function useBet() {
  const context = useContext(BetContext);
  if (!context) {
    throw new Error('useBet must be used within a BetProvider');
  }
  return context;
}
