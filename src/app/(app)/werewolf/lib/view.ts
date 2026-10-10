import {
  Death,
  EngineGame,
  EngineState,
  NightStep,
  Phase,
  SKIP_AFTER_MS,
  Winner,
  canVote,
  eligibleVoters,
  isPack,
  isSkippable,
  judgeAvailable,
  livingWolves,
  packIds,
  playerById,
  sideOf,
  stepActors,
  targetsFor,
  teamOf,
  voteWeight,
  winnerIds,
  whiteWolfMustKill,
  witchVictims,
  withDefaults,
} from './engine';
import { RolesConfig, RolesError, Role, Team, emptyRoles, presetFor, validateRoles } from './roles';

export const STALE_MS = 30_000;
/** Running games allow longer absences (phones lock during discussion). */
export const AWAY_MS_PLAYING = 120_000;

export type GameStatus = 'lobby' | 'playing' | 'finished';

/** Row-level input for building views; mirrors the DB rows without importing the DB. */
export interface ViewSource {
  game: {
    id: string;
    status: GameStatus;
    version: number;
    hostPlayerId: string | null;
    rolesConfig: RolesConfig;
    rolesCustom: boolean;
    state: EngineState | null;
  };
  players: {
    id: string;
    name: string;
    seat: number;
    role: Role | null;
    isAlive: boolean;
    lastSeenAt: Date;
  }[];
  now: number;
}

export interface ViewPlayer {
  id: string;
  name: string;
  seat: number;
  alive: boolean;
  connected: boolean;
  isHost: boolean;
  isMe: boolean;
  /** Public role: dead players, the revealed idiot (always idiot while alive), everyone at the end. */
  role: Role | null;
  /** Revealed idiot: alive but cannot vote. */
  idiotRevealed: boolean;
}

export type Turn =
  | { kind: 'cupid'; targets: string[] }
  | { kind: 'wild_child'; targets: string[] }
  | { kind: 'wanderer'; targets: string[] }
  | { kind: 'protector'; targets: string[]; lastProtectedId: string | null }
  /** Optional: act with targetId null to pass this night. */
  | { kind: 'priest'; targets: string[] }
  | { kind: 'seer'; targets: string[] }
  | { kind: 'wolf_seer'; targets: string[] }
  | { kind: 'fox'; targets: string[] }
  /** Pick exactly two. */
  | { kind: 'detective'; targets: string[] }
  | {
      kind: 'werewolves';
      targets: string[];
      /** Live picks of all wolves in the kill (incl. a white werewolf); targetId null = not picked yet. */
      picks: { wolfId: string; targetId: string | null }[];
      myPick: string | null;
      /** Victims to agree on tonight (2 after the wolf cub died). */
      kills: number;
      /** Victims already agreed on tonight, in order. */
      chosenIds: string[];
    }
  /** Optional: targetId null keeps the kill. */
  | { kind: 'infect_father'; victimIds: string[] }
  | { kind: 'big_bad_wolf'; targets: string[] }
  /** targetId null kills nobody; not allowed when `required` (only he and his pack are left). */
  | { kind: 'white_werewolf'; targets: string[]; required: boolean }
  | { kind: 'serial_killer'; targets: string[] }
  | {
      kind: 'witch';
      /** All wolf victims of the night (pack and big bad wolf). */
      victimIds: string[];
      canHeal: boolean;
      canPoison: boolean;
      poisonTargets: string[];
    }
  | { kind: 'grumpy_grandma'; targets: string[]; lastSilencedId: string | null }
  | { kind: 'piper'; targets: string[]; maxPicks: number }
  | { kind: 'hunter'; targets: string[] };

export type TransformCause = 'infected' | 'cursed' | 'apprentice' | 'wolf_seer';

