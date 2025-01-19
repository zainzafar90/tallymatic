CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(255),
	"address" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"type" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"total_discount" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"customer_id" uuid,
	"order_number" varchar(255) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"total_amount" numeric,
	"subtotal" numeric,
	"tax_amount" numeric,
	"discount_amount" numeric,
	"currency" varchar(3) NOT NULL,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"payment_method" text DEFAULT 'cash',
	"payment_type" text DEFAULT 'credit',
	"amount_paid" numeric DEFAULT '0' NOT NULL,
	"last_payment_date" timestamp,
	"store_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(255),
	"website" varchar(255),
	"address" varchar(255),
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"category_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"store_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"supplier_id" uuid,
	"purchase_number" varchar(255) NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"total_amount" numeric,
	"expected_arrival_date" timestamp,
	"received_quantity" integer DEFAULT 0 NOT NULL,
	"total_quantity" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"payment_method" text DEFAULT 'cash',
	"payment_type" text DEFAULT 'debit',
	"amount_paid" numeric DEFAULT '0' NOT NULL,
	"last_payment_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(255),
	"address" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"type" text NOT NULL,
	"blacklisted" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"organization_id" uuid NOT NULL,
	"contact" varchar(255),
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(255) NOT NULL,
	"barcode" varchar(255),
	"price" numeric NOT NULL,
	"cost_price" numeric,
	"stock" numeric,
	"low_stock_threshold" integer,
	"reorder_point" integer,
	"reorder_quantity" integer,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_categories_organization_id" ON "categories" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_categories_name" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_categories_organization_id_name" ON "categories" USING btree ("organization_id","name");--> statement-breakpoint
CREATE INDEX "idx_categories_store_id" ON "categories" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_categories_store_id_name" ON "categories" USING btree ("store_id","name");--> statement-breakpoint
CREATE INDEX "idx_customers_organization_id" ON "customers" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_customers_store_id" ON "customers" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_customers_email" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_customers_name" ON "customers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_customers_store_id_name" ON "customers" USING btree ("store_id","name");--> statement-breakpoint
CREATE INDEX "idx_orders_organization_id" ON "orders" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_orders_order_number" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_organization_id_status" ON "orders" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_orders_store_id" ON "orders" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_orders_store_id_status" ON "orders" USING btree ("store_id","status");--> statement-breakpoint
CREATE INDEX "idx_products_organization_id" ON "products" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_products_name" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_products_category_id" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_products_organization_id_name" ON "products" USING btree ("organization_id","name");--> statement-breakpoint
CREATE INDEX "idx_products_store_id" ON "products" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_products_store_id_name" ON "products" USING btree ("store_id","name");--> statement-breakpoint
CREATE INDEX "idx_purchases_organization_id" ON "purchases" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_purchases_status" ON "purchases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_purchases_supplier_id" ON "purchases" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "idx_purchases_organization_id_status" ON "purchases" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_purchases_store_id" ON "purchases" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_purchases_store_id_status" ON "purchases" USING btree ("store_id","status");--> statement-breakpoint
CREATE INDEX "idx_stores_organization_id" ON "stores" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_stores_name" ON "stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_stores_organization_id_name" ON "stores" USING btree ("organization_id","name");--> statement-breakpoint
CREATE INDEX "idx_suppliers_organization_id" ON "suppliers" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_suppliers_email" ON "suppliers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_suppliers_company_name" ON "suppliers" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "idx_suppliers_organization_id_company_name" ON "suppliers" USING btree ("organization_id","company_name");--> statement-breakpoint
CREATE INDEX "idx_suppliers_store_id" ON "suppliers" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_suppliers_store_id_name" ON "suppliers" USING btree ("store_id","company_name");--> statement-breakpoint
CREATE INDEX "idx_tokens_token_type" ON "tokens" USING btree ("token","type");--> statement-breakpoint
CREATE INDEX "idx_tokens_user_id" ON "tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_users_name" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_users_organization_id" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_variants_organization_id" ON "variants" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_variants_product_id" ON "variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_variants_sku" ON "variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "idx_variants_name" ON "variants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_variants_store_id" ON "variants" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "idx_variants_store_id_name" ON "variants" USING btree ("store_id","name");