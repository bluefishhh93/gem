DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('cod', 'bank');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."shipping_status" AS ENUM('pending', 'shipping', 'shipped');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'user';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bracelet_charms" (
	"id" serial PRIMARY KEY NOT NULL,
	"bracelet_id" integer,
	"charm_id" integer,
	"position" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "charms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_bracelets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"string_id" integer,
	"total_price" double precision NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount" double precision NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "img_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text,
	"public_id" text,
	"product_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "img_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"public_id" text NOT NULL,
	"review_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gf_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"postId" integer,
	"isRead" boolean DEFAULT false NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"createdOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"subtotal" double precision NOT NULL,
	"is_rated" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text,
	"total" double precision,
	"order_status" "order_status" NOT NULL,
	"ship_address" text,
	"phone" text,
	"email" text,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"tracking_number" text,
	"shipping_status" "shipping_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"ship_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"current_quantity" integer NOT NULL,
	"price" double precision NOT NULL,
	"sale_price" double precision,
	"is_activated" boolean NOT NULL,
	"category_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text,
	"rating" integer NOT NULL,
	"user_id" integer,
	"product_id" integer,
	"order_item_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strings" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"material" text NOT NULL,
	"price" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gf_user" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bracelet_charms" ADD CONSTRAINT "bracelet_charms_bracelet_id_custom_bracelets_id_fk" FOREIGN KEY ("bracelet_id") REFERENCES "public"."custom_bracelets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bracelet_charms" ADD CONSTRAINT "bracelet_charms_charm_id_charms_id_fk" FOREIGN KEY ("charm_id") REFERENCES "public"."charms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_bracelets" ADD CONSTRAINT "custom_bracelets_user_id_gf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gf_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_bracelets" ADD CONSTRAINT "custom_bracelets_string_id_strings_id_fk" FOREIGN KEY ("string_id") REFERENCES "public"."strings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "img_products" ADD CONSTRAINT "img_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "img_reviews" ADD CONSTRAINT "img_reviews_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gf_notifications" ADD CONSTRAINT "gf_notifications_userId_gf_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."gf_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_gf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."gf_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
