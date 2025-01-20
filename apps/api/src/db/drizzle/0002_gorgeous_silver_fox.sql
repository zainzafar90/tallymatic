ALTER TABLE "purchase_items" ADD COLUMN "accepted_quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD COLUMN "rejected_quantity" integer DEFAULT 0 NOT NULL;