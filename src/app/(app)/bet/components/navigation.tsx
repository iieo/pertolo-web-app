'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PUBLIC_PATHS } from '../bet-provider';

const navItems = [
  { href: '/bet', label: 'Feed' },
  { href: '/bet/create', label: 'Erstellen' },
  { href: '/bet/leaderboard', label: 'Ränge' },
  { href: '/bet/profile', label: 'Profil' },
];

const linkFocus =
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white';

export function Navigation() {
  const pathname = usePathname();

  if (PUBLIC_PATHS.includes(pathname)) return null;

  const isActive = (href: string) =>
    href === '/bet' ? pathname === '/bet' : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-white/10 bg-black md:block">
        <nav
          aria-label="Wetten"
          className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-8 pr-[max(2rem,env(safe-area-inset-right))] pl-[max(2rem,env(safe-area-inset-left))]"
        >
          <Link
            href="/bet"
            className={cn('-ml-2 rounded-xl px-2 py-2 text-xl font-bold tracking-tight', linkFocus)}
          >
            Pertolo Bets
          </Link>
          <ul className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center rounded-xl px-4 text-base transition-colors duration-150 motion-reduce:transition-none',
                      linkFocus,
                      active
                        ? 'font-semibold text-white underline decoration-2 underline-offset-8'
                        : 'font-medium text-white/60 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <nav
        aria-label="Wetten"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-16 items-center justify-center px-2 text-sm transition-colors duration-150 motion-reduce:transition-none',
                    linkFocus,
                    active ? 'font-semibold text-white' : 'font-medium text-white/50',
                  )}
                >
                  <span
                    className={cn(
                      'border-b-2 pb-1',
                      active ? 'border-white' : 'border-transparent',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
