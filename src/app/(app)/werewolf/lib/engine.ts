import { ROLE_INFO, Role, Team } from './roles';

export const SKIP_AFTER_MS = 60_000;

export type Phase = 'reveal' | 'night' | 'day' | 'vote' | 'voteResult' | 'end';
export type NightStep =
  | 'cupid'
  | 'wild_child'
  | 'wanderer'
  | 'protector'
  | 'priest'
  | 'seer'
  | 'wolf_seer'
  | 'fox'
  | 'detective'
  | 'werewolves'
  | 'infect_father'
  | 'big_bad_wolf'
  | 'white_werewolf'
  | 'serial_killer'
  | 'witch'
  | 'grumpy_grandma'
  | 'piper';
export type DeathCause =
  | 'wolves'
  | 'poison'
  | 'love'
  | 'vote'
  | 'hunter'
  | 'rust'
  | 'serial_killer'
  | 'white_wolf';
export type Winner =
  | 'village'
  | 'wolves'
  | 'lovers'
  | 'angel'
  | 'piper'
  | 'white_werewolf'
  | 'serial_killer'
  | 'none';

export const NIGHT_STEPS: NightStep[] = [
  'cupid',
  'wild_child',
  'wanderer',
  'protector',
  'priest',
  'seer',
  'wolf_seer',
  'fox',
  'detective',
  'werewolves',
  'infect_father',
  'big_bad_wolf',
  'white_werewolf',
  'serial_killer',
  'witch',
  'grumpy_grandma',
  'piper',
];

export interface EnginePlayer {
  id: string;
  seat: number;
  role: Role | null;
  alive: boolean;
}

export interface Death {
  playerId: string;
  role: Role;
  cause: DeathCause;
}

export interface SeerResult {
  round: number;
  targetId: string;
  role: Role;
  team: Team;
  /** Missing on results from before the apprentice seer existed. */
  seerId?: string;
}

export interface WolfSeerResult {
  round: number;
  targetId: string;
  role: Role;
}

export interface FoxResult {
  round: number;
  targetId: string;
  wolf: boolean;
}

export interface DetectiveResult {
  round: number;
  targetIds: [string, string];
  same: boolean;
}

export interface NightState {
  step: NightStep;
  /** Picks for the current consensus round; reset after each agreed victim. */
  wolfPicks: Record<string, string>;
  wolfTargets: string[];
  /** Victims the pack picks this night: 2 after the wolf cub died, else 1. */
  wolfKills: number;
  infectedId: string | null;
  bigBadTargetId: string | null;
  whiteWolfTargetId: string | null;
  killerTargetId: string | null;
  wandererHostId: string | null;
  protectedId: string | null;
  healedId: string | null;
  poisonedId: string | null;
  silencedId: string | null;
  charmIds: string[];
}

export interface VoteResult {
  tally: Record<string, number>;
  abstained: number;
  eliminatedId: string | null;
  idiotRevealed: boolean;
  /** Tie broken by the scapegoat's death. */
  scapegoat: boolean;
  second: boolean;
}

export interface EngineState {
  phase: Phase;
  /** Night number; the day after night N is day N. */
  round: number;
  stepStartedAt: number;
  nightStartedAt: number;
  ready: string[];
  night: NightState | null;
  lovers: [string, string] | null;
  wildChildModelId: string | null;
  wildChildConverted: boolean;
  protectorLastId: string | null;
  witchHeal: boolean;
  witchPoison: boolean;
  elderHit: boolean;
  idiotRevealedId: string | null;
  seerResults: SeerResult[];
  pendingHunters: string[];
  /** Deaths of the last batch: the night (in day) or the vote (in voteResult), incl. hunter/lover chains. */
  announcement: Death[];
  votes: Record<string, string | null> | null;
  voteResult: VoteResult | null;
  winner: Winner | null;
  /** Roles as dealt; roles can change later (infection, cursed, apprentice, lone wolf seer). */
  initialRoles: Record<string, Role>;
  mayorId: string | null;
  infectUsed: boolean;
  infectedId: string | null;
  wolfCubRevenge: boolean;
  rust: { round: number; seat: number } | null;
  priestUsed: boolean;
  blessedId: string | null;
  foxLost: boolean;
  foxResults: FoxResult[];
  detectiveResults: DetectiveResult[];
  wolfSeerResults: WolfSeerResult[];
  grandmaLastId: string | null;
  silencedId: string | null;
  bearGrowl: boolean | null;
  judgeUsed: boolean;
  votesHeld: number;
  secondVote: boolean;
  charmedIds: string[];
}

export interface EngineGame {
  players: EnginePlayer[];
  state: EngineState;
}