export interface PrivateInfo {
  role: Role;
  team: Team;
  /** Dealt role when the role changed since the reveal, else null. */
  formerRole: Role | null;
  transformedBy: TransformCause | null;
  /** The pack (wolf team without traitor, plus white werewolf) minus me; set for pack members and the traitor. */
  wolfIds: string[] | null;
  loverId: string | null;
  /** Lovers on different sides win together as the last two. Null when not in love. */
  loversMixed: boolean | null;
  wildChild: { modelId: string | null; converted: boolean } | null;
  seerResults: { round: number; targetId: string; role: Role; team: Team }[] | null;
  /** Kept after the wolf seer turned into a werewolf. */
  wolfSeerResults: { round: number; targetId: string; role: Role }[] | null;
  fox: { results: { round: number; targetId: string; wolf: boolean }[]; powerLost: boolean } | null;
  detectiveResults: { round: number; targetIds: [string, string]; same: boolean }[] | null;
  witch: { heal: boolean; poison: boolean } | null;
  protectorLastId: string | null;
  priest: { used: boolean; blessedId: string | null } | null;
  /** Other sisters or brothers. */
  siblingIds: string[] | null;
  /** All living charmed players; set for the piper and for charmed players. */
  charmedIds: string[] | null;
  beholder: { seerId: string | null; apprenticeId: string | null } | null;
  infectUsed: boolean | null;
  judgeUsed: boolean | null;
}

export interface GameView {
  phase: Phase;
  round: number;
  /** Host only (for narration): the current night step. */
  nightStep: NightStep | null;
  stepStartedAt: number;
  me: PrivateInfo | null;
  /** Set when this player has to act right now (night step or hunter shot). */
  turn: Turn | null;
  reveal: { readyIds: string[]; meReady: boolean } | null;
  /** Hunter currently choosing a target (public, his role is revealed). */
  pendingHunterId: string | null;
  /** Public from the start; his vote counts double while alive. */
  mayorId: string | null;
  /** Day, vote and voteResult: bearGrowl null = no bear tamer alive; silencedId cannot vote today. */
  morning: { bearGrowl: boolean | null; silencedId: string | null } | null;
  announcement: Death[];
  vote: {
    votedIds: string[];
    eligibleIds: string[];
    targets: string[];
    canVote: boolean;
    /** undefined = not voted yet, null = abstained. */
    myVote: string | null | undefined;
    /** Second vote of the day, triggered by the stuttering judge. */
    second: boolean;
    myWeight: number;
  } | null;
  voteResult: {
    /** Weighted (the mayor counts double). */
    tally: { playerId: string; votes: number }[];
    abstained: number;
    eliminatedId: string | null;
    idiotRevealed: boolean;
    /** Tie: the scapegoat died instead (eliminatedId is him). */
    scapegoat: boolean;
    second: boolean;
  } | null;
  /** Only for the stuttering judge: he may trigger a second vote now. */
  judgeAvailable: boolean;
  end: {
    winner: Winner;
    winnerIds: string[];
    lovers: [string, string] | null;
    /** Roles as dealt (players[].role holds the final role). */
    initialRoles: Record<string, Role>;
  } | null;
  /** Host only: time from which skipStep is allowed, null when nothing can be skipped. */
  skipAvailableAt: number | null;
}

export interface LobbyView {
  rolesConfig: RolesConfig;
  rolesCustom: boolean;
  preset: RolesConfig;
  rolesError: RolesError | null;
}

export interface JoinedView {
  joined: true;
  gameId: string;
  version: number;
  serverNow: number;
  status: GameStatus;
  meId: string;
  isHost: boolean;
  hostId: string | null;
  players: ViewPlayer[];
  lobby: LobbyView | null;
  game: GameView | null;
}

export interface NotJoinedView {
  joined: false;
  gameId: string;
  version: number;
  status: GameStatus;
  playerCount: number;
  /** Names whose seat can be taken over right now (offline 30 s in lobby, 120 s once started). */
  rejoinableNames: string[];
  /** In lobby anyone can join; in a running game only rejoin by name. */
  canJoinNew: boolean;
}

export type View = JoinedView | NotJoinedView;

export function isStale(lastSeenAt: Date, now: number) {
  return now - lastSeenAt.getTime() >= STALE_MS;
}

/** Threshold for seat takeover and host handover: 30 s in the lobby, 120 s once started. */
export function isAway(lastSeenAt: Date, now: number, status: GameStatus) {
  return now - lastSeenAt.getTime() >= (status === 'lobby' ? STALE_MS : AWAY_MS_PLAYING);
}

export function toEngineGame(src: ViewSource): EngineGame | null {
  if (!src.game.state) return null;
  return {
    players: src.players.map((p) => ({ id: p.id, seat: p.seat, role: p.role, alive: p.isAlive })),
    state: withDefaults(src.game.state),
  };
}

