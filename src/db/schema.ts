import { TaskContent } from '@/types/task';
import { pgTable, uuid, varchar, text, timestamp, json, boolean } from 'drizzle-orm/pg-core';

export const drinkCategoryTable = pgTable('drink_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const drinkTaskTable = pgTable('drink_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: json('content').$type<TaskContent>().notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => drinkCategoryTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const impostorWordsTable = pgTable('impostor_words', {
  id: uuid('id').primaryKey().defaultRandom(),
  word: varchar('word', { length: 100 }).notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => imposterCategoriesTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const imposterCategoriesTable = pgTable('impostor_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type DrinkCategoryModel = typeof drinkCategoryTable.$inferSelect;
export type DrinkTaskModel = typeof drinkTaskTable.$inferSelect;

export const bluffWordsTable = pgTable('bluff_words', {
  id: uuid('id').primaryKey().defaultRandom(),
  word: varchar('word', { length: 100 }).notNull().unique(),
  pronunciation: varchar('pronunciation', { length: 100 }).notNull(),
  definition: text('definition').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type BluffWordModel = typeof bluffWordsTable.$inferSelect;

export const werewolfGamesTable = pgTable('werewolf_games', {
  id: varchar('id', { length: 20 }).primaryKey(), // Simple join code
  ownerSessionId: varchar('owner_session_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('lobby'), // lobby, in_progress, finished
  phase: varchar('phase', { length: 20 }).notNull().default('lobby'), // lobby, night, day, voting
  rolesConfig: json('roles_config').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const werewolfPlayersTable = pgTable('werewolf_players', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: varchar('game_id', { length: 20 })
    .notNull()
    .references(() => werewolfGamesTable.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }),
  isAlive: boolean('is_alive').default(true).notNull(),
  actionTargetId: uuid('action_target_id'), // Temporarily holds the vote/action target
  actionType: varchar('action_type', { length: 50 }), // Temporarily holds the type of action (e.g. 'heal', 'kill', 'love')
  isOwner: boolean('is_owner').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type WerewolfGameModel = typeof werewolfGamesTable.$inferSelect;
export type WerewolfPlayerModel = typeof werewolfPlayersTable.$inferSelect;

export const murderiOrdersTable = pgTable('murderi_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameId: varchar('game_id', { length: 10 }).notNull(),
  killer: text('killer').notNull(),
  victim: text('victim'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type MurderiOrderModel = typeof murderiOrdersTable.$inferSelect;
