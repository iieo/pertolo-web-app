import type { Viewport } from 'next';

import { BackLink } from '@/components/game/back-link';

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-black text-white">
      <div className="mx-auto w-full max-w-3xl pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-16 pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] lg:pb-24">
        <nav>
          <BackLink locale="de" label="Zurück zur Startseite" />
        </nav>
        <main className="mt-8 text-base leading-relaxed text-white/80 wrap-break-word sm:mt-16 lg:text-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
