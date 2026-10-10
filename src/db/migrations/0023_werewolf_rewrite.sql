DROP TABLE "werewolf_games" CASCADE;--> statement-breakpoint
DROP TABLE "werewolf_players" CASCADE;--> statement-breakpoint
CREATE TABLE "werewolf_games" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"status" varchar(20) DEFAULT 'lobby' NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"host_player_id" uuid,
	"roles_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"roles_custom" boolean DEFAULT false NOT NULL,
	"state" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "werewolf_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" varchar(8) NOT NULL,
	"token" varchar(64) NOT NULL,
	"name" varchar(40) NOT NULL,
	"seat" integer NOT NULL,
	"role" varchar(30),
	"is_alive" boolean DEFAULT true NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "werewolf_players_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "werewolf_players" ADD CONSTRAINT "werewolf_players_game_id_werewolf_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."werewolf_games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "werewolf_players_game_id_idx" ON "werewolf_players" USING btree ("game_id");