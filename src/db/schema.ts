import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const gameStatusEnum = pgEnum('game_status', ['lobby', 'active', 'paused', 'finished']);
export const taskTypeEnum = pgEnum('task_type', [
  'question',
  'challenge',
  'rule',
  'vote',
  'group_task',
  'individual_truth',
  'individual_dare',
]);
export const taskTargetEnum = pgEnum('task_target', [
  'individual',
  'team',
  'all_players',
  'specific_player',
  'gender_based',
  'random_player',
  'previous_player',
  'next_player',
]);

export const gameModes = pgTable('game_modes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  type: taskTypeEnum('type').notNull(),
  target: taskTargetEnum('target').notNull(),
  drinks: integer('drinks').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const gameModeTasks = pgTable('game_mode_tasks', {
  gameModeId: uuid('game_mode_id')
    .notNull()
    .references(() => gameModes.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
});

export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameCode: varchar('game_code', { length: 6 }).unique(),
  status: gameStatusEnum('status').default('lobby').notNull(),
  currentModeId: uuid('current_mode_id').references(() => gameModes.id, { onDelete: 'set null' }),
  currentTaskId: uuid('current_task_id').references(() => tasks.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(),
  isHost: boolean('is_host').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define relation types for potential use with drizzle queries
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type GameMode = typeof gameModes.$inferSelect;
export type Task = typeof tasks.$inferSelect;
