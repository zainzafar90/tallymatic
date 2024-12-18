import { relations, sql } from 'drizzle-orm';
import { customType, foreignKey, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@shared';

import { inventory } from './inventory.schema';
import { orderItems } from './order.schema';
import { organizations } from './organization.schema';
import { products } from './product.schema';
import { purchaseItems } from './purchase.schema';

const EnumStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});

export const variants = pgTable(
  'variants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
    name: varchar('name', { length: 255 }).notNull(),
    sku: varchar('sku', { length: 255 }).notNull(),
    barcode: varchar('barcode', { length: 255 }),
    price: numeric('price').notNull(),
    costPrice: numeric('cost_price'),
    stock: numeric('stock'),
    lowStockThreshold: integer('low_stock_threshold'),
    reorderPoint: integer('reorder_point'),
    reorderQuantity: integer('reorder_quantity'),
    status: EnumStatus('status').notNull().default(Status.ACTIVE),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    fk_product: foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

export const variantsRelations = relations(variants, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [variants.organizationId],
    references: [organizations.id],
  }),
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  inventory: many(inventory),
  orderItems: many(orderItems),
  purchaseItems: many(purchaseItems),
}));
