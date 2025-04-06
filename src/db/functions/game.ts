'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { gameModesTable, gamesTable, playersTable } from '../schema';
import { db } from '..';
import { generateGameCode } from '@/util/code';

const CreateGameSchema = z.object({
  hostName: z.string().min(1, { message: 'Host name cannot be empty' }).max(50),
});

const JoinGameSchema = z.object({
  playerName: z.string().min(1, { message: 'Player name cannot be empty' }).max(50),
  gameCode: z.string().length(6, { message: 'Game code must be 6 characters long' }).toUpperCase(),
});

export async function createGame(hostName: string) {
  let gameCode: string;
  let gameExists = true;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    gameCode = generateGameCode();
    // Use aliased table variable with db.select()
    const existingGames = await db
      .select({ id: gamesTable.id })
      .from(gamesTable)
      .where(eq(gamesTable.gameCode, gameCode))
      .limit(1);
    gameExists = existingGames.length > 0;
    attempts++;
    if (attempts >= maxAttempts && gameExists) {
      throw new Error('Failed to generate a unique game code after multiple attempts.');
    }
  } while (gameExists);

  try {
    // Use aliased table variable with db.insert()
    const newGame = await db
      .insert(gamesTable)
      .values({
        gameCode: gameCode,
        status: 'lobby',
      })
      .returning({ id: gamesTable.id });

    const gameId = newGame[0]?.id;
    if (newGame === undefined || newGame.length === 0 || gameId === undefined) {
      throw new Error('Failed to create game.');
    }

    // Use aliased table variable with db.insert()
    await db.insert(playersTable).values({
      gameId: gameId,
      name: hostName,
      isHost: true,
    });
    return { gameCode };
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error('Could not create game.');
  }
}

export async function joinGame(formData: FormData) {
  const validatedFields = JoinGameSchema.safeParse({
    playerName: formData.get('playerName'),
    gameCode: formData.get('gameCode'),
  });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { playerName, gameCode } = validatedFields.data;

  try {
    // Use aliased table variable with db.select()
    const gamesFound = await db
      .select()
      .from(gamesTable)
      .where(eq(gamesTable.gameCode, gameCode))
      .limit(1);

    const game = gamesFound.length > 0 ? gamesFound[0] : null;

    if (!game) {
      return { errors: { gameCode: ['Game not found'] } };
    }

    if (game.status !== 'lobby') {
      return { errors: { gameCode: ['Game is not in lobby state'] } };
    }

    // Use aliased table variable with db.insert()
    await db.insert(playersTable).values({
      gameId: game.id,
      name: playerName,
      isHost: false,
    });

    redirect(`/game/${gameCode}`);
  } catch (error) {
    console.error('Error joining game:', error);
    throw new Error('Could not join game.');
  }
}

export async function getGameData(gameCode: string) {
  // Use aliased table variable with db.select()
  const gamesFound = await db
    .select()
    .from(gamesTable)
    .where(eq(gamesTable.gameCode, gameCode))
    .limit(1);

  const game = gamesFound.length > 0 ? gamesFound[0] : null;

  if (!game) {
    return null;
  }

  // Use aliased table variable with db.select()
  const playersInGame = await db
    .select()
    .from(playersTable)
    .where(eq(playersTable.gameId, game.id));

  return {
    ...game,
    players: playersInGame,
  };
}

export async function getGameModes() {
  // Use aliased table variable with db.select()
  const modes = await db.select().from(gameModesTable);
  return modes;
}

export async function startGame(gameId: string) {
  // Use aliased table variable with db.update()
  await db.update(gamesTable).set({ status: 'active' }).where(eq(gamesTable.id, gameId));
}

export async function selectGameMode(gameId: string, modeId: string) {
  // Use aliased table variable with db.update()
  await db
    .update(gamesTable)
    .set({ currentModeId: modeId, status: 'active' })
    .where(eq(gamesTable.id, gameId));
}
