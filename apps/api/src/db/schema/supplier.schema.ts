import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { organizations } from './organization.schema';
import { purchases } from './purchase.schema';

export const suppliers = pgTable(
  'suppliers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    contactName: varchar('contact_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 255 }),
    address: text('address'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    organizationIdIdx: index('idx_suppliers_organization_id').on(table.organizationId),
    emailIdx: index('idx_suppliers_email').on(table.email),
    companyNameIdx: index('idx_suppliers_company_name').on(table.companyName),
    organizationCompanyNameIdx: index('idx_suppliers_organization_id_company_name').on(
      table.organizationId,
      table.companyName
    ),
  })
);

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [suppliers.organizationId],
    references: [organizations.id],
  }),
  purchases: many(purchases),
}));