export type EngineAction =
  | { type: 'ready' }
  | { type: 'cupid'; targetIds: [string, string] }
  | { type: 'wildChild'; targetId: string }
  | { type: 'wander'; targetId: string }
  | { type: 'protect'; targetId: string }
  | { type: 'bless'; targetId: string | null }
  | { type: 'see'; targetId: string }
  | { type: 'wolfSee'; targetId: string }
  | { type: 'fox'; targetId: string }
  | { type: 'detect'; targetIds: [string, string] }
  | { type: 'wolfPick'; targetId: string }
  | { type: 'infect'; targetId: string | null }
  | { type: 'bigBadWolf'; targetId: string }
  | { type: 'whiteWolf'; targetId: string | null }
  | { type: 'serialKill'; targetId: string }
  | { type: 'witch'; healId: string | null; poisonId: string | null }
  | { type: 'silence'; targetId: string }
  | { type: 'charm'; targetIds: string[] }
  | { type: 'hunterShot'; targetId: string }
  | { type: 'vote'; targetId: string | null }
  | { type: 'startVote' }
  | { type: 'endVote' }
  | { type: 'judge' }
  | { type: 'skipStep' }
  | { type: 'continue' };

type NightAction = Extract<
  EngineAction,
  {
    type:
      | 'cupid'
      | 'wildChild'
      | 'wander'
      | 'protect'
      | 'bless'
      | 'see'
      | 'wolfSee'
      | 'fox'
      | 'detect'
      | 'wolfPick'
      | 'infect'
      | 'bigBadWolf'
      | 'whiteWolf'
      | 'serialKill'
      | 'witch'
      | 'silence'
      | 'charm';
  }
>;

const ACTION_STEP: Record<NightAction['type'], NightStep> = {
  cupid: 'cupid',
  wildChild: 'wild_child',
  wander: 'wanderer',
  protect: 'protector',
  bless: 'priest',
  see: 'seer',
  wolfSee: 'wolf_seer',
  fox: 'fox',
  detect: 'detective',
  wolfPick: 'werewolves',
  infect: 'infect_father',
  bigBadWolf: 'big_bad_wolf',
  whiteWolf: 'white_werewolf',
  serialKill: 'serial_killer',
  witch: 'witch',
  silence: 'grumpy_grandma',
  charm: 'piper',
};

export type EngineError =
  | 'WRONG_PHASE'
  | 'NOT_YOUR_TURN'
  | 'NOT_HOST'
  | 'DEAD'
  | 'INVALID_TARGET'
  | 'REPEAT_PROTECT'
  | 'POTION_USED'
  | 'POWER_USED'
  | 'NO_VICTIM'
  | 'CANNOT_VOTE'
  | 'HUNTER_PENDING'
  | 'TOO_EARLY'
  | 'NOTHING_TO_SKIP';

export type EngineResult = { ok: true; game: EngineGame } | { ok: false; error: EngineError };

export interface ActionContext {
  actorId: string;
  isHost: boolean;
  now: number;
}

// ─── Queries ────────────────────────────────────────────────────────────────

export function playerById(game: EngineGame, id: string | null | undefined) {
  return id ? game.players.find((p) => p.id === id) : undefined;
}

export function teamOf(game: EngineGame, player: EnginePlayer): Team {
  if (player.role === 'wild_child' && game.state.wildChildConverted) return 'wolves';
  // Voted out in the first vote he has already won; otherwise he plays on with the village.
  if (player.role === 'angel' && game.state.votesHeld > 0) return 'village';
  return player.role ? ROLE_INFO[player.role].team : 'village';
}

/** Win side: each solo player is a side of his own. */
export function sideOf(game: EngineGame, player: EnginePlayer): string {
  const team = teamOf(game, player);
  return team === 'solo' ? `solo:${player.id}` : team;
}

/** Players the wolves see as their pack: wolf team without the traitor, plus the white werewolf. */
export function isPack(game: EngineGame, player: EnginePlayer) {
  if (player.role === 'white_werewolf') return true;
  return teamOf(game, player) === 'wolves' && player.role !== 'traitor';
}

function isWolfKiller(game: EngineGame, player: EnginePlayer) {
  return isPack(game, player) && player.role !== 'wolf_seer';
}

/** Wolf team members who count for parity and the rust: no traitor, no white werewolf. */
function isRealWolf(game: EngineGame, player: EnginePlayer) {
  return teamOf(game, player) === 'wolves' && player.role !== 'traitor';
}

export function alivePlayers(game: EngineGame) {
  return game.players.filter((p) => p.alive);
}

export function packIds(game: EngineGame) {
  return game.players.filter((p) => isPack(game, p)).map((p) => p.id);
}

/** Players taking part in the wolves' kill pick. */
export function livingWolves(game: EngineGame) {
  return alivePlayers(game).filter((p) => isWolfKiller(game, p));
}

export function canVote(game: EngineGame, player: EnginePlayer) {
  const s = game.state;
  return player.alive && s.idiotRevealedId !== player.id && s.silencedId !== player.id;
}

export function voteWeight(game: EngineGame, playerId: string) {
  return playerId === game.state.mayorId ? 2 : 1;
}

/** What fox, bear tamer and detective perceive: lycan reads as wolf, traitor does not. */
export function appearsWolf(game: EngineGame, player: EnginePlayer) {
  if (player.role === 'lycan') return true;
  return isPack(game, player);
}

function seerSees(game: EngineGame, player: EnginePlayer): { role: Role; team: Team } {
  if (player.role === 'lycan') return { role: 'werewolf', team: 'wolves' };
  if (player.role === 'traitor' || player.role === 'cursed') {
    return { role: 'villager', team: 'village' };
  }
  return { role: player.role!, team: teamOf(game, player) };
}

