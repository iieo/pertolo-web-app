CREATE TYPE "public"."never_have_i_ever_category" AS ENUM('normal', 'party', 'travel', 'love', 'food', 'embarrassing', 'school', 'crazy', 'deep', 'sexual');--> statement-breakpoint
CREATE TABLE "never_have_i_ever" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"statement" text NOT NULL,
	"statement_en" text NOT NULL,
	"category" "never_have_i_ever_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "never_have_i_ever_statement_unique" UNIQUE("statement")
);
