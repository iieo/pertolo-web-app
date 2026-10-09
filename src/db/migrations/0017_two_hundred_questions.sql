CREATE TYPE "public"."two_hundred_question_category" AS ENUM('normal', 'friendly', 'coworkers', 'interactive', 'crazy', 'party', 'roast', 'exposed', 'future', 'deep', 'sexual');--> statement-breakpoint
CREATE TABLE "two_hundred_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"category" "two_hundred_question_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "two_hundred_questions_question_unique" UNIQUE("question")
);
