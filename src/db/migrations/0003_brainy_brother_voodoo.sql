ALTER TABLE "games" DROP CONSTRAINT "games_current_mode_id_game_modes_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_current_task_id_tasks_id_fk";
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "game_settings" json NOT NULL;--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN IF EXISTS "current_mode_id";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN IF EXISTS "current_task_id";