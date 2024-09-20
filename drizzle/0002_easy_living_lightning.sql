ALTER TYPE "payment_method" ADD VALUE 'vnpay';--> statement-breakpoint
ALTER TABLE "img_products" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "img_products" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "img_products" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "is_activated" SET NOT NULL;