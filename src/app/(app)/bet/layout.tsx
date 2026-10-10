import type { Metadata, Viewport } from 'next';
import { BetProvider } from './bet-provider';
import { Navigation } from './components/navigation';

export const metadata: Metadata = {
  title: 'Pertolo Wetten',
  description: 'Wetten mit Freunden platzieren',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Pertolo Wetten' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function BetLayout({ children }: { children: React.ReactNode }) {
  return (
    <BetProvider>
      <div className="min-h-dvh w-full overflow-x-clip bg-black text-white">
        <Navigation />
        <main className="mx-auto w-full max-w-5xl pr-[max(1rem,env(safe-area-inset-right))] pb-[calc(6rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] md:pb-24">
          {children}
        </main>
      </div>
    </BetProvider>
  );
}
