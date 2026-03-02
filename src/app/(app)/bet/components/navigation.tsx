'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List, PlusCircle, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/bet', label: 'Feed', icon: List },
  { href: '/bet/create', label: 'Create', icon: PlusCircle },
  { href: '/bet/leaderboard', label: 'Ranks', icon: Trophy },
  { href: '/bet/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/bet' ? pathname === '/bet' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-1.5 text-xs font-medium transition-colors',
                  isActive ? 'text-amber-400' : 'text-white/40 hover:text-white/70',
                )}
              >
                <item.icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation (Side) */}
      <nav className="hidden sticky top-8 md:flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 px-2">
          <h2 className="text-xl font-extrabold text-white">Pertolo Bets</h2>
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === '/bet' ? pathname === '/bet' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all',
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
              )}
            >
              <item.icon size={20} className={cn(isActive ? 'text-black' : 'text-white/60')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
