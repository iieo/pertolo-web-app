import { TaskContent } from '@/types/task';
import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const DrinkTaskCategoryMapping = pgTable('drink_task_category_mapping', {
  id: uuid('id').primaryKey().defaultRandom(),
  gameModeId: uuid('game_mode_id')
    .notNull()
    .references(() => drinkCategoryTable.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .notNull()
    .references(() => drinkTaskTable.id, { onDelete: 'cascade' }),
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
