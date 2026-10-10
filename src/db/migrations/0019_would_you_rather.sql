CREATE TYPE "public"."would_you_rather_category" AS ENUM('normal', 'funny', 'gross', 'deep', 'crazy', 'party', 'coworkers', 'dilemma', 'sexual');--> statement-breakpoint
CREATE TABLE "would_you_rather" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_a_en" text NOT NULL,
	"option_b_en" text NOT NULL,
	"category" "would_you_rather_category" NOT NULL,
	"votes_a" integer DEFAULT 0 NOT NULL,
	"votes_b" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "would_you_rather_options_unique" UNIQUE("option_a","option_b")
);
