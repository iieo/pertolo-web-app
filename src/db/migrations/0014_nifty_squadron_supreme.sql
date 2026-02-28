CREATE TABLE "murderi_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" varchar(10) NOT NULL,
	"killer" text NOT NULL,
	"victim" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
