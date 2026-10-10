CREATE TYPE "public"."most_likely_to_category" AS ENUM('normal', 'party', 'friends', 'work', 'love', 'crazy', 'future', 'roast', 'sexual');--> statement-breakpoint
CREATE TABLE "most_likely_to" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"question_en" text NOT NULL,
	"category" "most_likely_to_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "most_likely_to_question_unique" UNIQUE("question")
);