function detectiveSide(game: EngineGame, player: EnginePlayer) {
  if (player.role === 'lycan') return 'wolves';
  if (player.role === 'traitor') return 'village';
  return sideOf(game, player);
}

/** The nearest living players left and right in seat order (one player when only two live). */
export function livingNeighbours(game: EngineGame, player: EnginePlayer): EnginePlayer[] {
  const ring = game.players
    .filter((p) => p.alive || p.id === player.id)
    .sort((a, b) => a.seat - b.seat);
  const i = ring.findIndex((p) => p.id === player.id);
  const n = ring.length;
  if (n < 2) return [];
  const left = ring[(i - 1 + n) % n];
  const right = ring[(i + 1) % n];
  return left.id === right.id ? [left] : [left, right];
}

function firstAliveWithRole(game: EngineGame, role: Role) {
  return game.players.find((p) => p.alive && p.role === role);
}

/**
 * Living player dealt `role`. Used for roles with a public effect (mayor, bear tamer,
 * scapegoat, grumpy grandma), which keep it after an infection so the infection stays secret.
 */
function holderOf(game: EngineGame, role: Role) {
  const initial = game.state.initialRoles;
  return game.players.find(
    (p) => p.alive && (initial[p.id] ? initial[p.id] === role : p.role === role),
  );
}

function wolfHasDied(game: EngineGame) {
  return game.players.some((p) => !p.alive && isRealWolf(game, p));
}

function awayWanderer(game: EngineGame, id: string) {
  return !!game.state.night?.wandererHostId && playerById(game, id)?.role === 'wanderer';
}

/** Wolf victims the witch sees: pack picks (incl. an infected one) and the big bad wolf's, minus an away wanderer. */
export function witchVictims(game: EngineGame): string[] {
  const night = game.state.night;
  if (!night) return [];
  const ids = night.bigBadTargetId
    ? [...night.wolfTargets, night.bigBadTargetId]
    : night.wolfTargets;
  return ids.filter((id) => !awayWanderer(game, id));
}

/** Only the white werewolf and his pack are left: his kill is mandatory so the game can end. */
export function whiteWolfMustKill(game: EngineGame) {
  return alivePlayers(game).every((p) => isPack(game, p));
}

/** Players who must act in a night step. Empty means the step is skipped. */
export function stepActors(game: EngineGame, step: NightStep): EnginePlayer[] {
  const actors = rawStepActors(game, step);
  if (actors.length === 0 || step === 'witch') return actors;
  const minTargets = step === 'cupid' || step === 'detective' ? 2 : 1;
  return targetsFor(game, step, actors[0].id).length >= minTargets ? actors : [];
}

function rawStepActors(game: EngineGame, step: NightStep): EnginePlayer[] {
  const s = game.state;
  const single = (p: EnginePlayer | undefined) => (p ? [p] : []);
  switch (step) {
    case 'cupid':
      return s.round === 1 ? single(firstAliveWithRole(game, 'cupid')) : [];
    case 'wild_child':
      return s.round === 1 ? single(firstAliveWithRole(game, 'wild_child')) : [];
    case 'priest':
      return s.priestUsed ? [] : single(firstAliveWithRole(game, 'priest'));
    case 'fox':
      return s.foxLost ? [] : single(firstAliveWithRole(game, 'fox'));
    case 'werewolves':
      return livingWolves(game);
    case 'infect_father':
      return s.infectUsed ? [] : single(firstAliveWithRole(game, 'infect_father'));
    case 'big_bad_wolf':
      return wolfHasDied(game) ? [] : single(firstAliveWithRole(game, 'big_bad_wolf'));
    case 'white_werewolf':
      return s.round % 2 === 0 ? single(firstAliveWithRole(game, 'white_werewolf')) : [];
    case 'witch':
      return s.witchHeal || s.witchPoison ? single(firstAliveWithRole(game, 'witch')) : [];
    case 'grumpy_grandma':
      return single(holderOf(game, 'grumpy_grandma'));
    case 'wanderer':
    case 'protector':
    case 'seer':
    case 'wolf_seer':
    case 'detective':
    case 'serial_killer':
    case 'piper':
      return single(firstAliveWithRole(game, step));
  }
}

/** Valid targets for a night step, the hunter shot or the vote, from the actor's point of view. */
export function targetsFor(
  game: EngineGame,
  kind: NightStep | 'hunter' | 'vote',
  actorId: string,
): string[] {
  const s = game.state;
  const night = s.night;
  const alive = alivePlayers(game);
  const ids = (list: EnginePlayer[]) => list.map((p) => p.id);
  const others = alive.filter((p) => p.id !== actorId);
  switch (kind) {
    case 'cupid':
    case 'priest':
      return ids(alive);
    case 'protector':
      return ids(alive.filter((p) => p.id !== s.protectorLastId));
    case 'werewolves':
      return ids(alive.filter((p) => !isPack(game, p) && !night?.wolfTargets.includes(p.id)));
    case 'infect_father':
      return (night?.wolfTargets ?? []).filter((id) => {
        const p = playerById(game, id);
        return p?.alive && p.role !== 'serial_killer' && !awayWanderer(game, id);
      });
    case 'big_bad_wolf':
      return ids(
        alive.filter(
          (p) =>
            !isPack(game, p) && !night?.wolfTargets.includes(p.id) && p.id !== night?.infectedId,
        ),
      );
    case 'white_werewolf':
      return ids(others.filter((p) => isPack(game, p)));
    case 'grumpy_grandma':
      return ids(others.filter((p) => p.id !== s.grandmaLastId));
    case 'piper':
      return ids(others.filter((p) => !s.charmedIds.includes(p.id)));
    case 'wild_child':
    case 'wanderer':
    case 'seer':
    case 'wolf_seer':
    case 'fox':
    case 'detective':
    case 'serial_killer':
    case 'witch':
    case 'hunter':
    case 'vote':
      return ids(others);
  }
}

