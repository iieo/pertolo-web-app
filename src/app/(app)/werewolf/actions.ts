'use server';

import { db } from '@/db';
import { werewolfGamesTable, werewolfPlayersTable } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getOrSetSessionId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get('werewolf_session_id');
  if (existing) {
    return existing.value;
  }
  const sessionId = crypto.randomUUID();
  cookieStore.set('werewolf_session_id', sessionId, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  return sessionId;
}

async function notifyGameUpdate(gameId: string) {
  // Trigger SSE for clients listening to this game
  await db.execute(sql`SELECT pg_notify('werewolf_updates', ${gameId})`);
}

export async function createGame(formData: FormData) {
  const sessionId = await getOrSetSessionId();
  const playerName = formData.get('name') as string;

  if (!playerName || playerName.trim() === '') {
    throw new Error('Name is required');
  }

  let gameId = generateRandomCode();
  for (let attempt = 0; attempt < 10; attempt++) {
    const existing = await db.query.werewolfGamesTable.findFirst({
      where: eq(werewolfGamesTable.id, gameId),
    });
    if (!existing) break;
    gameId = generateRandomCode();
    if (attempt === 9) throw new Error('Failed to generate a unique game code');
  }

  await db.insert(werewolfGamesTable).values({
    id: gameId,
    ownerSessionId: sessionId,
    status: 'lobby',
    phase: 'lobby',
    rolesConfig: {
      werwolf: 2,
      dorfbewohner: 0,
      seher: 1,
      hexe: 1,
      amor: 0,
      jaeger: 0,
      heiler: 0,
      blinzelmaedchen: 0,
      dorfdepp: 0,
      der_alte: 0,
      wildes_kind: 0,
    },
  });

  await db.insert(werewolfPlayersTable).values({
    gameId,
    sessionId,
    name: playerName.trim(),
    role: null, // assigned when game starts
    isAlive: true,
    isOwner: true,
  });

  await notifyGameUpdate(gameId);
  redirect(`/werewolf/${gameId}`);
}

export async function joinGame(formData: FormData) {
  const sessionId = await getOrSetSessionId();
  const playerName = formData.get('name') as string;
  const rawGameId = formData.get('gameId') as string;

  if (!playerName || playerName.trim() === '' || !rawGameId || rawGameId.trim() === '') {
    throw new Error('Name and Game Code are required');
  }

  const gameId = rawGameId.trim().toUpperCase();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) {
    throw new Error('Game not found');
  }

  if (game.status !== 'lobby') {
    throw new Error('Game has already started');
  }

  const existingPlayer = await db.query.werewolfPlayersTable.findFirst({
    where: and(
      eq(werewolfPlayersTable.gameId, gameId),
      eq(werewolfPlayersTable.sessionId, sessionId),
    ),
  });

  if (!existingPlayer) {
    await db.insert(werewolfPlayersTable).values({
      gameId,
      sessionId,
      name: playerName.trim(),
      role: null,
      isAlive: true,
      isOwner: false,
    });
    await notifyGameUpdate(gameId);
  }

  redirect(`/werewolf/${gameId}`);
}

export async function startGame(gameId: string, roleConfig: Record<string, number>) {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) throw new Error('Game not found');
  if (game.ownerSessionId !== sessionId) throw new Error('Only the owner can start the game');
  if (game.status !== 'lobby') throw new Error('Game already started');

  const players = await db.query.werewolfPlayersTable.findMany({
    where: eq(werewolfPlayersTable.gameId, gameId),
  });

  if (players.length < 4) {
    throw new Error('Mindestens 4 Spieler werden benötigt');
  }

  // Validate total role count matches player count exactly
  const totalRoles = Object.values(roleConfig).reduce((a, b) => a + b, 0);
  if (totalRoles !== players.length) {
    throw new Error(
      `Rollenanzahl (${totalRoles}) stimmt nicht mit der Spieleranzahl (${players.length}) überein. Bitte Dorfbewohner anpassen.`,
    );
  }

  // Validate werewolf count: at least 1, at most half the players
  const werewolfCount = roleConfig.werwolf || 0;
  if (werewolfCount < 1) {
    throw new Error('Mindestens 1 Werwolf wird benötigt');
  }
  if (werewolfCount > Math.floor(players.length / 2)) {
    throw new Error(
      `Maximal ${Math.floor(players.length / 2)} Werwölfe bei ${players.length} Spielern erlaubt`,
    );
  }

  await db
    .update(werewolfGamesTable)
    .set({ rolesConfig: roleConfig })
    .where(eq(werewolfGamesTable.id, gameId));

  let rolePool: string[] = [];
  for (const [role, count] of Object.entries(roleConfig)) {
    for (let i = 0; i < count; i++) rolePool.push(role);
  }

  // Fisher-Yates shuffle
  for (let i = rolePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rolePool[i], rolePool[j]] = [rolePool[j]!, rolePool[i]!];
  }

  // Assign roles
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (!player) continue;
    await db
      .update(werewolfPlayersTable)
      .set({ role: rolePool[i] || 'dorfbewohner' })
      .where(eq(werewolfPlayersTable.id, player.id));
  }

  await db
    .update(werewolfGamesTable)
    .set({
      status: 'in_progress',
      phase: 'night',
    })
    .where(eq(werewolfGamesTable.id, gameId));

  await notifyGameUpdate(gameId);
}

