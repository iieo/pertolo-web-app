import { Metadata } from 'next';
import { BetProvider } from './bet-provider';
import { Navigation } from './components/navigation';

export const metadata: Metadata = {
  title: 'Pertolo — Wetten',
  description: 'Wetten mit Freunden platzieren',
};

export default function BetLayout({ children }: { children: React.ReactNode }) {
  return (
    <BetProvider>
      <div className="relative min-h-screen bg-gray-950 pb-20 md:pb-0">
        {/* Gradient background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-amber-600/15 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-orange-600/15 blur-[150px] delay-500" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl md:flex md:gap-8 md:px-8 md:pt-8">
          <div className="hidden md:block w-64 shrink-0">
            <Navigation />
          </div>
          <main className="flex-1 min-w-0 w-full pb-8">{children}</main>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Navigation />
        </div>
      </div>
    </BetProvider>
  );
}