export function eligibleVoters(game: EngineGame) {
  return game.players.filter((p) => canVote(game, p));
}

export function computeWinner(game: EngineGame): Winner | null {
  const alive = alivePlayers(game);
  if (alive.length === 0) return 'none';
  const piper = alive.find((p) => p.role === 'piper');
  if (piper && alive.every((p) => p.id === piper.id || game.state.charmedIds.includes(p.id))) {
    return 'piper';
  }
  const lovers = game.state.lovers;
  if (lovers && alive.length === 2) {
    const [a, b] = lovers.map((id) => playerById(game, id));
    if (a?.alive && b?.alive && sideOf(game, a) !== sideOf(game, b)) return 'lovers';
  }
  const killer = alive.find((p) => p.role === 'serial_killer');
  const whiteWolf = alive.find((p) => p.role === 'white_werewolf');
  if (alive.length === 1 && (whiteWolf || killer)) {
    return whiteWolf ? 'white_werewolf' : 'serial_killer';
  }
  if (killer && alive.length === 2) return 'serial_killer';
  const wolves = alive.filter((p) => isRealWolf(game, p));
  if (wolves.length === 0 && !whiteWolf && !killer) return 'village';
  if (!killer && !whiteWolf && wolves.length >= alive.length - wolves.length) return 'wolves';
  return null;
}

export function winnerIds(game: EngineGame): string[] {
  const winner = game.state.winner;
  switch (winner) {
    case null:
    case 'none':
      return [];
    case 'lovers':
      return game.state.lovers ?? [];
    case 'village':
    case 'wolves':
      return game.players.filter((p) => teamOf(game, p) === winner).map((p) => p.id);
    case 'angel':
    case 'piper':
    case 'white_werewolf':
    case 'serial_killer':
      return game.players.filter((p) => p.role === winner).map((p) => p.id);
  }
}

/** Phases that wait on players and can be skipped by the host when stuck. */
export function isSkippable(game: EngineGame) {
  const { phase, pendingHunters } = game.state;
  return (
    phase === 'reveal' ||
    phase === 'night' ||
    ((phase === 'day' || phase === 'voteResult') && pendingHunters.length > 0)
  );
}

export function canSkip(game: EngineGame, now: number) {
  return isSkippable(game) && now - game.state.stepStartedAt >= SKIP_AFTER_MS;
}

/** Turn the judge can use right now (vote result, alive, unused, no hunter pending). */
export function judgeAvailable(game: EngineGame, playerId: string) {
  const s = game.state;
  const me = playerById(game, playerId);
  return (
    s.phase === 'voteResult' &&
    !s.judgeUsed &&
    s.pendingHunters.length === 0 &&
    !!me?.alive &&
    me.role === 'stuttering_judge'
  );
}

// ─── Setup ──────────────────────────────────────────────────────────────────

export function initialState(now: number): EngineState {
  return {
    phase: 'reveal',
    round: 0,
    stepStartedAt: now,
    nightStartedAt: now,
    ready: [],
    night: null,
    lovers: null,
    wildChildModelId: null,
    wildChildConverted: false,
    protectorLastId: null,
    witchHeal: true,
    witchPoison: true,
    elderHit: false,
    idiotRevealedId: null,
    seerResults: [],
    pendingHunters: [],
    announcement: [],
    votes: null,
    voteResult: null,
    winner: null,
    initialRoles: {},
    mayorId: null,
    infectUsed: false,
    infectedId: null,
    wolfCubRevenge: false,
    rust: null,
    priestUsed: false,
    blessedId: null,
    foxLost: false,
    foxResults: [],
    detectiveResults: [],
    wolfSeerResults: [],
    grandmaLastId: null,
    silencedId: null,
    bearGrowl: null,
    judgeUsed: false,
    votesHeld: 0,
    secondVote: false,
    charmedIds: [],
  };
}

function emptyNight(wolfKills: number): NightState {
  return {
    step: NIGHT_STEPS[0],
    wolfPicks: {},
    wolfTargets: [],
    wolfKills,
    infectedId: null,
    bigBadTargetId: null,
    whiteWolfTargetId: null,
    killerTargetId: null,
    wandererHostId: null,
    protectedId: null,
    healedId: null,
    poisonedId: null,
    silencedId: null,
    charmIds: [],
  };
}

