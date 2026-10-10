'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const INK = '#111111';
const WHITE = '#FFFFFF';

const PLAYERS = [
  'Bäda',
  'Cici',
  'Laura',
  'Jakob',
  'Lars',
  'Leo',
  'Loui',
  'Riedl',
  'Sammer',
  'Steff',
  'Tania',
  'Tom',
  'Alex',
  'Johanna',
];

// Text colors meet WCAG AA against their background.
const GROUPS = [
  {
    id: 1,
    task: 'Schwurbler',
    description:
      'Entwerft eure eigenen Verschwörungstheorien und inszeniert diese anschließend in einem packenden Theaterstück. Sucht euch eine Mahlzeit aus, die entweder geholt oder selbst gekocht werden soll.',
    bg: '#D62839',
    fg: WHITE,
  },
  {
    id: 2,
    task: 'Mallehit',
    description: 'Erstellt einen Mallehit (am besten mit einem Drohnen-Musikvideo)',
    bg: '#FFB703',
    fg: INK,
  },
  {
    id: 3,
    task: 'Saufi',
    description: 'Ihr kennt euren Task!',
    bg: '#4338CA',
    fg: WHITE,
  },
  {
    id: 4,
    task: 'Minigames',
    description:
      'Erstellt ein cooles Quiz für die Gruppe. Bereitet Minispiele wie auf einem Jahrmarkt vor welche die anderen danach absolvieren müssen.',
    bg: '#06D6A0',
    fg: INK,
  },
];

const ASSIGNMENTS: Record<string, number> = {
  Alex: 1,
  Bäda: 3,
  Cici: 3,
  Jakob: 2,
  Johanna: 2,
  Lars: 2,
  Laura: 1,
  Leo: 1,
  Loui: 4,
  Riedl: 2,
  Sammer: 3,
  Steff: 4,
  Tania: 4,
  Tom: 3,
};

// Pseudo-random-looking cycle order for the fast spin phase (22 frames)
const FAST_CYCLE = [0, 2, 3, 1, 3, 2, 0, 2, 3, 0, 1, 2, 0, 3, 1, 2, 0, 2, 3, 1, 0, 2];

type Phase = 'select' | 'spinning' | 'revealed';

