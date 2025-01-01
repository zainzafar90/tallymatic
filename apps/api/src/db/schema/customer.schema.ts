import { relations } from 'drizzle-orm';
import { customType, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@repo/shared';

import { orders } from './order.schema';
import { organizations } from './organization.schema';

const EnumStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 255 }),
    address: text('address'),
    status: EnumStatus('status').notNull().default(Status.ACTIVE),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    organizationIdIdx: index('idx_customers_organization_id').on(table.organizationId),
    emailIdx: index('idx_customers_email').on(table.email),
    nameIdx: index('idx_customers_name').on(table.name),
    organizationNameIdx: index('idx_customers_organization_id_name').on(table.organizationId, table.name),
  })
);

export type Customer = typeof customers.$inferSelect;

export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  orders: many(orders),
}));
