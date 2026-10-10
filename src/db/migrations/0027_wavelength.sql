CREATE TYPE "public"."wavelength_category" AS ENUM('normal', 'food', 'popculture', 'people', 'abstract', 'party', 'sexual');--> statement-breakpoint
CREATE TABLE "wavelength_spectrums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"left" text NOT NULL,
	"right" text NOT NULL,
	"left_en" text NOT NULL,
	"right_en" text NOT NULL,
	"category" "wavelength_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wavelength_spectrums_unique" UNIQUE("left","right")
);
