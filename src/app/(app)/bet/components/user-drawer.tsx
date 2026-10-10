'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { PointHistoryChart } from './point-history-chart';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: { userId: string; name: string; pointsBalance: number; rank: number } | null;
}

export function UserDrawer({ open, onClose, user }: UserDrawerProps) {
  if (!user) return null;

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="rounded-t-xl border-white/10 bg-neutral-950 text-white [&>div:first-child]:bg-white/20">
        <div className="mx-auto w-full max-w-2xl pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(2rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))]">
          <DrawerHeader className="px-0 pt-6 pb-0 text-left sm:text-left">
            <DrawerTitle className="text-2xl font-bold tracking-tight wrap-break-word md:text-3xl">
              {user.name}
            </DrawerTitle>
            <DrawerDescription className="text-base text-white/60 tabular-nums">
              Platz {user.rank} · {user.pointsBalance.toLocaleString()} Punkte
            </DrawerDescription>
          </DrawerHeader>
          <h3 className="mt-8 mb-4 text-base font-semibold">Punktestand-Verlauf</h3>
          <PointHistoryChart userId={user.userId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