export function buildNotJoinedView(src: ViewSource): NotJoinedView {
  return {
    joined: false,
    gameId: src.game.id,
    version: src.game.version,
    status: src.game.status,
    playerCount: src.players.length,
    rejoinableNames: src.players
      .filter((p) => isAway(p.lastSeenAt, src.now, src.game.status))
      .map((p) => p.name),
    canJoinNew: src.game.status === 'lobby',
  };
}

export function buildView(src: ViewSource, meId: string): JoinedView {
  const { game, now } = src;
  const engine = toEngineGame(src);
  const isHost = game.hostPlayerId === meId;
  const ended = engine?.state.phase === 'end';

  const players: ViewPlayer[] = [...src.players]
    .sort((a, b) => a.seat - b.seat)
    .map((p) => {
      const idiotRevealed = engine?.state.idiotRevealedId === p.id;
      const publicRole = game.status !== 'lobby' && (ended || !p.isAlive || idiotRevealed);
      return {
        id: p.id,
        name: p.name,
        seat: p.seat,
        alive: p.isAlive,
        connected: !isStale(p.lastSeenAt, now),
        isHost: p.id === game.hostPlayerId,
        isMe: p.id === meId,
        role: !publicRole ? null : idiotRevealed && p.isAlive && !ended ? 'idiot' : p.role,
        idiotRevealed,
      };
    });

  return {
    joined: true,
    gameId: game.id,
    version: game.version,
    serverNow: now,
    status: game.status,
    meId,
    isHost,
    hostId: game.hostPlayerId,
    players,
    lobby:
      game.status === 'lobby'
        ? {
            rolesConfig: { ...emptyRoles(), ...game.rolesConfig },
            rolesCustom: game.rolesCustom,
            preset: presetFor(src.players.length),
            rolesError: validateRoles(game.rolesConfig, src.players.length),
          }
        : null,
    game: engine && game.status !== 'lobby' ? buildGameView(engine, meId, isHost) : null,
  };
}

function buildGameView(engine: EngineGame, meId: string, isHost: boolean): GameView {
  const s = engine.state;
  const me = playerById(engine, meId);
  const votes = s.votes;
  const turn = me ? turnFor(engine, meId) : null;
  // Step timing would leak which roles are still acting; non-actors only see the night start.
  const hideStep = s.phase === 'night' && !turn && !isHost;
  const daytime = s.phase === 'day' || s.phase === 'vote' || s.phase === 'voteResult';

  return {
    phase: s.phase,
    round: s.round,
    nightStep: isHost && s.phase === 'night' && s.night ? s.night.step : null,
    stepStartedAt: hideStep ? s.nightStartedAt : s.stepStartedAt,
    me: me ? privateInfo(engine, meId) : null,
    turn,
    reveal:
      s.phase === 'reveal' ? { readyIds: [...s.ready], meReady: s.ready.includes(meId) } : null,
    pendingHunterId:
      (s.phase === 'day' || s.phase === 'voteResult') && s.pendingHunters.length > 0
        ? s.pendingHunters[0]
        : null,
    mayorId: s.mayorId,
    morning: daytime ? { bearGrowl: s.bearGrowl, silencedId: s.silencedId } : null,
    announcement: s.announcement,
    vote:
      s.phase === 'vote' && votes
        ? {
            votedIds: Object.keys(votes),
            eligibleIds: eligibleVoters(engine).map((p) => p.id),
            targets: targetsFor(engine, 'vote', meId),
            canVote: !!me && canVote(engine, me),
            myVote: meId in votes ? votes[meId] : undefined,
            second: s.secondVote,
            myWeight: voteWeight(engine, meId),
          }
        : null,
    voteResult:
      s.phase === 'voteResult' && s.voteResult
        ? {
            tally: Object.entries(s.voteResult.tally)
              .map(([playerId, count]) => ({ playerId, votes: count }))
              .sort((a, b) => b.votes - a.votes),
            abstained: s.voteResult.abstained,
            eliminatedId: s.voteResult.eliminatedId,
            idiotRevealed: s.voteResult.idiotRevealed,
            scapegoat: s.voteResult.scapegoat,
            second: s.voteResult.second,
          }
        : null,
    judgeAvailable: judgeAvailable(engine, meId),
    end:
      s.phase === 'end' && s.winner
        ? {
            winner: s.winner,
            winnerIds: winnerIds(engine),
            lovers: s.lovers,
            initialRoles: s.initialRoles,
          }
        : null,
    skipAvailableAt: isHost && isSkippable(engine) ? s.stepStartedAt + SKIP_AFTER_MS : null,
  };
}

