CREATE TABLE "werewolf_games" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"owner_session_id" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'lobby' NOT NULL,
	"phase" varchar(20) DEFAULT 'lobby' NOT NULL,
	"roles_config" json DEFAULT '{}'::json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "werewolf_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" varchar(20) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(50),
	"is_alive" boolean DEFAULT true NOT NULL,
	"action_target_id" uuid,
	"is_owner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "werewolf_players" ADD CONSTRAINT "werewolf_players_game_id_werewolf_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."werewolf_games"("id") ON DELETE cascade ON UPDATE no action;