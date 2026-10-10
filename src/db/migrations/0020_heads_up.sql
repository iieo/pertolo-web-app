CREATE TYPE "public"."heads_up_category" AS ENUM('everyday', 'animals', 'food', 'movies', 'celebrities', 'music', 'sports', 'places', 'jobs', 'brands', 'sexual');--> statement-breakpoint
CREATE TABLE "heads_up_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"word_en" text NOT NULL,
	"category" "heads_up_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "heads_up_words_word_category_unique" UNIQUE("word","category")
);