/** Fills fields added after a game was stored (state is jsonb, games may run across deploys). */
export function withDefaults(state: EngineState): EngineState {
  const merged: EngineState = { ...initialState(state.stepStartedAt), ...state };
  if (merged.night) {
    const legacy = merged.night as NightState & { wolfTarget?: string | null; healed?: boolean };
    const wolfTargets = legacy.wolfTargets ?? (legacy.wolfTarget ? [legacy.wolfTarget] : []);
    merged.night = {
      ...emptyNight(1),
      ...legacy,
      wolfTargets,
      healedId: legacy.healedId ?? (legacy.healed ? (wolfTargets[0] ?? null) : null),
    };
  }
  if (merged.voteResult) {
    merged.voteResult = { scapegoat: false, second: false, ...merged.voteResult };
  }
  return merged;
}

/** Assigns `roles` (already shuffled) to players in seat order. */
export function startGame(players: EnginePlayer[], roles: Role[], now: number): EngineGame {
  const sorted = [...players].sort((a, b) => a.seat - b.seat);
  const game: EngineGame = {
    players: sorted.map((p, i) => ({ ...p, role: roles[i], alive: true })),
    state: initialState(now),
  };
  game.state.initialRoles = Object.fromEntries(game.players.map((p) => [p.id, p.role!]));
  game.state.mayorId = game.players.find((p) => p.role === 'mayor')?.id ?? null;
  return game;
}

// ─── Transitions ────────────────────────────────────────────────────────────

function endGame(game: EngineGame, winner: Winner) {
  const s = game.state;
  s.winner = winner;
  s.phase = 'end';
  s.night = null;
  s.votes = null;
}

function startNight(game: EngineGame, now: number) {
  const s = game.state;
  s.phase = 'night';
  s.round += 1;
  s.nightStartedAt = now;
  s.ready = [];
  s.votes = null;
  s.voteResult = null;
  s.announcement = [];
  s.silencedId = null;
  s.bearGrowl = null;
  s.secondVote = false;
  s.night = emptyNight(s.wolfCubRevenge ? 2 : 1);
  s.wolfCubRevenge = false;
  enterStep(game, 0, now);
}

/** Moves to the first step at or after `index` that has actors, or resolves the night. */
function enterStep(game: EngineGame, index: number, now: number) {
  const night = game.state.night!;
  for (let i = index; i < NIGHT_STEPS.length; i++) {
    if (stepActors(game, NIGHT_STEPS[i]).length > 0) {
      night.step = NIGHT_STEPS[i];
      game.state.stepStartedAt = now;
      return;
    }
  }
  resolveNight(game, now);
}

function finishStep(game: EngineGame, now: number) {
  enterStep(game, NIGHT_STEPS.indexOf(game.state.night!.step) + 1, now);
}

type AttackKind = 'wolves' | 'wanderer' | 'white_wolf' | 'serial_killer' | 'poison';

const ATTACK_CAUSE: Record<AttackKind, DeathCause> = {
  wolves: 'wolves',
  wanderer: 'wolves',
  white_wolf: 'white_wolf',
  serial_killer: 'serial_killer',
  poison: 'poison',
};

function resolveNight(game: EngineGame, now: number) {
  const s = game.state;
  const night = s.night!;
  const hunterAlive = !!firstAliveWithRole(game, 'hunter');
  const wolfVictims = night.bigBadTargetId
    ? [...night.wolfTargets, night.bigBadTargetId]
    : night.wolfTargets;
  const attacks: { id: string; kind: AttackKind }[] = wolfVictims
    .filter((id) => id !== night.infectedId)
    .map((id) => ({ id, kind: 'wolves' }));

  const wanderer = firstAliveWithRole(game, 'wanderer');
  const host = playerById(game, night.wandererHostId);
  if (wanderer && host) {
    const visited = wolfVictims;
    if (isPack(game, host) || visited.includes(host.id)) {
      attacks.push({ id: wanderer.id, kind: 'wanderer' });
    }
  }
  if (night.whiteWolfTargetId) attacks.push({ id: night.whiteWolfTargetId, kind: 'white_wolf' });
  if (night.killerTargetId) attacks.push({ id: night.killerTargetId, kind: 'serial_killer' });
  if (night.poisonedId) attacks.push({ id: night.poisonedId, kind: 'poison' });

  const kills: { id: string; cause: DeathCause }[] = [];
  const dying = new Set<string>();
  for (const { id, kind } of attacks) {
    const target = playerById(game, id);
    if (!target?.alive || dying.has(id)) continue;
    const wolfAttack = kind === 'wolves';
    if (wolfAttack) {
      if (target.role === 'serial_killer') continue;
      if (target.role === 'red_riding_hood' && hunterAlive) continue;
      if (target.role === 'wanderer' && night.wandererHostId) continue;
    }
    if (kind !== 'poison' && id === night.protectedId) continue;
    if (wolfAttack && id === night.healedId) continue;
    if (s.blessedId === id) {
      s.blessedId = null;
      continue;
    }
    if (wolfAttack && target.role === 'cursed') {
      target.role = 'werewolf';
      continue;
    }
    if (wolfAttack && target.role === 'elder' && !s.elderHit) {
      s.elderHit = true;
      continue;
    }
    dying.add(id);
    kills.push({ id, cause: ATTACK_CAUSE[kind] });
  }

  if (s.rust && s.rust.round === s.round) {
    const seat = s.rust.seat;
    const wolves = alivePlayers(game)
      .filter((p) => isRealWolf(game, p))
      .sort((a, b) => a.seat - b.seat);
    const rusted = wolves.find((p) => p.seat > seat) ?? wolves[0];
    if (rusted && !dying.has(rusted.id)) kills.push({ id: rusted.id, cause: 'rust' });
    s.rust = null;
  }

  const infected = playerById(game, night.infectedId);
  if (infected?.alive && !dying.has(infected.id)) {
    infected.role = 'werewolf';
    s.infectedId = infected.id;
  }
  for (const id of night.charmIds) {
    if (!s.charmedIds.includes(id)) s.charmedIds.push(id);
  }

  s.protectorLastId = night.protectedId;
  s.grandmaLastId = night.silencedId;
  s.silencedId = night.silencedId;
  s.night = null;
  s.phase = 'day';
  s.stepStartedAt = now;
  s.announcement = [];
  applyDeaths(game, kills);

  const tamer = holderOf(game, 'bear_tamer');
  s.bearGrowl = tamer
    ? appearsWolf(game, tamer) || livingNeighbours(game, tamer).some((p) => appearsWolf(game, p))
    : null;
}

