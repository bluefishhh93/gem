ALTER TABLE "custom_bracelets" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "custom_bracelet_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_custom_bracelet_id_custom_bracelets_id_fk" FOREIGN KEY ("custom_bracelet_id") REFERENCES "public"."custom_bracelets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_id_index" ON "reviews" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_and_id_index" ON "reviews" ("created_at","id");