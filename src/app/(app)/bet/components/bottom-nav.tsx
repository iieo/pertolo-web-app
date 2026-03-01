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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl">
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
                isActive ? 'text-amber-400' : 'text-white/40 hover:text-white/70'
              )}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
