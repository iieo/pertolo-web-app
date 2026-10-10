import { TaskContent } from '@/types/task';
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  json,
  boolean,
  integer,
  doublePrecision,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';

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

export const twoHundredQuestionCategoryEnum = pgEnum('two_hundred_question_category', [
  'normal',
  'friendly',
  'coworkers',
  'interactive',
  'crazy',
  'party',
  'roast',
  'exposed',
  'future',
  'deep',
  'sexual',
]);

export const twoHundredQuestionsTable = pgTable('two_hundred_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull().unique(),
  questionEn: text('question_en'),
  category: twoHundredQuestionCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type TwoHundredQuestionModel = typeof twoHundredQuestionsTable.$inferSelect;
export type TwoHundredQuestionCategory = (typeof twoHundredQuestionCategoryEnum.enumValues)[number];

export const wouldYouRatherCategoryEnum = pgEnum('would_you_rather_category', [
  'normal',
  'funny',
  'gross',
  'deep',
  'crazy',
  'party',
  'coworkers',
  'dilemma',
  'sexual',
]);

export const wouldYouRatherTable = pgTable(
  'would_you_rather',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    optionA: text('option_a').notNull(),
    optionB: text('option_b').notNull(),
    optionAEn: text('option_a_en').notNull(),
    optionBEn: text('option_b_en').notNull(),
    category: wouldYouRatherCategoryEnum('category').notNull(),
    votesA: integer('votes_a').notNull().default(0),
    votesB: integer('votes_b').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('would_you_rather_options_unique').on(table.optionA, table.optionB)],
);

export type WouldYouRatherModel = typeof wouldYouRatherTable.$inferSelect;
export type WouldYouRatherCategory = (typeof wouldYouRatherCategoryEnum.enumValues)[number];

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

// ─── better-auth tables ───────────────────────────────────────────────────────