function transformCause(engine: EngineGame, meId: string, former: Role): TransformCause {
  if (engine.state.infectedId === meId) return 'infected';
  if (former === 'apprentice_seer') return 'apprentice';
  if (former === 'wolf_seer') return 'wolf_seer';
  return 'cursed';
}

function privateInfo(engine: EngineGame, meId: string): PrivateInfo | null {
  const s = engine.state;
  const me = playerById(engine, meId);
  if (!me?.role) return null;
  const role = me.role;
  const team = teamOf(engine, me);
  const dealt = s.initialRoles[meId] ?? role;
  const formerRole = dealt !== role ? dealt : null;
  const lovers = s.lovers;
  const loverId = lovers?.includes(meId) ? (lovers[0] === meId ? lovers[1] : lovers[0]) : null;
  const lover = playerById(engine, loverId);
  const dealtAs = (r: Role) =>
    engine.players.find((p) => (s.initialRoles[p.id] ?? p.role) === r)?.id ?? null;
  const charmedIds = s.charmedIds.filter((id) => playerById(engine, id)?.alive);

  return {
    role,
    team,
    formerRole,
    transformedBy: formerRole ? transformCause(engine, meId, formerRole) : null,
    wolfIds:
      isPack(engine, me) || role === 'traitor' ? packIds(engine).filter((id) => id !== meId) : null,
    loverId,
    loversMixed: lover ? sideOf(engine, lover) !== sideOf(engine, me) : null,
    wildChild:
      role === 'wild_child'
        ? { modelId: s.wildChildModelId, converted: s.wildChildConverted }
        : null,
    seerResults:
      role === 'seer'
        ? s.seerResults
            .filter((r) => (r.seerId ?? meId) === meId)
            .map(({ round, targetId, role: seen, team: seenTeam }) => ({
              round,
              targetId,
              role: seen,
              team: seenTeam,
            }))
        : null,
    wolfSeerResults: role === 'wolf_seer' || dealt === 'wolf_seer' ? s.wolfSeerResults : null,
    fox: role === 'fox' ? { results: s.foxResults, powerLost: s.foxLost } : null,
    detectiveResults: role === 'detective' ? s.detectiveResults : null,
    witch: role === 'witch' ? { heal: s.witchHeal, poison: s.witchPoison } : null,
    protectorLastId: role === 'protector' ? s.protectorLastId : null,
    priest: role === 'priest' ? { used: s.priestUsed, blessedId: s.blessedId } : null,
    siblingIds:
      dealt === 'sisters' || dealt === 'brothers'
        ? engine.players
            .filter((p) => p.id !== meId && (s.initialRoles[p.id] ?? p.role) === dealt)
            .map((p) => p.id)
        : null,
    charmedIds: role === 'piper' || charmedIds.includes(meId) ? charmedIds : null,
    beholder:
      role === 'beholder'
        ? { seerId: dealtAs('seer'), apprenticeId: dealtAs('apprentice_seer') }
        : null,
    infectUsed: role === 'infect_father' ? s.infectUsed : null,
    judgeUsed: role === 'stuttering_judge' ? s.judgeUsed : null,
  };
}

