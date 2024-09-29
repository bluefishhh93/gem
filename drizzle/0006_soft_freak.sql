ALTER TYPE "order_status" ADD VALUE 'cancelling';--> statement-breakpoint
ALTER TYPE "order_status" ADD VALUE 'completed';--> statement-breakpoint
ALTER TYPE "payment_status" ADD VALUE 'refunded';--> statement-breakpoint
ALTER TYPE "shipping_status" ADD VALUE 'processing';--> statement-breakpoint
ALTER TYPE "shipping_status" ADD VALUE 'delivered';--> statement-breakpoint
ALTER TYPE "shipping_status" ADD VALUE 'failed';