// Phase cycle: night -> day -> voting -> night -> day -> voting -> ...
function getNextPhase(currentPhase: string): string {
  switch (currentPhase) {
    case 'night':
      return 'day';
    case 'day':
      return 'voting';
    case 'voting':
      return 'night';
    default:
      return 'night';
  }
}

export async function nextPhase(gameId: string) {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) throw new Error('Game not found');
  if (game.ownerSessionId !== sessionId) throw new Error('Only the owner can change phases');

  const newPhase = getNextPhase(game.phase);

  await db
    .update(werewolfGamesTable)
    .set({ phase: newPhase })
    .where(eq(werewolfGamesTable.id, gameId));

  // Reset action targets when entering next phase
  await db
    .update(werewolfPlayersTable)
    .set({ actionTargetId: null, actionType: null })
    .where(eq(werewolfPlayersTable.gameId, gameId));

  await notifyGameUpdate(gameId);
}

export async function submitAction(
  gameId: string,
  targetPlayerId: string,
  actionType?: string,
): Promise<{ peekedRole?: string; peekedName?: string }> {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) throw new Error('Game not found');
  if (game.status !== 'in_progress') throw new Error('Game is not in progress');

  const players = await db.query.werewolfPlayersTable.findMany({
    where: eq(werewolfPlayersTable.gameId, gameId),
  });

  const actor = players.find((p) => p.sessionId === sessionId);
  if (!actor) throw new Error('Player not found');

  const target = players.find((p) => p.id === targetPlayerId);
  if (!target) throw new Error('Target player not found');
  if (!target.isAlive) throw new Error('Target player is not alive');

  const isDeadHunter = !actor.isAlive && actor.role === 'jaeger';

  if (!actor.isAlive && !isDeadHunter) {
    throw new Error('Dead players cannot perform actions');
  }

  // Validate phase-appropriate actions
  const nightRoles = ['werwolf', 'hexe', 'seher', 'heiler', 'amor', 'wildes_kind'];
  if (game.phase === 'night' && !nightRoles.includes(actor.role || '')) {
    throw new Error('Your role cannot act at night');
  }
  if (game.phase === 'voting' && actionType !== 'vote' && !isDeadHunter) {
    throw new Error('Only voting is allowed during the voting phase');
  }
  if (game.phase === 'day' && !isDeadHunter) {
    throw new Error('No actions during the day phase');
  }

  await db
    .update(werewolfPlayersTable)
    .set({ actionTargetId: targetPlayerId, actionType: actionType || null })
    .where(
      and(eq(werewolfPlayersTable.gameId, gameId), eq(werewolfPlayersTable.sessionId, sessionId)),
    );

  await notifyGameUpdate(gameId);

  // Check if all required players have acted — auto-advance if so
  await checkAndAutoAdvance(gameId);

  if (actionType === 'peek') {
    return { peekedRole: target.role ?? undefined, peekedName: target.name };
  }

  return {};
}

