ALTER TABLE "inventory" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "currency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "stock" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "stock" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "low_stock_threshold" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "low_stock_threshold" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "reorder_point" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "reorder_point" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "reorder_quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "reorder_quantity" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;