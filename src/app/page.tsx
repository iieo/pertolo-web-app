import type { Viewport } from 'next';
import Link from 'next/link';

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

const INK = '#111111';
const WHITE = '#FFFFFF';

type Tile = {
  href: string;
  title: string;
  description: string;
  bg: string;
  fg: string;
};

// Colors mirror the games' palette.ts. Text colors meet WCAG AA, dark and light tiles alternate.
const GAMES: Tile[] = [
  {
    href: '/200-questions',
    title: '200 Questions',
    description: 'Questions that get everyone talking.',
    bg: '#4338CA',
    fg: WHITE,
  },
  {
    href: '/would-you-rather',
    title: 'Would You Rather',
    description: 'Which one would you pick?',
    bg: '#FFB703',
    fg: INK,
  },
  {
    href: '/heads-up',
    title: 'Heads Up',
    description: 'Guess the word on your forehead.',
    bg: '#0F766E',
    fg: WHITE,
  },
  {
    href: '/hot-takes',
    title: 'Hot Takes',
    description: 'Agree or disagree?',
    bg: '#FB8500',
    fg: INK,
  },
  {
    href: '/hot-potato',
    title: 'Hot Potato',
    description: 'Don’t hold it when it blows.',
    bg: '#D62839',
    fg: WHITE,
  },
  {
    href: '/imposter',
    title: 'Imposter',
    description: 'Find the secret agents.',
    bg: '#4CC9F0',
    fg: INK,
  },
  {
    href: '/drink',
    title: 'Drink',
    description: 'Tasks and dares for the whole group.',
    bg: '#7B2CBF',
    fg: WHITE,
  },
  {
    href: '/bluff',
    title: 'Bluff',
    description: 'Real definition or made up?',
    bg: '#06D6A0',
    fg: INK,
  },
  {
    href: '/werewolf',
    title: 'Werewolf',
    description: 'Find the werewolves among you.',
    bg: '#0077B6',
    fg: WHITE,
  },
  {
    href: '/murderi',
    title: 'Murderi',
    description: 'Get your target before they get you.',
    bg: '#F15BB5',
    fg: INK,
  },
  {
    href: '/bet',
    title: 'Bet',
    description: 'Wager points with friends.',
    bg: '#2D6A4F',
    fg: WHITE,
  },
  {
    href: '/quiz',
    title: 'Daily Maze',
    description: 'Find the hidden path in the dark.',
    bg: '#E76F51',
    fg: INK,
  },
];

const TOOLS: Tile[] = [
  {
    href: '/bco-trainer',
    title: 'Trainer',
    description: 'Train your rhythm reading.',
    bg: '#262626',
    fg: WHITE,
  },
];

const gridClass = 'grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3';

export default function Home() {
  return (
    <div className="min-h-dvh w-full bg-black text-white">
      <main className="mx-auto w-full max-w-6xl pt-[max(3rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-16 pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pt-16 lg:pt-24 lg:pb-24">
        <header>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl">Pertolo</h1>
          <p className="mt-2 text-base text-white/60 sm:mt-4 sm:text-lg">
            Party games to play together on one phone.
          </p>
        </header>

        <nav aria-label="Games" className="mt-12 lg:mt-16">
          <ul className={gridClass}>
            {GAMES.map((game) => (
              <li key={game.href}>
                <GameTile tile={game} />
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="tools-heading" className="mt-12 lg:mt-16">
          <h2 id="tools-heading" className="mb-4 text-base font-semibold text-white/60">
            Tools
          </h2>
          <ul className={gridClass}>
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <GameTile tile={tool} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function GameTile({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className="flex h-full min-h-32 flex-col justify-end gap-2 rounded-xl p-6 outline-none transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:active:scale-100 sm:min-h-48 sm:p-8 lg:min-h-64"
      style={{ backgroundColor: tile.bg, color: tile.fg }}
    >
      <span className="text-3xl font-bold tracking-tight wrap-break-word hyphens-auto lg:text-4xl">
        {tile.title}
      </span>
      <span className="text-base leading-snug">{tile.description}</span>
    </Link>
  );
}
