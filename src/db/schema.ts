import { TaskContent } from '@/types/task';
import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';

export const gameModesTable = pgTable('drink_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const tasksTable = pgTable('drink_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: json('content').$type<TaskContent>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const gameModeTasksTable = pgTable('drink_task_category_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameModeId: uuid('game_mode_id')
    .notNull()
    .references(() => gameModesTable.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasksTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type GameSettings = {
  players: string[];
  currentGameModeId: string | null;
  currentTaskId: string | null;
};

export const impostorWordsTable = pgTable('impostor_words', {
  id: uuid('id').primaryKey().defaultRandom(),
  word: varchar('word', { length: 100 }).notNull().unique(),
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

// Define relation types for potential use with drizzle queries
export type GameModel = typeof gamesTable.$inferSelect;
export type InsertGameModel = typeof gamesTable.$inferInsert;
export type GameModeModel = typeof gameModesTable.$inferSelect;
export type TaskModel = typeof tasksTable.$inferSelect;
