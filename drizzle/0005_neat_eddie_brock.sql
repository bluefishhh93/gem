ALTER TABLE "products" ALTER COLUMN "is_activated" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "is_activated" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;