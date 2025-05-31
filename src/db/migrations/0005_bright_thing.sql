CREATE TABLE IF NOT EXISTS "impostor_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "impostor_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
DROP TABLE "players";