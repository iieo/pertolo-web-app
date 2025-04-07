ALTER TABLE "games" ALTER COLUMN "game_code" SET DATA TYPE varchar(4);--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "game_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN IF EXISTS "status";