/** Role changes that follow deaths or conversions: wild child, apprentice seer, lone wolf seer. */
function updateRoles(game: EngineGame) {
  const s = game.state;
  const wildChild = game.players.find((p) => p.role === 'wild_child');
  const model = playerById(game, s.wildChildModelId);
  if (wildChild?.alive && model && !model.alive) s.wildChildConverted = true;

  const seerDied = game.players.some(
    (p) => !p.alive && (s.initialRoles[p.id] ?? p.role) === 'seer',
  );
  if (seerDied && !firstAliveWithRole(game, 'seer')) {
    const apprentice = firstAliveWithRole(game, 'apprentice_seer');
    if (apprentice) apprentice.role = 'seer';
  }

  const wolfSeer = firstAliveWithRole(game, 'wolf_seer');
  if (
    wolfSeer &&
    !alivePlayers(game).some(
      (p) => p.id !== wolfSeer.id && isRealWolf(game, p) && p.role !== 'wolf_seer',
    )
  ) {
    wolfSeer.role = 'werewolf';
  }
}

/**
 * Kills players with lover chains, queues hunters, updates changing roles and
 * runs the win check. The win check waits while a hunter still has to shoot,
 * because his shot can change the outcome.
 */
function applyDeaths(game: EngineGame, kills: { id: string; cause: DeathCause }[]) {
  const s = game.state;
  const queue = [...kills];
  while (queue.length > 0) {
    const { id, cause } = queue.shift()!;
    const player = playerById(game, id);
    if (!player?.alive || !player.role) continue;
    player.alive = false;
    s.announcement.push({ playerId: id, role: player.role, cause });
    if (player.role === 'hunter') s.pendingHunters.push(id);
    if (player.role === 'wolf_cub') s.wolfCubRevenge = true;
    if (player.role === 'knight' && cause === 'wolves') {
      s.rust = { round: s.round + 1, seat: player.seat };
    }
    if (s.lovers?.includes(id)) {
      const other = s.lovers[0] === id ? s.lovers[1] : s.lovers[0];
      queue.push({ id: other, cause: 'love' });
    }
  }

  updateRoles(game);

  s.pendingHunters = s.pendingHunters.filter((id) => targetsFor(game, 'hunter', id).length > 0);
  if (s.pendingHunters.length > 0) return;

  const winner = computeWinner(game);
  if (winner) endGame(game, winner);
}

function openVote(game: EngineGame, now: number) {
  const s = game.state;
  s.phase = 'vote';
  s.votes = {};
  s.voteResult = null;
  s.stepStartedAt = now;
  if (allVoted(game)) resolveVote(game, now);
}

function resolveVote(game: EngineGame, now: number) {
  const s = game.state;
  const tally: Record<string, number> = {};
  let abstained = 0;
  for (const [voterId, target] of Object.entries(s.votes ?? {})) {
    if (target) tally[target] = (tally[target] ?? 0) + voteWeight(game, voterId);
    else abstained += 1;
  }
  const max = Math.max(0, ...Object.values(tally));
  const top = Object.keys(tally).filter((id) => tally[id] === max);
  let eliminatedId = max > 0 && top.length === 1 ? top[0] : null;
  let scapegoat = false;
  if (max > 0 && top.length > 1) {
    const goat = holderOf(game, 'scapegoat');
    if (goat) {
      eliminatedId = goat.id;
      scapegoat = true;
    }
  }
  const firstVote = s.votesHeld === 0;
  s.votesHeld += 1;

  s.votes = null;
  s.phase = 'voteResult';
  s.stepStartedAt = now;
  s.announcement = [];
  s.voteResult = {
    tally,
    abstained,
    eliminatedId,
    idiotRevealed: false,
    scapegoat,
    second: s.secondVote,
  };

  const eliminated = playerById(game, eliminatedId);
  if (!eliminated) return;
  if (eliminated.role === 'idiot' && !scapegoat && s.idiotRevealedId !== eliminated.id) {
    s.idiotRevealedId = eliminated.id;
    s.voteResult.idiotRevealed = true;
    return;
  }
  applyDeaths(game, [{ id: eliminated.id, cause: 'vote' }]);
  if (firstVote && eliminated.role === 'angel') {
    s.pendingHunters = [];
    endGame(game, 'angel');
  }
}

