CREATE TYPE "public"."hot_potato_category" AS ENUM('normal', 'food', 'animals', 'popculture', 'places', 'music', 'sports', 'brands', 'party', 'sexual');--> statement-breakpoint
CREATE TABLE "hot_potato_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt" text NOT NULL,
	"prompt_en" text NOT NULL,
	"category" "hot_potato_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hot_potato_prompts_prompt_unique" UNIQUE("prompt")
);
