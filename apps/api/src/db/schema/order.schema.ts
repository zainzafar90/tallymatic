import { relations } from 'drizzle-orm';
import { customType, foreignKey, index, integer, numeric, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { OrderStatus, PaymentMethod, PaymentType } from '@repo/shared';

import { customers } from './customer.schema';
import { organizations } from './organization.schema';
import { variants } from './variant.schema';

const EnumOrderStatus = customType<{
  data: OrderStatus;
}>({
  dataType: () => 'text',
});

const EnumPaymentMethod = customType<{
  data: PaymentMethod;
}>({
  dataType: () => 'text',
});

const EnumPaymentType = customType<{
  data: PaymentType;
}>({
  dataType: () => 'text',
});

export const orders = pgTable(
  'orders',
  {
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
    paymentMethod: EnumPaymentMethod('payment_method').default(PaymentMethod.CASH),
    paymentType: EnumPaymentType('payment_type').default(PaymentType.CREDIT),
    amountPaid: numeric('amount_paid').default('0').notNull(),
    lastPaymentDate: timestamp('last_payment_date'),
  },
  (table) => ({
    fk_organization: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    organizationIdIdx: index('idx_orders_organization_id').on(table.organizationId),
    orderNumberIdx: index('idx_orders_order_number').on(table.orderNumber),
    statusIdx: index('idx_orders_status').on(table.status),
    organizationStatusIdx: index('idx_orders_organization_id_status').on(table.organizationId, table.status),
  })
);

export const orderItems = pgTable(
  'order_items',
  {
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
  },
  (table) => ({
    fk_variant: foreignKey({
      columns: [table.variantId],
      foreignColumns: [variants.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    fk_order: foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

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