async function checkAndAutoAdvance(gameId: string) {
  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });
  if (!game || game.status !== 'in_progress') return;

  const players = await db.query.werewolfPlayersTable.findMany({
    where: eq(werewolfPlayersTable.gameId, gameId),
  });

  const alivePlayers = players.filter((p) => p.isAlive);

  if (game.phase === 'night') {
    // Check if all alive night-role players have submitted actions
    const nightRoles = ['werwolf', 'hexe', 'seher', 'heiler', 'amor', 'wildes_kind'];
    const nightActors = alivePlayers.filter((p) => nightRoles.includes(p.role || ''));
    const allActed = nightActors.every((p) => p.actionTargetId !== null);
    if (!allActed || nightActors.length === 0) return;

    // Resolve night — find werewolf kill target (most voted among werewolves)
    const werewolves = nightActors.filter((p) => p.role === 'werwolf');
    const killVotes: Record<string, number> = {};
    for (const w of werewolves) {
      if (w.actionTargetId) {
        killVotes[w.actionTargetId] = (killVotes[w.actionTargetId] || 0) + 1;
      }
    }

    let werewolfTargetId: string | null = null;
    let maxVotes = 0;
    for (const [targetId, count] of Object.entries(killVotes)) {
      if (count > maxVotes) {
        maxVotes = count;
        werewolfTargetId = targetId;
      }
    }

    // Check if hexe healed the target
    const hexe = nightActors.find((p) => p.role === 'hexe');
    const hexeHealedTarget =
      hexe && hexe.actionType === 'heal' && hexe.actionTargetId === werewolfTargetId;

    // Check if heiler protected the target
    const heiler = nightActors.find((p) => p.role === 'heiler');
    const heilerProtectedTarget =
      heiler && heiler.actionType === 'protect' && heiler.actionTargetId === werewolfTargetId;

    const survived = hexeHealedTarget || heilerProtectedTarget;

    // Eliminate werewolf target if not saved
    if (werewolfTargetId && !survived) {
      await db
        .update(werewolfPlayersTable)
        .set({ isAlive: false })
        .where(
          and(
            eq(werewolfPlayersTable.gameId, gameId),
            eq(werewolfPlayersTable.id, werewolfTargetId),
          ),
        );
    }

    // Hexe kill — separate target dies too
    if (hexe && hexe.actionType === 'kill' && hexe.actionTargetId) {
      await db
        .update(werewolfPlayersTable)
        .set({ isAlive: false })
        .where(
          and(
            eq(werewolfPlayersTable.gameId, gameId),
            eq(werewolfPlayersTable.id, hexe.actionTargetId),
          ),
        );
    }

    // Optimistic concurrency: only advance if still in night phase
    const updated = await db
      .update(werewolfGamesTable)
      .set({ phase: 'day' })
      .where(and(eq(werewolfGamesTable.id, gameId), eq(werewolfGamesTable.phase, 'night')))
      .returning({ id: werewolfGamesTable.id });

    if (updated.length === 0) return; // Another request already advanced

    // Reset action targets
    await db
      .update(werewolfPlayersTable)
      .set({ actionTargetId: null, actionType: null })
      .where(eq(werewolfPlayersTable.gameId, gameId));

    await notifyGameUpdate(gameId);
  } else if (game.phase === 'voting') {
    // Check if all alive players have voted
    const allVoted = alivePlayers.every(
      (p) => p.actionTargetId !== null && p.actionType === 'vote',
    );
    if (!allVoted || alivePlayers.length === 0) return;

    // Count votes per target
    const voteCounts: Record<string, number> = {};
    for (const p of alivePlayers) {
      if (p.actionTargetId) {
        voteCounts[p.actionTargetId] = (voteCounts[p.actionTargetId] || 0) + 1;
      }
    }

    // Find most voted — if tie, nobody dies
    let maxCount = 0;
    let eliminated: string | null = null;
    let isTie = false;
    for (const [targetId, count] of Object.entries(voteCounts)) {
      if (count > maxCount) {
        maxCount = count;
        eliminated = targetId;
        isTie = false;
      } else if (count === maxCount) {
        isTie = true;
      }
    }

    if (!isTie && eliminated) {
      await db
        .update(werewolfPlayersTable)
        .set({ isAlive: false })
        .where(
          and(
            eq(werewolfPlayersTable.gameId, gameId),
            eq(werewolfPlayersTable.id, eliminated),
          ),
        );
    }

    // Optimistic concurrency: only advance if still in voting phase
    const updated = await db
      .update(werewolfGamesTable)
      .set({ phase: 'night' })
      .where(and(eq(werewolfGamesTable.id, gameId), eq(werewolfGamesTable.phase, 'voting')))
      .returning({ id: werewolfGamesTable.id });

    if (updated.length === 0) return;

    // Reset action targets
    await db
      .update(werewolfPlayersTable)
      .set({ actionTargetId: null, actionType: null })
      .where(eq(werewolfPlayersTable.gameId, gameId));

    await notifyGameUpdate(gameId);
  }
}
