import { relations } from 'drizzle-orm';
import { customType, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { Status } from '@repo/shared';

import { organizations } from './organization.schema';

const EnumStatus = customType<{
  data: Status;
}>({
  dataType: () => 'text',
});

export const stores = pgTable(
  'stores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    name: varchar('name', { length: 255 }).notNull(),
    address: text('address'),
    status: EnumStatus('status').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    organizationIdIdx: index('idx_stores_organization_id').on(table.organizationId),
    nameIdx: index('idx_stores_name').on(table.name),
    organizationNameIdx: index('idx_stores_organization_id_name').on(table.organizationId, table.name),
  })
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [stores.organizationId],
    references: [organizations.id],
  }),
}));
