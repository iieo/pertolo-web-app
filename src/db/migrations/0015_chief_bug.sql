CREATE TYPE "public"."bet_access_type" AS ENUM('whitelist', 'blacklist');--> statement-breakpoint
CREATE TYPE "public"."bet_status" AS ENUM('open', 'resolved', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."bet_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."point_transaction_type" AS ENUM('signup_bonus', 'login_bonus', 'wager', 'payout', 'refund');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bet_access_control" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bet_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"type" "bet_access_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bet_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bet_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"owner_id" varchar(36) NOT NULL,
	"status" "bet_status" DEFAULT 'open' NOT NULL,
	"visibility" "bet_visibility" DEFAULT 'public' NOT NULL,
	"resolved_option_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "point_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"amount" integer NOT NULL,
	"type" "point_transaction_type" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" varchar(255) NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"points_balance" integer DEFAULT 10000 NOT NULL,
	"last_login_bonus_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wagers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bet_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"amount" integer NOT NULL,
	"payout" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet_access_control" ADD CONSTRAINT "bet_access_control_bet_id_bets_id_fk" FOREIGN KEY ("bet_id") REFERENCES "public"."bets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet_access_control" ADD CONSTRAINT "bet_access_control_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet_options" ADD CONSTRAINT "bet_options_bet_id_bets_id_fk" FOREIGN KEY ("bet_id") REFERENCES "public"."bets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bets" ADD CONSTRAINT "bets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wagers" ADD CONSTRAINT "wagers_bet_id_bets_id_fk" FOREIGN KEY ("bet_id") REFERENCES "public"."bets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wagers" ADD CONSTRAINT "wagers_option_id_bet_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."bet_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wagers" ADD CONSTRAINT "wagers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;