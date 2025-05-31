CREATE TABLE IF NOT EXISTS "impostor_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "impostor_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "impostor_words" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "impostor_words" ADD CONSTRAINT "impostor_words_category_id_impostor_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."impostor_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
