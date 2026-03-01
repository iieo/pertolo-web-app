import { Metadata } from 'next';
import { BetProvider } from './bet-provider';
import { BottomNav } from './components/bottom-nav';

export const metadata: Metadata = {
  title: 'Pertolo — Bet',
  description: 'Social betting with friends',
};

export default function BetLayout({ children }: { children: React.ReactNode }) {
  return (
    <BetProvider>
      <div className="relative min-h-screen bg-gray-950 pb-20">
        {/* Gradient background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-amber-600/15 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-orange-600/15 blur-[150px] delay-500" />
        </div>
        <div className="relative z-10">{children}</div>
        <BottomNav />
      </div>
    </BetProvider>
  );
}
