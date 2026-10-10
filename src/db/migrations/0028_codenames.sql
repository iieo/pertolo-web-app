CREATE TYPE "public"."codenames_category" AS ENUM('classic', 'places', 'food', 'popculture', 'nature', 'sexual');--> statement-breakpoint
CREATE TABLE "codenames_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"word_en" text NOT NULL,
	"category" "codenames_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "codenames_words_unique" UNIQUE("word","category")
);
