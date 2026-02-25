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
  await db.execute(sql`NOTIFY werewolf_updates, ${gameId}`);
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
      seher: 1,
      hexe: 1,
      amor: 0,
      jaeger: 0,
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

export async function startGame(gameId: string, roleConfigOverride?: Record<string, number>) {
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

  // Role assignment
  const config = roleConfigOverride || (game.rolesConfig as any);

  if (roleConfigOverride) {
    await db
      .update(werewolfGamesTable)
      .set({ rolesConfig: config })
      .where(eq(werewolfGamesTable.id, gameId));
  }

  let rolePool: string[] = [];
  for (let i = 0; i < (config.werwolf || 0); i++) rolePool.push('werwolf');
  for (let i = 0; i < (config.seher || 0); i++) rolePool.push('seher');
  for (let i = 0; i < (config.hexe || 0); i++) rolePool.push('hexe');
  for (let i = 0; i < (config.jaeger || 0); i++) rolePool.push('jaeger');
  for (let i = 0; i < (config.amor || 0); i++) rolePool.push('amor');
  for (let i = 0; i < (config.heiler || 0); i++) rolePool.push('heiler');
  for (let i = 0; i < (config.blinzelmaedchen || 0); i++) rolePool.push('blinzelmaedchen');
  for (let i = 0; i < (config.dorfdepp || 0); i++) rolePool.push('dorfdepp');
  for (let i = 0; i < (config.der_alte || 0); i++) rolePool.push('der_alte');
  for (let i = 0; i < (config.wildes_kind || 0); i++) rolePool.push('wildes_kind');

  // Fill the rest with dorfbewohner
  while (rolePool.length < players.length) {
    rolePool.push('dorfbewohner');
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

export async function nextPhase(gameId: string, targetPhase: string) {
  const sessionId = await getOrSetSessionId();

  const game = await db.query.werewolfGamesTable.findFirst({
    where: eq(werewolfGamesTable.id, gameId),
  });

  if (!game) throw new Error('Game not found');
  if (game.ownerSessionId !== sessionId) throw new Error('Only the owner can change phases');

  await db
    .update(werewolfGamesTable)
    .set({ phase: targetPhase })
    .where(eq(werewolfGamesTable.id, gameId));

  // Reset action targets when entering next phase
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
