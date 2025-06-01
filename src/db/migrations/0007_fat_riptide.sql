DROP TABLE "games";--> statement-breakpoint
ALTER TABLE "game_mode_tasks" RENAME TO "drink_task_category_mapping";--> statement-breakpoint
ALTER TABLE "game_modes" RENAME TO "drink_categories";--> statement-breakpoint
ALTER TABLE "tasks" RENAME TO "drink_tasks";--> statement-breakpoint
ALTER TABLE "drink_categories" DROP CONSTRAINT "game_modes_name_unique";--> statement-breakpoint
ALTER TABLE "drink_task_category_mapping" DROP CONSTRAINT "game_mode_tasks_game_mode_id_game_modes_id_fk";
--> statement-breakpoint
ALTER TABLE "drink_task_category_mapping" DROP CONSTRAINT "game_mode_tasks_task_id_tasks_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drink_task_category_mapping" ADD CONSTRAINT "drink_task_category_mapping_game_mode_id_drink_categories_id_fk" FOREIGN KEY ("game_mode_id") REFERENCES "public"."drink_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "drink_task_category_mapping" ADD CONSTRAINT "drink_task_category_mapping_task_id_drink_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."drink_tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "drink_categories" ADD CONSTRAINT "drink_categories_name_unique" UNIQUE("name");