function turnFor(engine: EngineGame, meId: string): Turn | null {
  const s = engine.state;

  if ((s.phase === 'day' || s.phase === 'voteResult') && s.pendingHunters[0] === meId) {
    return { kind: 'hunter', targets: targetsFor(engine, 'hunter', meId) };
  }
  if (s.phase !== 'night' || !s.night) return null;
  const night = s.night;
  const step: NightStep = night.step;
  if (!stepActors(engine, step).some((p) => p.id === meId)) return null;
  const targets = targetsFor(engine, step, meId);

  switch (step) {
    case 'cupid':
    case 'wild_child':
    case 'wanderer':
    case 'priest':
    case 'seer':
    case 'wolf_seer':
    case 'fox':
    case 'detective':
    case 'big_bad_wolf':
    case 'serial_killer':
      return { kind: step, targets };
    case 'white_werewolf':
      return { kind: 'white_werewolf', targets, required: whiteWolfMustKill(engine) };
    case 'protector':
      return { kind: 'protector', targets, lastProtectedId: s.protectorLastId };
    case 'werewolves':
      return {
        kind: 'werewolves',
        targets,
        picks: livingWolves(engine).map((w) => ({
          wolfId: w.id,
          targetId: night.wolfPicks[w.id] ?? null,
        })),
        myPick: night.wolfPicks[meId] ?? null,
        kills: night.wolfKills,
        chosenIds: night.wolfTargets,
      };
    case 'infect_father':
      return { kind: 'infect_father', victimIds: targets };
    case 'witch': {
      const victimIds = witchVictims(engine);
      return {
        kind: 'witch',
        victimIds,
        canHeal: s.witchHeal && victimIds.length > 0,
        canPoison: s.witchPoison,
        poisonTargets: targets,
      };
    }
    case 'grumpy_grandma':
      return { kind: 'grumpy_grandma', targets, lastSilencedId: s.grandmaLastId };
    case 'piper':
      return { kind: 'piper', targets, maxPicks: Math.min(2, targets.length) };
  }
}

