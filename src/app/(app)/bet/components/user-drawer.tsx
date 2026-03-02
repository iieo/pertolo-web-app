'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { PointHistoryChart } from './point-history-chart';
import { Coins, Trophy } from 'lucide-react';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: { userId: string; name: string; pointsBalance: number; rank: number } | null;
}

export function UserDrawer({ open, onClose, user }: UserDrawerProps) {
  if (!user) return null;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="border-white/10 bg-gray-950">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-bold">{user.name}</div>
              <div className="flex items-center gap-3 text-sm font-normal text-white/50">
                <span className="flex items-center gap-1">
                  <Trophy size={12} />#{user.rank}
                </span>
                <span className="flex items-center gap-1">
                  <Coins size={12} />
                  {user.pointsBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <h4 className="mb-2 text-xs font-semibold text-white/50">Punktestand-Verlauf</h4>
          <PointHistoryChart userId={user.userId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