export const usersTable = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accountsTable = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verificationsTable = pgTable('verifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ─── Bet feature tables ───────────────────────────────────────────────────────

export const userProfilesTable = pgTable('user_profiles', {
  userId: varchar('user_id', { length: 36 })
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  pointsBalance: integer('points_balance').notNull().default(10000),
  lastLoginBonusAt: timestamp('last_login_bonus_at'),
});

export const betStatusEnum = pgEnum('bet_status', ['open', 'resolved', 'cancelled']);
export const betVisibilityEnum = pgEnum('bet_visibility', ['public', 'private']);

export const betsTable = pgTable('bets', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: varchar('owner_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id),
  status: betStatusEnum('status').notNull().default('open'),
  visibility: betVisibilityEnum('visibility').notNull().default('public'),
  resolvedOptionId: uuid('resolved_option_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const betOptionsTable = pgTable('bet_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  betId: uuid('bet_id')
    .notNull()
    .references(() => betsTable.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  totalPoints: integer('total_points').notNull().default(0),
});

export const wagersTable = pgTable('wagers', {
  id: uuid('id').primaryKey().defaultRandom(),
  betId: uuid('bet_id')
    .notNull()
    .references(() => betsTable.id, { onDelete: 'cascade' }),
  optionId: uuid('option_id')
    .notNull()
    .references(() => betOptionsTable.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id),
  amount: integer('amount').notNull(),
  purchaseOdds: doublePrecision('purchase_odds'),
  payout: integer('payout'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pointTransactionTypeEnum = pgEnum('point_transaction_type', [
  'signup_bonus',
  'login_bonus',
  'wager',
  'payout',
  'refund',
]);

export const pointTransactionsTable = pgTable('point_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id),
  amount: integer('amount').notNull(),
  type: pointTransactionTypeEnum('type').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const betAccessTypeEnum = pgEnum('bet_access_type', ['whitelist', 'blacklist']);

export const betAccessControlTable = pgTable('bet_access_control', {
  id: uuid('id').primaryKey().defaultRandom(),
  betId: uuid('bet_id')
    .notNull()
    .references(() => betsTable.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => usersTable.id),
  type: betAccessTypeEnum('type').notNull(),
});

export type UserModel = typeof usersTable.$inferSelect;
export type UserProfileModel = typeof userProfilesTable.$inferSelect;
export type BetModel = typeof betsTable.$inferSelect;
export type BetOptionModel = typeof betOptionsTable.$inferSelect;
export type WagerModel = typeof wagersTable.$inferSelect;
export type PointTransactionModel = typeof pointTransactionsTable.$inferSelect;

export const headsUpCategoryEnum = pgEnum('heads_up_category', [
  'everyday',
  'animals',
  'food',
  'movies',
  'celebrities',
  'music',
  'sports',
  'places',
  'jobs',
  'brands',
  'sexual',
]);

export const headsUpWordsTable = pgTable(
  'heads_up_words',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    word: text('word').notNull(),
    wordEn: text('word_en').notNull(),
    category: headsUpCategoryEnum('category').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('heads_up_words_word_category_unique').on(table.word, table.category)],
);

export type HeadsUpWordModel = typeof headsUpWordsTable.$inferSelect;
export type HeadsUpCategory = (typeof headsUpCategoryEnum.enumValues)[number];

export const hotTakeCategoryEnum = pgEnum('hot_take_category', [
  'normal',
  'food',
  'love',
  'work',
  'popculture',
  'lifestyle',
  'party',
  'unpopular',
  'sexual',
]);

export const hotTakesTable = pgTable('hot_takes', {
  id: uuid('id').primaryKey().defaultRandom(),
  statement: text('statement').notNull().unique(),
  statementEn: text('statement_en').notNull(),
  category: hotTakeCategoryEnum('category').notNull(),
  votesAgree: integer('votes_agree').notNull().default(0),
  votesDisagree: integer('votes_disagree').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type HotTakeModel = typeof hotTakesTable.$inferSelect;
export type HotTakeCategory = (typeof hotTakeCategoryEnum.enumValues)[number];

export const hotPotatoCategoryEnum = pgEnum('hot_potato_category', [
  'normal',
  'food',
  'animals',
  'popculture',
  'places',
  'music',
  'sports',
  'brands',
  'party',
  'sexual',
]);

export const hotPotatoPromptsTable = pgTable('hot_potato_prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  prompt: text('prompt').notNull().unique(),
  promptEn: text('prompt_en').notNull(),
  category: hotPotatoCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type HotPotatoPromptModel = typeof hotPotatoPromptsTable.$inferSelect;
export type HotPotatoCategory = (typeof hotPotatoCategoryEnum.enumValues)[number];

export const neverHaveIEverCategoryEnum = pgEnum('never_have_i_ever_category', [
  'normal',
  'party',
  'travel',
  'love',
  'food',
  'embarrassing',
  'school',
  'crazy',
  'deep',
  'sexual',
]);

export const neverHaveIEverTable = pgTable('never_have_i_ever', {
  id: uuid('id').primaryKey().defaultRandom(),
  statement: text('statement').notNull().unique(),
  statementEn: text('statement_en').notNull(),
  category: neverHaveIEverCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type NeverHaveIEverModel = typeof neverHaveIEverTable.$inferSelect;
export type NeverHaveIEverCategory = (typeof neverHaveIEverCategoryEnum.enumValues)[number];

export const mostLikelyToCategoryEnum = pgEnum('most_likely_to_category', [
  'normal',
  'party',
  'friends',
  'work',
  'love',
  'crazy',
  'future',
  'roast',
  'sexual',
]);

export const mostLikelyToTable = pgTable('most_likely_to', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull().unique(),
  questionEn: text('question_en').notNull(),
  category: mostLikelyToCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type MostLikelyToModel = typeof mostLikelyToTable.$inferSelect;
export type MostLikelyToCategory = (typeof mostLikelyToCategoryEnum.enumValues)[number];

export const wavelengthCategoryEnum = pgEnum('wavelength_category', [
  'normal',
  'food',
  'popculture',
  'people',
  'abstract',
  'party',
  'sexual',
]);

export const wavelengthSpectrumsTable = pgTable(
  'wavelength_spectrums',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    left: text('left').notNull(),
    right: text('right').notNull(),
    leftEn: text('left_en').notNull(),
    rightEn: text('right_en').notNull(),
    category: wavelengthCategoryEnum('category').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('wavelength_spectrums_unique').on(table.left, table.right)],
);

export type WavelengthSpectrumModel = typeof wavelengthSpectrumsTable.$inferSelect;
export type WavelengthCategory = (typeof wavelengthCategoryEnum.enumValues)[number];

export const codenamesCategoryEnum = pgEnum('codenames_category', [
  'classic',
  'places',
  'food',
  'popculture',
  'nature',
  'sexual',
]);

export const codenamesWordsTable = pgTable(
  'codenames_words',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    word: text('word').notNull(),
    wordEn: text('word_en').notNull(),
    category: codenamesCategoryEnum('category').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('codenames_words_unique').on(table.word, table.category)],
);

export type CodenamesWordModel = typeof codenamesWordsTable.$inferSelect;
export type CodenamesCategory = (typeof codenamesCategoryEnum.enumValues)[number];
