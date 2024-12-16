import { relations } from 'drizzle-orm';
import { customType, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { OrderStatus } from '@shared';

import { customers } from './customer.schema';
import { organizations } from './organization.schema';
import { variants } from './variant.schema';

const EnumOrderStatus = customType<{
  data: OrderStatus;
}>({
  dataType: () => 'text',
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  customerId: uuid('customer_id').references(() => customers.id),
  orderNumber: varchar('order_number', { length: 255 }).notNull(),
  status: EnumOrderStatus('status').notNull().default(OrderStatus.PENDING),
  totalAmount: numeric('total_amount'),
  subtotal: numeric('subtotal'),
  taxAmount: numeric('tax_amount'),
  discountAmount: numeric('discount_amount'),
  currency: varchar('currency', { length: 3 }).notNull(),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  variantId: uuid('variant_id')
    .notNull()
    .references(() => variants.id),
  quantity: integer('quantity').notNull(),
  price: numeric('price').notNull(),
  totalDiscount: numeric('total_discount'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),
}));
