import { relations } from 'drizzle-orm';
import { customType, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { PurchaseStatus } from '@shared';

import { organizations } from './organization.schema';
import { suppliers } from './supplier.schema';
import { variants } from './variant.schema';

const EnumPurchaseStatus = customType<{
  data: PurchaseStatus;
}>({
  dataType: () => 'text',
});

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  supplierId: uuid('supplier_id').references(() => suppliers.id),
  orderNumber: varchar('order_number', { length: 255 }).notNull(),
  status: EnumPurchaseStatus('status').notNull().default(PurchaseStatus.DRAFT),
  totalAmount: numeric('total_amount').notNull(),
  expectedArrivalDate: timestamp('expected_arrival_date'),
  receivedQuantity: integer('received_quantity').notNull().default(0),
  totalQuantity: integer('total_quantity').notNull().default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const purchaseItems = pgTable('purchase_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchaseId: uuid('purchase_id')
    .notNull()
    .references(() => purchases.id),
  variantId: uuid('variant_id')
    .notNull()
    .references(() => variants.id),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [purchases.organizationId],
    references: [organizations.id],
  }),
  supplier: one(suppliers, {
    fields: [purchases.supplierId],
    references: [suppliers.id],
  }),
  items: many(purchaseItems),
}));

export const purchaseItemsRelations = relations(purchaseItems, ({ one }) => ({
  purchase: one(purchases, {
    fields: [purchaseItems.purchaseId],
    references: [purchases.id],
  }),
  variant: one(variants, {
    fields: [purchaseItems.variantId],
    references: [variants.id],
  }),
}));