export default function GroupGamesPage() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [frameKey, setFrameKey] = useState(0);
  const [claimed, setClaimed] = useState<Record<string, number>>({});

  const handlePlayerClick = (player: string) => {
    if (player in claimed || phase !== 'select') return;

    setSelectedPlayer(player);
    setPhase('spinning');
    setDisplayIdx(0);
    setFrameKey(0);

    const targetId = ASSIGNMENTS[player]!;
    const targetIdx = GROUPS.findIndex((g) => g.id === targetId);

    // Slow-down frames: deliberately avoid showing target until the very last step
    const s0 = (targetIdx + 2) % 5;
    const s1 = (targetIdx + 4) % 5;
    const s2 = (targetIdx + 1) % 5;
    const s3 = (targetIdx + 3) % 5;

    // Schedule: [delayMs, groupIdx]
    const schedule: Array<[number, number]> = [
      ...FAST_CYCLE.map((idx): [number, number] => [80, idx]),
      [200, s0],
      [300, s1],
      [460, s2],
      [680, s3],
      [1050, targetIdx], // final landing
    ];

    let cumulative = 0;
    schedule.forEach(([delay, idx], i) => {
      cumulative += delay;
      const isLast = i === schedule.length - 1;
      setTimeout(() => {
        setDisplayIdx(idx);
        setFrameKey((k) => k + 1);
        if (isLast) {
          setTimeout(() => {
            setPhase('revealed');
            setClaimed((prev) => {
              const next: Record<string, number> = { ...prev };
              next[player] = targetId;
              return next;
            });
          }, 500);
        }
      }, cumulative);
    });
  };

  const handleDismiss = () => {
    setPhase('select');
    setSelectedPlayer(null);
  };

  const displayGroup = GROUPS[displayIdx] ?? GROUPS[0]!;
  const revealedGroup = selectedPlayer
    ? GROUPS.find((g) => g.id === ASSIGNMENTS[selectedPlayer])
    : null;

  const revealedBg = phase === 'revealed' ? revealedGroup?.bg : undefined;

  useEffect(() => {
    if (!revealedBg) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    const prevColor = meta?.content;
    if (meta) meta.content = revealedBg;
    return () => {
      html.style.overflow = prevOverflow;
      if (meta && prevColor !== undefined) meta.content = prevColor;
    };
  }, [revealedBg]);

  return (
    <>
      <style>{`
        @keyframes group-card-enter {
          from { opacity: 0.4; }
          to   { opacity: 1; }
        }
        @keyframes group-reveal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .group-card-enter { animation: group-card-enter 0.12s ease-out both; }
          .group-reveal     { animation: group-reveal 0.3s ease-out both; }
        }
      `}</style>

      <div className="min-h-dvh w-full bg-black pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] text-white sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))]">
        <main className="mx-auto w-full max-w-lg pt-[max(3rem,env(safe-area-inset-top))] pb-16 sm:max-w-2xl sm:pt-16 lg:max-w-5xl lg:pt-24 lg:pb-24">
          <header>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gruppenspiele
            </h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              Tippe deinen Namen und erfahre deine Aufgabe!
            </p>
          </header>

          <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:mt-16 lg:grid-cols-4">
            {PLAYERS.map((player) => {
              const groupId = claimed[player];
              const group = groupId !== undefined ? GROUPS.find((g) => g.id === groupId) : null;
              const isClaimed = group !== null && group !== undefined;

              return (
                <li key={player}>
                  <button
                    type="button"
                    onClick={() => handlePlayerClick(player)}
                    disabled={isClaimed || phase !== 'select'}
                    aria-label={isClaimed && group ? `${player}: ${group.task}` : player}
                    style={
                      isClaimed && group
                        ? { backgroundColor: group.bg, color: group.fg }
                        : undefined
                    }
                    className={[
                      'flex min-h-20 w-full flex-col items-start justify-end gap-1 rounded-xl p-4 text-left outline-none transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:min-h-24',
                      isClaimed
                        ? 'cursor-default'
                        : 'bg-white/10 text-white hover:bg-white/15 disabled:cursor-default',
                    ].join(' ')}
                  >
                    <span className="text-lg font-semibold wrap-break-word hyphens-auto">
                      {player}
                    </span>
                    {isClaimed && group && (
                      <span className="text-sm font-medium">{group.task}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </main>
      </div>

      {phase === 'spinning' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPlayer} wird zugewiesen`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black pt-[env(safe-area-inset-top)] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom)] pl-[max(1.5rem,env(safe-area-inset-left))] text-white"
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <p className="text-base text-white/60">
              <span className="font-semibold text-white">{selectedPlayer}</span> wird ausgelost…
            </p>
            <div
              key={frameKey}
              className="group-card-enter flex min-h-48 w-full items-end rounded-xl p-6"
              style={{ backgroundColor: displayGroup.bg, color: displayGroup.fg }}
              aria-hidden
            >
              <span className="text-3xl font-bold tracking-tight wrap-break-word">
                {displayGroup.task}
              </span>
            </div>
          </div>
        </div>
      )}

      {phase === 'revealed' && revealedGroup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-reveal-title"
          className="fixed inset-0 z-50 overflow-y-auto pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))]"
          style={{ backgroundColor: revealedGroup.bg, color: revealedGroup.fg }}
        >
          <div className="group-reveal mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-12 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] lg:max-w-2xl">
            <div className="flex flex-col gap-4">
              <p className="text-lg font-medium">{selectedPlayer}, du bist in…</p>
              <h2
                id="group-reveal-title"
                className="text-5xl font-bold tracking-tight wrap-break-word hyphens-auto sm:text-6xl lg:text-8xl"
              >
                {revealedGroup.task}
              </h2>
              <p className="mt-4 text-lg leading-relaxed lg:text-xl">{revealedGroup.description}</p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={handleDismiss}
              className="flex min-h-14 w-full items-center justify-center rounded-xl px-6 text-base font-semibold outline-none transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none sm:w-auto sm:self-start sm:px-12"
              style={{ backgroundColor: revealedGroup.fg, color: revealedGroup.bg }}
            >
              Los geht&apos;s!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
