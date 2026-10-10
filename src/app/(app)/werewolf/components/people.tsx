'use client';

import type { Death } from '../lib/engine';
import { useRoom } from './room-context';
import { NameList } from './ui';

export function DeathList({ deaths }: { deaths: Death[] }) {
  const { t, name } = useRoom();
  return (
    <ul className="flex flex-col gap-4">
      {deaths.map((d) => (
        <li key={d.playerId}>
          <span className="block text-3xl font-bold wrap-break-word md:text-5xl">
            {name(d.playerId)}
          </span>
          <span className="block text-lg font-semibold md:text-2xl">{t.roles[d.role].name}</span>
          {t.causes[d.cause] && <span className="block text-base">{t.causes[d.cause]}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Public morning news: the bear tamer's bear and the grumpy grandma's pick. */
export function MorningInfo() {
  const { game, t, name } = useRoom();
  const morning = game?.morning;
  if (!morning) return null;
  const lines = [
    morning.bearGrowl === true && t.bearGrowls,
    morning.bearGrowl === false && t.bearQuiet,
    morning.silencedId && t.silencedToday(name(morning.silencedId)),
  ].filter(Boolean) as string[];
  if (lines.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line) => (
        <p key={line} className="text-lg font-semibold md:text-xl">
          {line}
        </p>
      ))}
    </div>
  );
}

/** Public roster: living players, then the dead with their revealed roles. */
export function Roster() {
  const { view, game, t } = useRoom();
  const alive = view.players.filter((p) => p.alive);
  const dead = view.players.filter((p) => !p.alive);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{t.aliveHeading(alive.length)}</h2>
        <NameList>
          {alive.map((p) => {
            const notes = [
              p.id === game?.mayorId && t.roles.mayor.name,
              p.idiotRevealed && p.role && `${t.roles[p.role].name}, ${t.cannotVoteNote}`,
              p.id === game?.morning?.silencedId && t.cannotVoteToday,
            ].filter(Boolean);
            return (
              <li key={p.id}>
                <span className="block text-lg font-semibold wrap-break-word">
                  {p.name}
                  {p.isMe && <span className="font-normal">{` (${t.you})`}</span>}
                </span>
                {notes.length > 0 && <span className="block text-sm">{notes.join(', ')}</span>}
              </li>
            );
          })}
        </NameList>
      </section>
      {dead.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">{t.deadHeading}</h2>
          <NameList>
            {dead.map((p) => (
              <li key={p.id}>
                <span className="block text-lg font-semibold wrap-break-word line-through decoration-2">
                  {p.name}
                </span>
                {p.role && <span className="block text-sm">{t.roles[p.role].name}</span>}
              </li>
            ))}
          </NameList>
        </section>
      )}
    </div>
  );
}
