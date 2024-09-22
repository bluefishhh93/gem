ALTER TABLE "orders" ALTER COLUMN "total" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gf_user" ADD COLUMN "created_at" timestamp DEFAULT now();