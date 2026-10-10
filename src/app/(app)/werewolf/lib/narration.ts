import type { Dictionary } from '../i18n';
import type { NightStep, Phase, Winner } from './engine';
import type { Role } from './roles';
import type { JoinedView } from './view';

export type NarrationKey =
  | 'reveal'
  | 'night-falls'
  | `step-${NightStep}-wake`
  | `step-${NightStep}-sleep`
  | 'day-breaks'
  | 'no-deaths'
  | `death-${Role}`
  | 'death'
  | `vote-out-${Role}`
  | 'vote-out'
  | 'scapegoat'
  | 'idiot-revealed'
  | 'hunter-choosing'
  | 'silenced'
  | 'bear-growls'
  | 'bear-quiet'
  | 'tie'
  | 'no-votes'
  | 'vote-starts'
  | 'second-vote-starts'
  | `game-over-${Winner}`;

export interface NarrationLine {
  /** Names the pre-generated audio file. */
  key: NarrationKey;
  /** Fallback for browser speech when the audio file is missing. */
  text: string;
  /** Wake and sleep calls: dropped while still queued when newer lines arrive. */
  droppable: boolean;
}

const keysOf = <K extends string>(record: Record<K, unknown>) => Object.keys(record) as K[];

/** Every line the narrator can say, with its text in the dictionary's language. */
export function narrationLines(t: Dictionary): Map<NarrationKey, string> {
  const s = t.speech;
  const lines = new Map<NarrationKey, string>([
    ['reveal', s.reveal],
    ['night-falls', s.nightFalls],
  ]);
  for (const step of keysOf(s.steps)) {
    lines.set(`step-${step}-wake`, s.steps[step].wake);
    lines.set(`step-${step}-sleep`, s.steps[step].sleep);
  }
  lines.set('day-breaks', s.dayBreaks);
  lines.set('no-deaths', s.noDeaths);
  for (const role of keysOf(s.who)) lines.set(`death-${role}`, s.death(s.who[role]));
  lines.set('death', s.deathUnknown);
  for (const role of keysOf(s.who)) lines.set(`vote-out-${role}`, s.voteOut(s.who[role]));
  lines.set('vote-out', s.voteOutUnknown);
  lines.set('scapegoat', s.scapegoat);
  lines.set('idiot-revealed', s.idiotRevealed);
  lines.set('hunter-choosing', s.hunterChoosing);
  lines.set('silenced', s.silenced);
  lines.set('bear-growls', s.bearGrowls);
  lines.set('bear-quiet', s.bearQuiet);
  lines.set('tie', s.tie);
  lines.set('no-votes', s.noVotes);
  lines.set('vote-starts', s.voteStarts);
  lines.set('second-vote-starts', s.secondVoteStarts);
  for (const winner of keysOf(s.gameOver)) lines.set(`game-over-${winner}`, s.gameOver[winner]);
  return lines;
}

const cache = new WeakMap<Dictionary, Map<NarrationKey, string>>();

function linesFor(t: Dictionary) {
  let lines = cache.get(t);
  if (!lines) {
    lines = narrationLines(t);
    cache.set(t, lines);
  }
  return lines;
}

export interface NarrationSnapshot {
  phase: Phase | null;
  round: number;
  step: NightStep | null;
  hunterId: string | null;
  deadIds: string[];
}

export function snapshotOf(view: JoinedView): NarrationSnapshot {
  const game = view.status === 'lobby' ? null : view.game;
  return {
    phase: game?.phase ?? null,
    round: game?.round ?? 0,
    step: game?.nightStep ?? null,
    hunterId: game?.pendingHunterId ?? null,
    deadIds: view.players.filter((p) => !p.alive).map((p) => p.id),
  };
}

/**
 * What the host's device says when moving from `prev` to the current view. Only public
 * information and never names: phase changes, the called night role, deaths with their public
 * role, vote results and the winner. Without `prev` (first load) only the running night step is
 * called.
 */
export function narrate(
  prev: NarrationSnapshot | null,
  view: JoinedView,
  t: Dictionary,
): { lines: NarrationLine[]; next: NarrationSnapshot } {
  const next = snapshotOf(view);
  const lines: NarrationLine[] = [];
  const texts = linesFor(t);
  const say = (key: NarrationKey, droppable = false) =>
    lines.push({ key, text: texts.get(key) ?? '', droppable });
  const game = view.game;

  if (!prev || !game || next.phase === null) {
    if (!prev && next.phase === 'night' && next.step) say(`step-${next.step}-wake`, true);
    return { lines, next };
  }

  const roleOf = (id: string) =>
    game.announcement.find((d) => d.playerId === id)?.role ??
    view.players.find((p) => p.id === id)?.role ??
    null;

  const unspoken = next.deadIds.filter((id) => !prev.deadIds.includes(id));
  const sayDeaths = () => {
    for (const id of unspoken.splice(0)) {
      const role = roleOf(id);
      say(role ? `death-${role}` : 'death');
    }
  };

  const changed = prev.phase !== next.phase || prev.round !== next.round;
  const stepChanged = changed || prev.step !== next.step;

  if (prev.phase === 'night' && prev.step && stepChanged) say(`step-${prev.step}-sleep`, true);

  if (changed) {
    switch (next.phase) {
      case 'reveal':
        say('reveal');
        break;
      case 'night':
        say('night-falls');
        break;
      case 'day': {
        say('day-breaks');
        if (unspoken.length === 0) say('no-deaths');
        sayDeaths();
        const morning = game.morning;
        if (morning?.bearGrowl === true) say('bear-growls');
        if (morning?.bearGrowl === false) say('bear-quiet');
        if (morning?.silencedId) say('silenced');
        break;
      }
      case 'vote':
        say(game.vote?.second ? 'second-vote-starts' : 'vote-starts');
        break;
      case 'voteResult': {
        const result = game.voteResult;
        if (!result) break;
        const out = result.eliminatedId;
        if (out && result.idiotRevealed) {
          say('idiot-revealed');
        } else if (out) {
          const role = roleOf(out);
          if (result.scapegoat) say('scapegoat');
          else say(role ? `vote-out-${role}` : 'vote-out');
          const i = unspoken.indexOf(out);
          if (i >= 0) unspoken.splice(i, 1);
        } else {
          say(result.tally.length === 0 ? 'no-votes' : 'tie');
        }
        break;
      }
    }
  }

  if (next.phase === 'night' && next.step && stepChanged) say(`step-${next.step}-wake`, true);

  sayDeaths();
  if (next.hunterId && next.hunterId !== prev.hunterId) say('hunter-choosing');
  if (changed && next.phase === 'end' && game.end) say(`game-over-${game.end.winner}`);

  return { lines, next };
}
