'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

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
const GROUPS = [
  {
    id: 1,
    task: 'Schwurbler',
    emoji: '🕵️‍♂️',
    description:
      'Entwerft eure eigenen Verschwörungstheorien und inszeniert diese anschließend in einem packenden Theaterstück. Sucht euch eine Mahlzeit aus, die entweder geholt oder selbst gekocht werden soll.',
    colorA: '#f97316',
    colorB: '#ef4444',
  },
  {
    id: 2,
    task: 'Mallehit',
    emoji: '🏝️',
    description: 'Erstellt einen Mallehit (am besten mit einem Drohnen-Musikvideo)',
    colorA: '#a855f7',
    colorB: '#3b82f6',
  },
  {
    id: 3,
    task: 'Saufi',
    emoji: '🍻',
    description: 'Ihr kennt euren Task!',
    colorA: '#ec4899',
    colorB: '#d946ef',
  },
  {
    id: 4,
    task: 'Minigames',
    emoji: '🎯',
    description:
      'Erstellt ein cooles Quiz für die Gruppe. Bereitet Minispiele wie auf einem Jahrmarkt vor welche die anderen danach absolvieren müssen.',
    colorA: '#eab308',
    colorB: '#f97316',
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
  Tom: 3
};

// Pseudo-random-looking cycle order for the fast spin phase (22 frames)
const FAST_CYCLE = [0, 2, 3, 1, 3, 2, 0, 2, 3, 0, 1, 2, 0, 3, 1, 2, 0, 2, 3, 1, 0, 2];

// Confetti particles configuration
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: `${3 + i * 5.5}%`,
  delay: `${((i * 0.11) % 0.7).toFixed(2)}s`,
  color: [
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#a855f7',
    '#ec4899',
    '#06b6d4',
    '#f43f5e',
    '#84cc16',
  ][i % 9],
  size: `${6 + (i % 4) * 3}px`,
  duration: `${(1.1 + (i % 3) * 0.35).toFixed(2)}s`,
}));

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

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          12%  { transform: translateX(-6px) rotate(-1.2deg); }
          25%  { transform: translateX(6px)  rotate(1.2deg); }
          37%  { transform: translateX(-5px) rotate(-0.6deg); }
          50%  { transform: translateX(5px)  rotate(0.6deg); }
          62%  { transform: translateX(-3px) rotate(-0.8deg); }
          75%  { transform: translateX(3px)  rotate(0.8deg); }
          87%  { transform: translateX(-1px) rotate(-0.3deg); }
        }
        @keyframes pop-in {
          0%   { transform: scale(0.35) translateY(24px); opacity: 0; }
          60%  { transform: scale(1.07) translateY(-5px); opacity: 1; }
          80%  { transform: scale(0.96) translateY(2px); }
          100% { transform: scale(1)    translateY(0);   opacity: 1; }
        }
        @keyframes card-enter {
          0%   { transform: scaleY(0.65) translateY(-10px); opacity: 0; }
          100% { transform: scaleY(1)    translateY(0);     opacity: 1; }
        }
        @keyframes float-confetti {
          0%   { transform: translateY(0)     scale(1)   rotate(0deg);   opacity: 1; }
          100% { transform: translateY(-200px) scale(0.2) rotate(720deg); opacity: 0; }
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.06); }
        }
        .shake-anim   { animation: shake 0.32s linear infinite; }
        .pop-in       { animation: pop-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .card-enter   { animation: card-enter 0.14s ease-out forwards; }
        .float-conf   { animation: float-confetti var(--dur, 1.2s) ease-out var(--delay, 0s) both; }
        .glow-breathe { animation: glow-breathe 1.1s ease-in-out infinite; }
      `}</style>

      <main className="relative min-h-[100dvh] bg-black overflow-hidden">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-[130px]" />
          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[-15%] h-80 w-80 rounded-full bg-fuchsia-600/15 blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-md px-4 pb-24 pt-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="mb-3 text-5xl">🎯</p>
            <h1 className="text-3xl font-black tracking-tight text-white">Gruppenspiele</h1>
            <p className="mt-2 text-sm text-gray-400">
              Tippe deinen Namen und erfahre deine Aufgabe!
            </p>
          </div>

          {/* Player grid */}
          <div className="grid grid-cols-2 gap-3">
            {PLAYERS.map((player) => {
              const groupId = claimed[player];
              const group = groupId !== undefined ? GROUPS.find((g) => g.id === groupId) : null;
              const isClaimed = group !== null && group !== undefined;

              return (
                <button
                  key={player}
                  onClick={() => handlePlayerClick(player)}
                  disabled={isClaimed || phase !== 'select'}
                  style={
                    isClaimed && group
                      ? {
                        background: `linear-gradient(135deg, ${group.colorA}28, ${group.colorB}28)`,
                        borderColor: `${group.colorA}70`,
                      }
                      : undefined
                  }
                  className={[
                    'relative flex h-[76px] select-none flex-col items-center justify-center gap-0.5 rounded-2xl border font-semibold text-[15px] transition-all duration-200',
                    isClaimed
                      ? 'cursor-default'
                      : 'border-[#2a2a2a] bg-[#111] text-white active:scale-95 hover:border-purple-500/40 hover:bg-[#1a1a1a]',
                  ].join(' ')}
                >
                  {isClaimed && group ? (
                    <>
                      <span className="text-2xl leading-none">{group.emoji}</span>
                      <span className="text-sm font-bold leading-none text-white">{player}</span>
                      <span className="text-[10px] font-medium leading-none text-white/50">
                        {group.task}
                      </span>
                    </>
                  ) : (
                    <span>{player}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-screen overlay */}
        {(phase === 'spinning' || phase === 'revealed') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-6 backdrop-blur-md">
            {/* ── Spinning phase ── */}
            {phase === 'spinning' && (
              <div className="flex w-full max-w-xs flex-col items-center gap-6">
                <p className="animate-pulse text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  wird ausgelost…
                </p>

                {/* Slot card */}
                <div className="shake-anim relative w-full">
                  {/* Ambient glow */}
                  <div
                    className="glow-breathe absolute inset-0 -z-10 rounded-3xl blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${displayGroup.colorA}, ${displayGroup.colorB})`,
                    }}
                  />
                  <div
                    key={frameKey}
                    className="card-enter w-full overflow-hidden rounded-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${displayGroup.colorA}, ${displayGroup.colorB})`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3 py-12">
                      <span className="text-7xl leading-none">{displayGroup.emoji}</span>
                      <span className="text-2xl font-black tracking-tight text-white">
                        {displayGroup.task}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spinning dots indicator */}
                <div className="flex gap-1.5">
                  {GROUPS.map((g, i) => (
                    <div
                      key={g.id}
                      className="h-2 w-2 rounded-full transition-all duration-100"
                      style={{
                        backgroundColor: i === displayIdx ? displayGroup.colorA : '#333',
                        transform: i === displayIdx ? 'scale(1.4)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-500">{selectedPlayer} · wird zugewiesen…</p>
              </div>
            )}

            {/* ── Revealed phase ── */}
            {phase === 'revealed' && revealedGroup && (
              <div className="relative flex w-full max-w-xs flex-col items-center gap-5">
                {/* Confetti particles */}
                {CONFETTI.map((p, i) => (
                  <div
                    key={i}
                    className="float-conf pointer-events-none absolute bottom-12 rounded-full"
                    style={
                      {
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        '--dur': p.duration,
                        '--delay': p.delay,
                      } as React.CSSProperties
                    }
                  />
                ))}

                <p className="text-sm font-bold tracking-wide text-gray-300">
                  <span className="text-white">{selectedPlayer}</span>, du bist in…
                </p>

                {/* Result card */}
                <div
                  className="pop-in relative w-full overflow-hidden rounded-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${revealedGroup.colorA}, ${revealedGroup.colorB})`,
                    boxShadow: `0 0 80px 20px ${revealedGroup.colorA}55`,
                  }}
                >
                  <div className="flex flex-col items-center gap-4 p-8">
                    <span className="text-8xl leading-none">{revealedGroup.emoji}</span>
                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                        Eure Aufgabe
                      </p>
                      <p className="mt-1 text-3xl font-black text-white">{revealedGroup.task}</p>
                    </div>
                    <div className="h-px w-full bg-white/20" />
                    <p className="text-center text-sm leading-relaxed text-white/80">
                      {revealedGroup.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="h-14 w-full rounded-2xl bg-white text-base font-black text-black transition-transform active:scale-95"
                >
                  Los geht&apos;s! 🎉
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
