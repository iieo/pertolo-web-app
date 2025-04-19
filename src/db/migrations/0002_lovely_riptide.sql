ALTER TABLE "game_mode_tasks" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "game_mode_tasks" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "game_mode_tasks" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "content" json NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "text";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "target";--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "drinks";