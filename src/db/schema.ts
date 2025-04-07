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

export const gameModesTable = pgTable('game_modes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const tasksTable = pgTable('tasks', {
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

export const gameModeTasksTable = pgTable('game_mode_tasks', {
  gameModeId: uuid('game_mode_id')
    .notNull()
    .references(() => gameModesTable.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasksTable.id, { onDelete: 'cascade' }),
});

export const gamesTable = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameCode: varchar('game_code', { length: 4 }).unique().notNull(),
  currentModeId: uuid('current_mode_id').references(() => gameModesTable.id, {
    onDelete: 'set null',
  }),
  currentTaskId: uuid('current_task_id').references(() => tasksTable.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const playersTable = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => gamesTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(),
  isHost: boolean('is_host').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define relation types for potential use with drizzle queries
export type Game = typeof gamesTable.$inferSelect;
export type NewGame = typeof gamesTable.$inferInsert;
export type Player = typeof playersTable.$inferSelect;
export type NewPlayer = typeof playersTable.$inferInsert;
export type GameMode = typeof gameModesTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