function allVoted(game: EngineGame) {
  const votes = game.state.votes ?? {};
  return eligibleVoters(game).every((p) => p.id in votes);
}

function majorityWolfTarget(night: NightState): string | null {
  const counts: Record<string, number> = {};
  for (const t of Object.values(night.wolfPicks)) counts[t] = (counts[t] ?? 0) + 1;
  const max = Math.max(0, ...Object.values(counts));
  const top = Object.keys(counts).filter((id) => counts[id] === max);
  return max > 0 && top.length === 1 ? top[0] : null;
}

// ─── Actions ────────────────────────────────────────────────────────────────

export function applyAction(
  input: EngineGame,
  ctx: ActionContext,
  action: EngineAction,
): EngineResult {
  const game = structuredClone(input);
  const error = run(game, ctx, action);
  return error ? { ok: false, error } : { ok: true, game };
}

function run(game: EngineGame, ctx: ActionContext, action: EngineAction): EngineError | null {
  const s = game.state;
  const { now } = ctx;
  const actor = playerById(game, ctx.actorId);
  if (s.phase === 'end') return 'WRONG_PHASE';

  switch (action.type) {
    case 'ready': {
      if (s.phase !== 'reveal') return 'WRONG_PHASE';
      if (!actor?.alive) return 'DEAD';
      if (!s.ready.includes(actor.id)) s.ready.push(actor.id);
      if (alivePlayers(game).every((p) => s.ready.includes(p.id))) startNight(game, now);
      return null;
    }

    case 'hunterShot': {
      if (s.phase !== 'day' && s.phase !== 'voteResult') return 'WRONG_PHASE';
      if (s.pendingHunters[0] !== ctx.actorId) return 'NOT_YOUR_TURN';
      if (!targetsFor(game, 'hunter', ctx.actorId).includes(action.targetId)) {
        return 'INVALID_TARGET';
      }
      s.pendingHunters.shift();
      s.stepStartedAt = now;
      applyDeaths(game, [{ id: action.targetId, cause: 'hunter' }]);
      return null;
    }

    case 'vote': {
      if (s.phase !== 'vote' || !s.votes) return 'WRONG_PHASE';
      if (!actor?.alive) return 'DEAD';
      if (!canVote(game, actor)) return 'CANNOT_VOTE';
      if (
        action.targetId !== null &&
        !targetsFor(game, 'vote', actor.id).includes(action.targetId)
      ) {
        return 'INVALID_TARGET';
      }
      s.votes[actor.id] = action.targetId;
      if (allVoted(game)) resolveVote(game, now);
      return null;
    }

    case 'startVote': {
      if (!ctx.isHost) return 'NOT_HOST';
      if (s.phase !== 'day') return 'WRONG_PHASE';
      if (s.pendingHunters.length > 0) return 'HUNTER_PENDING';
      openVote(game, now);
      return null;
    }

    case 'endVote': {
      if (!ctx.isHost) return 'NOT_HOST';
      if (s.phase !== 'vote') return 'WRONG_PHASE';
      resolveVote(game, now);
      return null;
    }

    case 'judge': {
      if (s.phase !== 'voteResult') return 'WRONG_PHASE';
      if (!actor?.alive) return 'DEAD';
      if (actor.role !== 'stuttering_judge') return 'NOT_YOUR_TURN';
      if (s.judgeUsed) return 'POWER_USED';
      if (s.pendingHunters.length > 0) return 'HUNTER_PENDING';
      s.judgeUsed = true;
      s.secondVote = true;
      openVote(game, now);
      return null;
    }

    case 'continue': {
      if (!ctx.isHost) return 'NOT_HOST';
      if (s.phase !== 'voteResult') return 'WRONG_PHASE';
      if (s.pendingHunters.length > 0) return 'HUNTER_PENDING';
      startNight(game, now);
      return null;
    }

    case 'skipStep':
      return skipStep(game, ctx);

    default:
      return nightAction(game, ctx, action);
  }
}

function skipStep(game: EngineGame, ctx: ActionContext): EngineError | null {
  const s = game.state;
  if (!ctx.isHost) return 'NOT_HOST';
  if (!isSkippable(game)) return 'NOTHING_TO_SKIP';
  if (!canSkip(game, ctx.now)) return 'TOO_EARLY';

  if (s.phase === 'reveal') {
    startNight(game, ctx.now);
  } else if (s.phase === 'night') {
    const night = s.night!;
    if (night.step === 'werewolves') {
      const target = majorityWolfTarget(night);
      if (target) night.wolfTargets.push(target);
      night.wolfPicks = {};
    }
    if (night.step === 'white_werewolf' && whiteWolfMustKill(game)) {
      const actor = stepActors(game, 'white_werewolf')[0];
      const targets = actor ? targetsFor(game, 'white_werewolf', actor.id) : [];
      if (targets.length > 0) {
        night.whiteWolfTargetId = targets[Math.floor(Math.random() * targets.length)];
      }
    }
    finishStep(game, ctx.now);
  } else {
    s.pendingHunters.shift();
    s.stepStartedAt = ctx.now;
    applyDeaths(game, []);
  }
  return null;
}

