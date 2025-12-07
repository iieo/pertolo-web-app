-- Step 1: Add category_id column as nullable first
ALTER TABLE "drink_tasks" ADD COLUMN "category_id" uuid;--> statement-breakpoint

-- Step 2: Populate category_id from the mapping table
UPDATE "drink_tasks" dt
SET "category_id" = dtcm."game_mode_id"
FROM "drink_task_category_mapping" dtcm
WHERE dt."id" = dtcm."task_id";--> statement-breakpoint

-- Step 3: Make category_id NOT NULL after populating
ALTER TABLE "drink_tasks" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint

-- Step 4: Add the foreign key constraint
DO $$ BEGIN
 ALTER TABLE "drink_tasks" ADD CONSTRAINT "drink_tasks_category_id_drink_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."drink_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

-- Step 5: Drop the mapping table after data is migrated
DROP TABLE "drink_task_category_mapping";
