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

  const gameId = generateRandomCode();

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

  // Validate at least 1 werewolf
  if (!roleConfig.werwolf || roleConfig.werwolf < 1) {
    throw new Error('Mindestens 1 Werwolf wird benötigt');
  }

  // Validate at least 1 dorfbewohner
  if (!roleConfig.dorfbewohner || roleConfig.dorfbewohner < 1) {
    throw new Error('Mindestens 1 Dorfbewohner wird benötigt');
  }

  await db
    .update(werewolfGamesTable)
    .set({ rolesConfig: roleConfig })
    .where(eq(werewolfGamesTable.id, gameId));

  let rolePool: string[] = [];
  for (const [role, count] of Object.entries(roleConfig)) {
    for (let i = 0; i < count; i++) rolePool.push(role);
  }

  // Shuffle
  rolePool = rolePool.sort(() => Math.random() - 0.5);

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

export async function confirmVote(gameId: string, eliminatedPlayerId: string | null) {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) throw new Error('Game not found');
  if (game.ownerSessionId !== sessionId) throw new Error('Unauthorized');
  if (game.phase !== 'voting') throw new Error('Nur in der Abstimmungsphase möglich');

  // If a player was chosen, eliminate them
  if (eliminatedPlayerId) {
    await db
      .update(werewolfPlayersTable)
      .set({ isAlive: false })
      .where(
        and(
          eq(werewolfPlayersTable.gameId, gameId),
          eq(werewolfPlayersTable.id, eliminatedPlayerId),
        ),
      );
  }

  // Move to next phase (night)
  await db
    .update(werewolfGamesTable)
    .set({ phase: 'night' })
    .where(eq(werewolfGamesTable.id, gameId));

  // Reset action targets
  await db
    .update(werewolfPlayersTable)
    .set({ actionTargetId: null, actionType: null })
    .where(eq(werewolfPlayersTable.gameId, gameId));

  await notifyGameUpdate(gameId);
}

export async function submitAction(gameId: string, targetPlayerId: string, actionType?: string) {
  const sessionId = await getOrSetSessionId();

  await db
    .update(werewolfPlayersTable)
    .set({ actionTargetId: targetPlayerId, actionType: actionType || null })
    .where(
      and(eq(werewolfPlayersTable.gameId, gameId), eq(werewolfPlayersTable.sessionId, sessionId)),
    );

  await notifyGameUpdate(gameId);
}

export async function eliminatePlayer(gameId: string, playerId: string) {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game || game.ownerSessionId !== sessionId) throw new Error('Unauthorized');

  await db
    .update(werewolfPlayersTable)
    .set({ isAlive: false })
    .where(and(eq(werewolfPlayersTable.gameId, gameId), eq(werewolfPlayersTable.id, playerId)));

  await notifyGameUpdate(gameId);
}