function distinct(ids: string[]) {
  return new Set(ids).size === ids.length;
}

function nightAction(
  game: EngineGame,
  ctx: ActionContext,
  action: NightAction,
): EngineError | null {
  const s = game.state;
  const night = s.night;
  if (s.phase !== 'night' || !night) return 'WRONG_PHASE';
  const actor = playerById(game, ctx.actorId);
  if (!actor?.alive) return 'DEAD';

  const step = ACTION_STEP[action.type];
  if (night.step !== step || !stepActors(game, step).some((p) => p.id === actor.id)) {
    return 'NOT_YOUR_TURN';
  }
  const targets = targetsFor(game, step, actor.id);
  const valid = (id: string | null) => id === null || targets.includes(id);
  const now = ctx.now;

  switch (action.type) {
    case 'cupid': {
      const [a, b] = action.targetIds;
      if (a === b || !targets.includes(a) || !targets.includes(b)) return 'INVALID_TARGET';
      s.lovers = [a, b];
      break;
    }
    case 'wildChild':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      s.wildChildModelId = action.targetId;
      break;
    case 'wander':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.wandererHostId = action.targetId;
      break;
    case 'protect':
      if (action.targetId === s.protectorLastId) return 'REPEAT_PROTECT';
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.protectedId = action.targetId;
      break;
    case 'bless':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      if (action.targetId !== null) {
        s.priestUsed = true;
        s.blessedId = action.targetId;
      }
      break;
    case 'see': {
      const target = playerById(game, action.targetId);
      if (!target?.role || !targets.includes(target.id)) return 'INVALID_TARGET';
      s.seerResults.push({
        round: s.round,
        targetId: target.id,
        ...seerSees(game, target),
        seerId: actor.id,
      });
      break;
    }
    case 'wolfSee': {
      const target = playerById(game, action.targetId);
      if (!target?.role || !targets.includes(target.id)) return 'INVALID_TARGET';
      s.wolfSeerResults.push({
        round: s.round,
        targetId: target.id,
        role: target.role === 'lycan' ? 'werewolf' : target.role,
      });
      break;
    }
    case 'fox': {
      const target = playerById(game, action.targetId);
      if (!target || !targets.includes(target.id)) return 'INVALID_TARGET';
      const wolf = [target, ...livingNeighbours(game, target)].some((p) => appearsWolf(game, p));
      s.foxResults.push({ round: s.round, targetId: target.id, wolf });
      if (!wolf) s.foxLost = true;
      break;
    }
    case 'detect': {
      const [a, b] = action.targetIds.map((id) => playerById(game, id));
      if (!a || !b || a.id === b.id || !targets.includes(a.id) || !targets.includes(b.id)) {
        return 'INVALID_TARGET';
      }
      s.detectiveResults.push({
        round: s.round,
        targetIds: [a.id, b.id],
        same: detectiveSide(game, a) === detectiveSide(game, b),
      });
      break;
    }
    case 'wolfPick': {
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.wolfPicks[actor.id] = action.targetId;
      if (!livingWolves(game).every((w) => night.wolfPicks[w.id] === action.targetId)) return null;
      night.wolfTargets.push(action.targetId);
      night.wolfPicks = {};
      if (
        night.wolfTargets.length < night.wolfKills &&
        targetsFor(game, 'werewolves', actor.id).length > 0
      ) {
        s.stepStartedAt = now;
        return null;
      }
      break;
    }
    case 'infect':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      if (action.targetId !== null) {
        s.infectUsed = true;
        night.infectedId = action.targetId;
      }
      break;
    case 'bigBadWolf':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.bigBadTargetId = action.targetId;
      break;
    case 'whiteWolf':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      if (action.targetId === null && whiteWolfMustKill(game)) return 'INVALID_TARGET';
      night.whiteWolfTargetId = action.targetId;
      break;
    case 'serialKill':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.killerTargetId = action.targetId;
      break;
    case 'witch': {
      const victims = witchVictims(game);
      if (action.healId !== null) {
        if (!s.witchHeal) return 'POTION_USED';
        if (victims.length === 0) return 'NO_VICTIM';
        if (!victims.includes(action.healId)) return 'INVALID_TARGET';
      }
      if (action.poisonId !== null) {
        if (!s.witchPoison) return 'POTION_USED';
        if (!targets.includes(action.poisonId)) return 'INVALID_TARGET';
      }
      if (action.healId !== null) {
        s.witchHeal = false;
        night.healedId = action.healId;
      }
      if (action.poisonId !== null) {
        s.witchPoison = false;
        night.poisonedId = action.poisonId;
      }
      break;
    }
    case 'silence':
      if (!valid(action.targetId)) return 'INVALID_TARGET';
      night.silencedId = action.targetId;
      break;
    case 'charm': {
      const ids = action.targetIds;
      if (
        ids.length < 1 ||
        ids.length > 2 ||
        !distinct(ids) ||
        !ids.every((id) => targets.includes(id))
      ) {
        return 'INVALID_TARGET';
      }
      night.charmIds = [...ids];
      break;
    }
  }
  finishStep(game, now);
  return null;
}
