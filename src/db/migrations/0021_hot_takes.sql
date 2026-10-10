CREATE TYPE "public"."hot_take_category" AS ENUM('normal', 'food', 'love', 'work', 'popculture', 'lifestyle', 'party', 'unpopular', 'sexual');--> statement-breakpoint
CREATE TABLE "hot_takes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"statement" text NOT NULL,
	"statement_en" text NOT NULL,
	"category" "hot_take_category" NOT NULL,
	"votes_agree" integer DEFAULT 0 NOT NULL,
	"votes_disagree" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hot_takes_statement_unique" UNIQUE("statement")
);