/*
 * API contract for the UI
 * =======================
 *
 * Polling: GET /werewolf/[gameId]/state  ->  200 View | 404 { error: 'GAME_NOT_FOUND' }
 *   Accept a response when its `version` >= the version already shown (equal versions may
 *   still carry fresh `connected` flags and `serverNow`). Use `serverNow - Date.now()` as the
 *   clock offset for the skip countdown (`game.skipAvailableAt`).
 *   During `night`, `game.stepStartedAt` is the night's start for anyone not acting and not
 *   host (hides step timing). `connected` = seen within 30 s; seat takeover and host handover
 *   use 30 s in the lobby and 120 s once the game started.
 *
 * Roles (lib/roles.ts): ROLES lists 36 roles; ROLE_INFO[role] = { team: 'village' | 'wolves' |
 *   'solo', max, group? }. Planner groups tiles by team. max null = unlimited (werewolf,
 *   villager); sisters must be 0 or 2, brothers 0 or 3 (`group`), every other role max 1.
 *   MIN_PLAYERS 3, MAX_PLAYERS 20. RolesError: TOO_FEW_PLAYERS, TOO_MANY_PLAYERS,
 *   ROLE_COUNT_MISMATCH, NO_WOLVES (none of werewolf, big_bad_wolf, wolf_cub, infect_father),
 *   TOO_MANY_WOLVES (wolf team without traitor, plus white werewolf, must be < half),
 *   ROLE_LIMIT, GROUP_SIZE (sisters/brothers count), TOO_MANY_SOLOS (more than 3 of
 *   white_werewolf, serial_killer, piper, angel).
 *
 * Roles can change during a game: infected victim and attacked cursed -> 'werewolf', apprentice
 *   seer -> 'seer' when no seer lives, wolf seer -> 'werewolf' when no other wolf lives.
 *   `me.formerRole` / `me.transformedBy` ('infected' | 'cursed' | 'apprentice' | 'wolf_seer')
 *   carry the notice; `end.initialRoles` has the dealt roles.
 *
 * Private info (`game.me`):
 *   wolfIds       pack minus me, for pack members (wolves, wolf seer, converted wild child,
 *                 white werewolf) and for the traitor (wolves never see the traitor).
 *   loverId, loversMixed   only for the two lovers; loversMixed is live and tells whether the
 *                 pair wins together as the last two (different sides; each solo is its own side).
 *   seerResults   role/team as the seer sees it (lycan = werewolf, traitor and unconverted
 *                 cursed = villager), only the current seer's own results.
 *   wolfSeerResults (exact roles, lycan = werewolf), fox { results, powerLost },
 *   detectiveResults { targetIds, same }, priest { used, blessedId }, siblingIds (sisters,
 *   brothers), charmedIds (piper and charmed players), beholder { seerId, apprenticeId }
 *   (dealt roles), infectUsed (infect father), judgeUsed (stuttering judge), witch, wildChild,
 *   protectorLastId. Each is null when it does not apply.
 *
 * Public: `game.mayorId` from the start. `game.morning` during day/vote/voteResult:
 *   bearGrowl (true/false, null = no bear tamer alive) and silencedId (cannot vote today).
 *   `vote.second` / `voteResult.second` mark the judge's second vote (never who triggered it).
 *   `voteResult.tally` is weighted; `voteResult.scapegoat` = tie, the scapegoat died.
 *   `game.judgeAvailable` is true only for the judge while he can trigger the second vote.
 *
 * Turns (`game.turn.kind`) and their action:
 *   cupid -> cupid {targetIds:[a,b]}        wild_child -> wildChild {targetId}
 *   wanderer -> wander {targetId}           protector -> protect {targetId}
 *   priest -> bless {targetId | null}       seer -> see {targetId}
 *   wolf_seer -> wolfSee {targetId}         fox -> fox {targetId}
 *   detective -> detect {targetIds:[a,b]}   werewolves -> wolfPick {targetId} (consensus; when
 *                                           kills = 2 a second round starts after chosenIds[0])
 *   infect_father -> infect {targetId | null} (targetId from victimIds)
 *   big_bad_wolf -> bigBadWolf {targetId}   white_werewolf -> whiteWolf {targetId | null}
 *                                           (null not allowed when `required`: only he and
 *                                           his pack are left; a host skip then kills one)
 *   serial_killer -> serialKill {targetId}  witch -> witch {healId | null, poisonId | null}
 *                                           (healId from victimIds; may include an infected
 *                                           victim, healing them spends the potion only)
 *   grumpy_grandma -> silence {targetId}    piper -> charm {targetIds} (1..maxPicks)
 *   hunter -> hunterShot {targetId}
 *
 * Death causes: wolves (pack, big bad wolf, wanderer at the wrong home), poison, love, vote,
 *   hunter, rust (knight's revenge), serial_killer, white_wolf.
 * Winners (`end.winner`): village, wolves, lovers, angel, piper, white_werewolf,
 *   serial_killer, none. `end.winnerIds` lists the winners. The angel is solo until the first
 *   vote; after it (if not voted out) his team is village, so he wins with the village. His role
 *   stays 'angel'.
 *
 * Server actions (actions.ts) all return Result<T> = { success: true, data } | { success: false, error: code }.
 * Mutations return data { version } unless noted. Common error codes on every action:
 *   INVALID_CODE, GAME_NOT_FOUND, NOT_JOINED, SERVER_ERROR.
 *
 *   createGame(name)                  -> { gameId }     INVALID_NAME
 *   joinGame(gameId, name)            -> { gameId }     INVALID_NAME, NAME_TAKEN, GAME_FULL, GAME_STARTED
 *   setRoles(gameId, config | null)   null = back to preset (auto-follows player count)
 *                                                       NOT_HOST, NOT_LOBBY, INVALID_ROLES
 *   kickPlayer(gameId, playerId)      NOT_HOST, NOT_LOBBY, CANNOT_KICK_SELF, PLAYER_NOT_FOUND
 *   startGame(gameId)                 NOT_HOST, NOT_LOBBY, + RolesError codes
 *   ready(gameId)
 *   act(gameId, action)               night actions and hunterShot, see Turns   INVALID_ACTION
 *   vote(gameId, targetId | null)     null = abstain
 *   judge(gameId)                     stuttering judge in voteResult: second vote starts now
 *   startVote(gameId) / endVote(gameId) / continueGame(gameId) / skipStep(gameId)   (host)
 *   playAgain(gameId)                 NOT_HOST, NOT_FINISHED
 *   leaveGame(gameId)                 -> { left: true }  clears the cookie
 *
 * Engine error codes (ready/act/vote/judge/host game controls): WRONG_PHASE, NOT_YOUR_TURN,
 *   NOT_HOST, DEAD, INVALID_TARGET, REPEAT_PROTECT, POTION_USED, POWER_USED, NO_VICTIM,
 *   CANNOT_VOTE, HUNTER_PENDING, TOO_EARLY, NOTHING_TO_SKIP, NOT_PLAYING.
 *
 * Phase flow: reveal -> night (steps hidden from non-actors) -> day (announcement = night deaths,
 *   maybe hunter turn) -> vote -> voteResult (judge may reopen vote once; host continueGame)
 *   -> night ... -> end. status 'finished' <=> game.phase 'end'.
 */
